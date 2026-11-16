// Pure walking logic for the room. No DOM, no React: the hook in useWalker.ts
// owns the frame loop and calls tick() once per frame. Only type imports here,
// so the Node test runner can load this file directly.
import type { Rect, Vec2 } from "./roomContent";

export interface WalkerConfig<K extends string> {
  readonly spots: Readonly<Record<K, Vec2>>;
  readonly hub: Vec2;
  readonly blocks: readonly Rect[];
  readonly bounds: Rect;
  readonly bodyRadius: number;
  // Proximity areas in priority order: earlier wins an exact tie.
  readonly areas: readonly { readonly key: K; readonly rects: readonly Rect[]; readonly margin: number }[];
  // A different object takes over from the current one only when closer by more than this.
  readonly switchMargin: number;
  readonly speed: number;
  readonly dwellSeconds: number;
}

export interface HeldKeys {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface WalkerState<K extends string> {
  x: number;
  y: number;
  // Waypoints of a walk started by a click. Empty when keys drive Chen.
  path: Vec2[];
  moving: boolean;
  // Walk cycle phase in radians.
  phase: number;
  // Object Chen is standing next to, if any.
  near: K | null;
  // Object whose popup was just closed; it does not auto-open again until Chen leaves it.
  suppress: K | null;
  // Seconds spent standing still next to `near` after moving with the keys.
  dwell: number;
  // True once the user has walked with the keys since the last auto-open or close.
  userMoved: boolean;
  // Way Chen faces, from her last move. Kept while she stands still.
  facing: Facing;
}

// Front is toward the viewer (down the screen), back is away from it; left and
// right are on screen.
interface Facing {
  readonly front: boolean;
  readonly right: boolean;
}

// Facing after a step of (dx, dy) in world space. A step straight down or up the
// screen keeps the left or right side; a step straight across keeps front or back.
function facingAfter(prev: Facing, dx: number, dy: number): Facing {
  const sx = dx - dy; // screen x
  const sy = dx + dy; // screen y, positive toward the viewer
  const EPS = 1e-9;
  return {
    front: sy > EPS ? true : sy < -EPS ? false : prev.front,
    right: sx > EPS ? true : sx < -EPS ? false : prev.right,
  };
}

export interface TickResult<K extends string> {
  // Position or pose changed, so the figure needs redrawing.
  readonly changed: boolean;
  readonly nearChanged: boolean;
  // Object whose popup should open now, from standing still next to it.
  readonly open: K | null;
  // The user moved Chen with the keys this frame.
  readonly userActed: boolean;
}

export const noKeys = (): HeldKeys => ({ up: false, down: false, left: false, right: false });

export function createWalkerState<K extends string>(start: Vec2): WalkerState<K> {
  return {
    x: start[0],
    y: start[1],
    path: [],
    moving: false,
    phase: 0,
    near: null,
    suppress: null,
    dwell: 0,
    userMoved: false,
    facing: { front: true, right: false },
  };
}

export function isBlocked<K extends string>(x: number, y: number, cfg: WalkerConfig<K>): boolean {
  const { bounds: b, bodyRadius: r } = cfg;
  if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) return true;
  return cfg.blocks.some((k) => x > k.x0 - r && x < k.x1 + r && y > k.y0 - r && y < k.y1 + r);
}

// Distance from a point to a rectangle; 0 inside it.
function distanceToRect(x: number, y: number, r: Rect): number {
  const dx = Math.max(r.x0 - x, 0, x - r.x1);
  const dy = Math.max(r.y0 - y, 0, y - r.y1);
  return Math.hypot(dx, dy);
}

// Object Chen is next to: the closest area within its margin. Exact ties go to
// the area listed first. While `current` is still within its margin it is kept
// unless another object is closer by more than switchMargin, so two neighbors
// never alternate as Chen walks between them.
export function nearestObject<K extends string>(x: number, y: number, current: K | null, cfg: WalkerConfig<K>): K | null {
  let best: K | null = null;
  let bestDistance = Infinity;
  let currentDistance = Infinity;
  for (const area of cfg.areas) {
    const d = Math.min(...area.rects.map((r) => distanceToRect(x, y, r)));
    if (d > area.margin) continue;
    if (area.key === current) currentDistance = d;
    if (d < bestDistance) {
      bestDistance = d;
      best = area.key;
    }
  }
  if (current !== null && best !== current && currentDistance !== Infinity && bestDistance > currentDistance - cfg.switchMargin) {
    return current;
  }
  return best;
}

