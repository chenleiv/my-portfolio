import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { project } from "./iso.ts";
import { BUCKY_LAYOUT, OBJECT_BY_KEY, ROOM_OBJECTS, RUG, SPOTS, START } from "./roomContent.ts";
import { isBlocked, nearestObject } from "./walker.ts";
import { cfg, hull as convexHull, overlaps as convexOverlap, pill, type Pt } from "./testGeometry.ts";

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
