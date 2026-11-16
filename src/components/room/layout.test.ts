import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { project } from "./iso.ts";
import {
  AUTO_OPEN_DWELL_SECONDS,
  BLOCKS,
  BODY_RADIUS,
  BOUNDS,
  BUCKY_LAYOUT,
  HUB,
  OBJECT_AREAS,
  OBJECT_BY_KEY,
  ROOM_OBJECTS,
  RUG,
  SPOTS,
  START,
  SWITCH_MARGIN,
  WALK_SPEED,
  type ObjectKey,
} from "./roomContent.ts";
import { isBlocked, nearestObject, type WalkerConfig } from "./walker.ts";

const cfg: WalkerConfig<ObjectKey> = {
  spots: SPOTS,
  hub: HUB,
  blocks: BLOCKS,
  bounds: BOUNDS,
  bodyRadius: BODY_RADIUS,
  areas: OBJECT_AREAS,
  switchMargin: SWITCH_MARGIN,
  speed: WALK_SPEED,
  dwellSeconds: AUTO_OPEN_DWELL_SECONDS,
};

// Same pill size as labels.test.ts: about 9px per character plus 26px of
// padding, 28px tall, plus the 7px pulse ring, at the smallest desktop room.
const PX = 490 / 400;
const RING = 7;
function pill(name: string, x: number, y: number, z: number) {
  const [cx, cy] = project(x, y, z);
  const w = ((name.length * 9 + 26) * PX) / 2 + RING;
  const h = (28 * PX) / 2 + RING;
  return { x0: cx - w, x1: cx + w, y0: cy - h, y1: cy + h };
}

describe("label bubbles", () => {
  it("never overlap each other", () => {
    const pills = ROOM_OBJECTS.map((o) => ({ key: o.key, ...pill(o.name, o.label.x, o.label.y, o.label.z) }));
    for (let i = 0; i < pills.length; i++) {
      for (let j = i + 1; j < pills.length; j++) {
        const a = pills[i];
        const b = pills[j];
        const overlap = a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
        assert.equal(overlap, false, `${a.key} and ${b.key} labels overlap`);
      }
    }
  });

  it("keep Bucky's label off Bucky himself", () => {
    // The box Bucky is drawn in: his raw drawing turned to lie along x, scaled,
    // centered and lifted onto the chaise. His tallest parts (head, ears) are 0.7 high.
    const { raw, scale, center, lift } = BUCKY_LAYOUT;
    const halfLength = ((raw.y1 - raw.y0) * scale) / 2;
    const halfWidth = ((raw.x1 - raw.x0) * scale) / 2;
    const corners: Pt[] = [];
    for (const x of [center[0] - halfLength, center[0] + halfLength]) {
      for (const y of [center[1] - halfWidth, center[1] + halfWidth]) {
        for (const z of [lift, lift + 0.7 * scale]) corners.push(project(x, y, z));
      }
    }
    const { label, name } = OBJECT_BY_KEY.bucky;
    const r = pill(name, label.x, label.y, label.z);
    const rect: Pt[] = [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]];
    assert.equal(convexOverlap(rect, convexHull(corners)), false);
  });
});

type Pt = readonly [number, number];

function convexHull(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  const upper: Pt[] = [];
  for (const q of p) {
    while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  for (const q of [...p].reverse()) {
    while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

// Separating axis test between two convex polygons.
function convexOverlap(a: Pt[], b: Pt[]): boolean {
  for (const poly of [a, b]) {
    for (let i = 0; i < poly.length; i++) {
      const [x1, y1] = poly[i];
      const [x2, y2] = poly[(i + 1) % poly.length];
      const n = [y2 - y1, x1 - x2];
      const pa = a.map((p) => p[0] * n[0] + p[1] * n[1]);
      const pb = b.map((p) => p[0] * n[0] + p[1] * n[1]);
      if (Math.max(...pa) <= Math.min(...pb) || Math.max(...pb) <= Math.min(...pa)) return false;
    }
  }
  return true;
}

// Every free floor point Chen can reach from her start by walking, on a fine grid.
const STEP = 0.05;
function reachable(): [number, number][] {
  const toCell = (v: number) => Math.round(v / STEP);
  const seen = new Set<string>();
  const out: [number, number][] = [];
  const queue: [number, number][] = [[toCell(START[0]), toCell(START[1])]];
  while (queue.length > 0) {
    const [i, j] = queue.shift()!;
    const id = `${i},${j}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const x = i * STEP;
    const y = j * STEP;
    if (isBlocked(x, y, cfg)) continue;
    out.push([x, y]);
    queue.push([i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]);
  }
  return out;
}

const onRug = ([x, y]: [number, number]) => x >= RUG.x0 && x <= RUG.x1 && y >= RUG.y0 && y <= RUG.y1;

describe("the L-shaped sofa", () => {
  const floor = reachable();
  const points = floor.filter(onRug);

  it("lets Chen reach Bucky from the rug", () => {
    assert.ok(points.some(([x, y]) => nearestObject(x, y, null, cfg) === "bucky"));
  });

  it("lets Chen reach the TV", () => {
    assert.ok(floor.some(([x, y]) => nearestObject(x, y, null, cfg) === "tv"));
  });

  it("puts Bucky's spot on reachable rug floor", () => {
    const [sx, sy] = SPOTS.bucky;
    assert.ok(onRug([sx, sy]));
    assert.ok(points.some(([x, y]) => Math.hypot(x - sx, y - sy) < STEP));
  });
});

describe("the start position", () => {
  it("starts on open floor, next to no object", () => {
    const [x, y] = START;
    assert.equal(isBlocked(x, y, cfg), false);
    assert.equal(nearestObject(x, y, null, cfg), null);
  });
});
