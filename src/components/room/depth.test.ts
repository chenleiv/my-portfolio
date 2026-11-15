import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { drawSlot, isInFront } from "./depth.ts";
import { BODY_RADIUS, FOOTPRINT_BY_ID, FOOTPRINT_RECTS, SCENE_FOOTPRINTS, SPOTS, type SceneItemId } from "./roomContent.ts";

const indexOf = (id: SceneItemId) => SCENE_FOOTPRINTS.findIndex((f) => f.id === id);

// True when Chen at (x, y) is drawn after the item, so she covers it.
const drawnInFrontOf = (x: number, y: number, id: SceneItemId) => drawSlot(x, y, FOOTPRINT_RECTS) > indexOf(id);

describe("scene order", () => {
  it("lists every item behind the items in front of it", () => {
    // For two floor items, B must come after A when B is past A's far x or y edge
    // and A is not past B's in the other direction.
    const floor = SCENE_FOOTPRINTS.flatMap((f) => (f.rect ? [{ id: f.id, rect: f.rect }] : []));
    for (const a of floor) {
      for (const b of floor) {
        if (a === b) continue;
        const ra = a.rect;
        const rb = b.rect;
        const bInFront = rb.x0 >= ra.x1 || rb.y0 >= ra.y1;
        const aInFront = ra.x0 >= rb.x1 || ra.y0 >= rb.y1;
        if (bInFront && !aInFront) {
          assert.ok(indexOf(b.id) > indexOf(a.id), `${b.id} should come after ${a.id}`);
        }
      }
    }
  });
});

describe("Chen's draw order", () => {
  const bucky = FOOTPRINT_BY_ID.bucky;
  const sofa = FOOTPRINT_BY_ID.sofa;
  const chair = FOOTPRINT_BY_ID.chair;
  const gap = BODY_RADIUS + 0.05;

  it("is in front of Bucky at his spot", () => {
    const [x, y] = SPOTS.bucky;
    assert.ok(isInFront(x, y, bucky));
    assert.ok(drawnInFrontOf(x, y, "bucky"));
  });

  it("is behind Bucky when standing on his far side", () => {
    const x = (bucky.x0 + bucky.x1) / 2;
    const y = bucky.y0 - gap;
    assert.equal(drawnInFrontOf(x, y, "bucky"), false);
  });

  it("is behind the sofa when standing on its left", () => {
    const x = sofa.x0 - gap;
    const y = (sofa.y0 + sofa.y1) / 2;
    assert.equal(drawnInFrontOf(x, y, "sofa"), false);
  });

  it("is in front of the chair when standing on its right", () => {
    const x = chair.x1 + gap;
    const y = (chair.y0 + chair.y1) / 2;
    assert.ok(drawnInFrontOf(x, y, "chair"));
  });

  it("is in front of the desk and the chair at the desk spot", () => {
    const [x, y] = SPOTS.desk;
    assert.ok(drawnInFrontOf(x, y, "desk"));
    assert.ok(drawnInFrontOf(x, y, "chair"));
  });

  it("is always in front of the window", () => {
    for (const [x, y] of Object.values(SPOTS)) {
      assert.ok(drawnInFrontOf(x, y, "window"));
    }
  });
});
