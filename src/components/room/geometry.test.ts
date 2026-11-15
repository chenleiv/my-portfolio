import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { project, VIEW_BOX, WALL_H } from "./iso.ts";
import { HUB, ROOM_OBJECTS } from "./roomContent.ts";

// Room labels are pills about 28px tall and up to about 80px wide, with a 7px
// pulse ring. In viewBox units that stays under these margins at any rendered size
// of at least 500px wide.
const LABEL_MARGIN_X = 40;
const LABEL_MARGIN_Y = 18;

function inside(sx: number, sy: number, mx: number, my: number) {
  return (
    sx >= VIEW_BOX.x + mx &&
    sx <= VIEW_BOX.x + VIEW_BOX.w - mx &&
    sy >= VIEW_BOX.y + my &&
    sy <= VIEW_BOX.y + VIEW_BOX.h - my
  );
}

describe("viewBox", () => {
  it("is wider than tall", () => {
    assert.ok(VIEW_BOX.w / VIEW_BOX.h > 1.3, `ratio ${VIEW_BOX.w / VIEW_BOX.h}`);
  });

  it("contains every corner of the room", () => {
    for (const x of [0, 10]) {
      for (const y of [0, 10]) {
        for (const z of [0, WALL_H]) {
          const [sx, sy] = project(x, y, z);
          assert.ok(inside(sx, sy, 0, 0), `corner ${x},${y},${z} at ${sx},${sy}`);
        }
      }
    }
  });

  it("keeps every label fully inside, with room for its pill and ring", () => {
    for (const o of ROOM_OBJECTS) {
      const [sx, sy] = project(o.label.x, o.label.y, o.label.z);
      assert.ok(inside(sx, sy, LABEL_MARGIN_X, LABEL_MARGIN_Y), `label ${o.key} at ${sx},${sy}`);
    }
  });

  it("keeps every spot and the hub inside", () => {
    for (const [x, y] of [...ROOM_OBJECTS.map((o) => o.spot), HUB]) {
      const [sx, sy] = project(x, y, 0);
      assert.ok(inside(sx, sy, 0, 0), `spot ${x},${y}`);
    }
  });
});
