// Shared by the room tests. Not a test file itself: the runner only picks up *.test.ts.
import { project } from "./iso.ts";
import {
  AUTO_OPEN_DWELL_SECONDS,
  BLOCKS,
  BODY_RADIUS,
  BOUNDS,
  HUB,
  OBJECT_AREAS,
  SPOTS,
  SWITCH_MARGIN,
  WALK_SPEED,
  type ObjectKey,
} from "./roomContent.ts";
import type { WalkerConfig } from "./walker.ts";

// The same walker configuration the room uses.
export const cfg: WalkerConfig<ObjectKey> = {
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

// Approximate label pill size in viewBox units at the smallest desktop room
// (400px tall for 490 units): about 9px per character plus 26px of padding,
// 28px tall, plus the 7px pulse ring on every side.
const PX = 490 / 400;
const RING = 7;
export function pill(name: string, x: number, y: number, z: number) {
  const [cx, cy] = project(x, y, z);
  const w = ((name.length * 9 + 26) * PX) / 2 + RING;
  const h = (28 * PX) / 2 + RING;
  return { x0: cx - w, x1: cx + w, y0: cy - h, y1: cy + h };
}

export type Pt = readonly [number, number];

export function hull(points: Pt[]): Pt[] {
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
export function overlaps(a: Pt[], b: Pt[]): boolean {
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
