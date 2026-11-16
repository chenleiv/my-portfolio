import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { project } from "./iso.ts";
import {
  AUTO_OPEN_DWELL_SECONDS,
  BLOCKS,
  BODY_RADIUS,
  BOUNDS,
  HUB,
  OBJECT_AREAS,
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
  const points = reachable().filter(onRug);

  it("lets Chen reach Bucky from the rug", () => {
    assert.ok(points.some(([x, y]) => nearestObject(x, y, null, cfg) === "bucky"));
  });

  it("lets Chen reach the For fun sofa from the rug", () => {
    assert.ok(points.some(([x, y]) => nearestObject(x, y, null, cfg) === "tv"));
  });

  it("puts Bucky's spot on reachable rug floor", () => {
    const [sx, sy] = SPOTS.bucky;
    assert.ok(onRug([sx, sy]));
    assert.ok(points.some(([x, y]) => Math.hypot(x - sx, y - sy) < STEP));
  });
});
