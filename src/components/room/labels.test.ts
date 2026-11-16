import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { project } from "./iso.ts";
import { ROOM_OBJECTS, SCENE_FOOTPRINTS, type ObjectKey, type SceneItemId } from "./roomContent.ts";

// Approximate label pill size in viewBox units at the smallest desktop room
// (400px tall for 490 units): about 9px per character plus 26px of padding,
// 28px tall, plus the 7px pulse ring on every side.
const PX = 490 / 400;
const RING = 7;
function pill(name: string, x: number, y: number, z: number) {
  const [cx, cy] = project(x, y, z);
  const w = ((name.length * 9 + 26) * PX) / 2 + RING;
  const h = (28 * PX) / 2 + RING;
  return { x0: cx - w, x1: cx + w, y0: cy - h, y1: cy + h };
}

// How tall each floor item is drawn, in world units.
const HEIGHT: Partial<Record<SceneItemId, number>> = {
  guitar: 2.45,
  shelf: 3.6,
  lamp: 3.4,
  tv: 2.3,
  desk: 3.3,
  chair: 2.54,
  "coffee-table": 0.67,
  sofa: 1.7,
  "sofa-front": 0.45,
  plant: 1.7,
};

// Items a label may sit on: its own object. Bucky lies on the front sofa
// section, so his label may sit over it but must clear everything else.
const OWN: Record<ObjectKey, readonly SceneItemId[]> = {
  desk: ["desk", "chair"],
  shelf: ["shelf"],
  tv: ["tv", "sofa"],
  bucky: ["sofa-front"],
  contact: [],
};

type Pt = readonly [number, number];

function hull(points: Pt[]): Pt[] {
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
function overlaps(a: Pt[], b: Pt[]): boolean {
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

describe("labels", () => {
  it("do not cover any other object", () => {
    for (const o of ROOM_OBJECTS) {
      const r = pill(o.name, o.label.x, o.label.y, o.label.z);
      const rect: Pt[] = [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]];
      for (const f of SCENE_FOOTPRINTS) {
        const h = HEIGHT[f.id];
        if (!f.rect || h === undefined || OWN[o.key].includes(f.id)) continue;
        const { x0, y0, x1, y1 } = f.rect;
        const corners: Pt[] = [];
        for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [0, h]) corners.push(project(x, y, z));
        assert.equal(overlaps(rect, hull(corners)), false, `label ${o.name} covers ${f.id}`);
      }
    }
  });
});