// Screen directions to a unit vector in world space. "Up" on screen is toward
// the back corner of the room, which is -x and -y in world space.
export function keysToWorld(keys: HeldKeys): Vec2 | null {
  const sx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  const sy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
  const wx = sx + sy;
  const wy = sy - sx;
  const len = Math.hypot(wx, wy);
  return len > 0 ? [wx / len, wy / len] : null;
}

// Starts a walk to `target` through the hub, or jumps there when `teleport`
// is set or Chen is already there. Returns true when Chen jumped.
export function planWalk<K extends string>(
  state: WalkerState<K>,
  key: K,
  cfg: WalkerConfig<K>,
  teleport: boolean,
): boolean {
  const target = cfg.spots[key];
  if (teleport || Math.hypot(state.x - target[0], state.y - target[1]) < 0.2) {
    state.x = target[0];
    state.y = target[1];
    state.path = [];
    state.moving = false;
    state.phase = 0;
    state.near = key;
    return true;
  }
  state.path = [cfg.hub, target];
  return false;
}

// Called when a popup closes, however it was opened.
export function onDialogClosed<K extends string>(state: WalkerState<K>): void {
  state.suppress = state.near;
  state.dwell = 0;
  state.userMoved = false;
}

export function tick<K extends string>(
  state: WalkerState<K>,
  keys: HeldKeys,
  dt: number,
  dialogOpen: boolean,
  cfg: WalkerConfig<K>,
): TickResult<K> {
  let changed = false;
  let nearChanged = false;
  let open: K | null = null;
  let userActed = false;
  const step = cfg.speed * dt;

  if (state.path.length > 0) {
    // Walk after a click: straight lines between waypoints, no collision.
    const [tx, ty] = state.path[0];
    const dx = tx - state.x;
    const dy = ty - state.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0) state.facing = facingAfter(state.facing, dx, dy);
    if (dist <= step) {
      state.x = tx;
      state.y = ty;
      state.path.shift();
    } else {
      state.x += (dx / dist) * step;
      state.y += (dy / dist) * step;
    }
    state.moving = true;
    state.phase += dt * 10;
    changed = true;
    if (state.path.length === 0) {
      state.moving = false;
      state.phase = 0;
      const n = nearestObject(state.x, state.y, state.near, cfg);
      nearChanged = n !== state.near;
      state.near = n;
    }
    return { changed, nearChanged, open, userActed };
  }

  const dir = dialogOpen ? null : keysToWorld(keys);
  if (dir) {
    // She turns to the keys' direction even when furniture stops her.
    state.facing = facingAfter(state.facing, dir[0], dir[1]);
    // Move each axis on its own so Chen slides along furniture edges.
    const nx = state.x + dir[0] * step;
    const ny = state.y + dir[1] * step;
    if (!isBlocked(nx, state.y, cfg)) state.x = nx;
    if (!isBlocked(state.x, ny, cfg)) state.y = ny;
    state.moving = true;
    state.phase += dt * 10;
    state.userMoved = true;
    state.dwell = 0;
    changed = true;
    userActed = true;
    const n = nearestObject(state.x, state.y, state.near, cfg);
    if (n !== state.near) {
      state.near = n;
      nearChanged = true;
      if (state.suppress !== null && n !== state.suppress) state.suppress = null;
    }
    return { changed, nearChanged, open, userActed };
  }

  if (state.moving) {
    state.moving = false;
    state.phase = 0;
    changed = true;
  }
  if (!dialogOpen && state.userMoved && state.near !== null && state.near !== state.suppress) {
    state.dwell += dt;
    if (state.dwell >= cfg.dwellSeconds) {
      open = state.near;
      state.suppress = state.near;
      state.userMoved = false;
      state.dwell = 0;
    }
  }
  return { changed, nearChanged, open, userActed };
}
