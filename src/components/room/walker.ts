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
  readonly nearRadius: number;
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
  // Waypoints of a scripted walk (click or wander). Empty when keys drive Chen.
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
  };
}

export function isBlocked<K extends string>(x: number, y: number, cfg: WalkerConfig<K>): boolean {
  const { bounds: b, bodyRadius: r } = cfg;
  if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) return true;
  return cfg.blocks.some((k) => x > k.x0 - r && x < k.x1 + r && y > k.y0 - r && y < k.y1 + r);
}

export function nearestSpot<K extends string>(x: number, y: number, cfg: WalkerConfig<K>): K | null {
  let best: K | null = null;
  let bestDistance = cfg.nearRadius;
  for (const key of Object.keys(cfg.spots) as K[]) {
    const [sx, sy] = cfg.spots[key];
    const d = Math.hypot(x - sx, y - sy);
    if (d < bestDistance) {
      bestDistance = d;
      best = key;
    }
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
    // Scripted walk: straight lines between waypoints, no collision.
    const [tx, ty] = state.path[0];
    const dx = tx - state.x;
    const dy = ty - state.y;
    const dist = Math.hypot(dx, dy);
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
      const n = nearestSpot(state.x, state.y, cfg);
      nearChanged = n !== state.near;
      state.near = n;
    }
    return { changed, nearChanged, open, userActed };
  }

  const dir = dialogOpen ? null : keysToWorld(keys);
  if (dir) {
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
    const n = nearestSpot(state.x, state.y, cfg);
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
