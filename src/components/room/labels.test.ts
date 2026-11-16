import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { project } from "./iso.ts";
import { hull, overlaps, pill, type Pt } from "./testGeometry.ts";
import { ROOM_OBJECTS, SCENE_FOOTPRINTS, type ObjectKey, type SceneItemId } from "./roomContent.ts";

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
  "sofa-front": 0.8,
  plant: 1.7,
};

// Items a label may sit on: its own object. Bucky lies on the front sofa
// section, so his label may sit over it but must clear everything else.
const OWN: Record<ObjectKey, readonly SceneItemId[]> = {
  desk: ["desk", "chair"],
  shelf: ["shelf"],
  tv: ["tv"],
  bucky: ["sofa-front"],
  contact: [],
};

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
