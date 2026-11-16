// Room configuration: objects, where Chen stands for each, labels, collision
// and timing. Keep this file free of runtime imports so the Node test runner
// can load it directly. Links and project data live in RoomPopupBody.tsx.

export type ObjectKey = "desk" | "shelf" | "tv" | "bucky" | "contact";

export type Vec2 = readonly [number, number];

export interface Rect {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

export interface RoomObject {
  readonly key: ObjectKey;
  // Short name on the scene label and the quick button.
  readonly name: string;
  // Popup heading.
  readonly title: string;
  // Where Chen walks to after a click on the object. Proximity uses OBJECT_AREAS.
  readonly spot: Vec2;
  // World anchor of the label in the scene.
  readonly label: { readonly x: number; readonly y: number; readonly z: number };
}

// Order matches the quick buttons under the scene.
export const ROOM_OBJECTS: readonly RoomObject[] = [
  { key: "desk", name: "Projects", title: "Projects", spot: [8.0, 3.7], label: { x: 7.2, y: 1.1, z: 2.0 } },
  { key: "shelf", name: "Skills", title: "Skills", spot: [1.5, 3.7], label: { x: 0.45, y: 3.7, z: 4.1 } },
  { key: "tv", name: "For fun", title: "For fun", spot: [1.5, 9.0], label: { x: 0.35, y: 7.95, z: 1.6 } },
  { key: "bucky", name: "Bucky", title: "Bucky", spot: [3.6, 5.0], label: { x: 4.4, y: 9.4, z: 0.3 } },
  { key: "contact", name: "Contact & CV", title: "Get in touch", spot: [2.75, 1.5], label: { x: 2.75, y: 0.0, z: 4.9 } },
];

// Order of the Places buttons in the How to play panel. ROOM_OBJECTS keeps its
// own order, which also breaks proximity ties.
export const PLACES_ORDER: readonly ObjectKey[] = ["desk", "shelf", "contact", "tv", "bucky"];

export const OBJECT_BY_KEY: Readonly<Record<ObjectKey, RoomObject>> = Object.fromEntries(
  ROOM_OBJECTS.map((o) => [o.key, o]),
) as Record<ObjectKey, RoomObject>;

export const SPOTS: Readonly<Record<ObjectKey, Vec2>> = Object.fromEntries(
  ROOM_OBJECTS.map((o) => [o.key, o.spot]),
) as Record<ObjectKey, Vec2>;

// Clicked walks go through this open floor point so they never cut through furniture.
export const HUB: Vec2 = [3.6, 4.2];

export const START: Vec2 = SPOTS.desk;

// Bucky lies along world y on the rug, beside the coffee table on the TV side. RAW is the box his
// drawing spans at scale 1; Bucky.tsx scales it about its center and moves
// that center to CENTER.
export const BUCKY_LAYOUT = {
  raw: { x0: 4.05, y0: 4.9, x1: 4.85, y1: 7.5 },
  scale: 1.1,
  center: [2.74, 6.8],
} as const;

function scaledFootprint({ raw, scale, center }: typeof BUCKY_LAYOUT): Rect {
  const hw = ((raw.x1 - raw.x0) * scale) / 2;
  const hd = ((raw.y1 - raw.y0) * scale) / 2;
  return { x0: center[0] - hw, y0: center[1] - hd, x1: center[0] + hw, y1: center[1] + hd };
}

// The living-room rug, long side along world y, in front of the sofa. Floor decoration, not a block.
export const RUG: Rect = { x0: 2.15, y0: 3.8, x1: 7.4, y1: 9.8 };

// Items mounted on a wall: no floor footprint, always behind Chen.
export type WallItemId = "contact-board" | "window";

export type SceneItemId =
  | WallItemId
  | "guitar"
  | "shelf"
  | "lamp"
  | "tv"
  | "desk"
  | "chair"
  | "coffee-table"
  | "bucky"
  | "sofa"
  | "plant";

export interface SceneFootprint {
  readonly id: SceneItemId;
  // Floor rectangle the item stands on, or null for items on the wall,
  // which are always behind Chen.
  readonly rect: Rect | null;
}

// Every scene item, back to front. Each footprint is used both for collision
// and for drawing Chen in the right order (see depth.ts).
export const SCENE_FOOTPRINTS: readonly SceneFootprint[] = [
  { id: "contact-board", rect: null },
  { id: "window", rect: null },
  { id: "guitar", rect: { x0: 0.15, y0: 0.05, x1: 0.75, y1: 0.3 } },
  { id: "shelf", rect: { x0: 0, y0: 2.2, x1: 0.9, y1: 5.2 } },
  { id: "lamp", rect: { x0: 0.2, y0: 5.35, x1: 0.6, y1: 5.75 } },
  { id: "tv", rect: { x0: 0, y0: 6.2, x1: 1.2, y1: 9.2 } },
  // Runs along the back wall to its end (x = 10), with a landscape and a portrait monitor.
  { id: "desk", rect: { x0: 5.6, y0: 0.3, x1: 10.0, y1: 1.8 } },
  { id: "chair", rect: { x0: 6.9, y0: 2.35, x1: 7.9, y1: 3.37 } },
  { id: "bucky", rect: scaledFootprint(BUCKY_LAYOUT) },
  // In front of Bucky (larger x), so it is drawn after him.
  { id: "coffee-table", rect: { x0: 4.28, y0: 5.7, x1: 5.28, y1: 7.3 } },
  { id: "sofa", rect: { x0: 7.4, y0: 5.3, x1: 8.9, y1: 8.3 } },
  // On the floor just past the sofa's left end, toward the front-left edge.
  // In front of the sofa along y, so it is drawn after it.
  { id: "plant", rect: { x0: 7.9, y0: 9.0, x1: 8.35, y1: 9.45 } },
];

export const FOOTPRINT_RECTS: readonly (Rect | null)[] = SCENE_FOOTPRINTS.map((f) => f.rect);

// Floor footprints by item, for drawing furniture where its footprint is.
export const FOOTPRINT_BY_ID = Object.fromEntries(
  SCENE_FOOTPRINTS.flatMap((f) => (f.rect ? [[f.id, f.rect]] : [])),
) as Readonly<Record<Exclude<SceneItemId, WallItemId>, Rect>>;

// Furniture Chen cannot walk into: every floor footprint.
export const BLOCKS: readonly Rect[] = SCENE_FOOTPRINTS.flatMap((f) => (f.rect ? [f.rect] : []));

export const BOUNDS: Rect = { x0: 0.45, y0: 0.5, x1: 9.7, y1: 9.7 };

// Half the width of Chen's footprint, used to pad every block.
export const BODY_RADIUS = 0.28;

// Chen counts as "next to" an object when her distance to any of its
// footprints is at most its margin. Collision keeps her at least BODY_RADIUS away.
export const NEAR_MARGIN = 0.8;

// The contact board hangs on the back wall and Chen cannot get closer than
// BOUNDS.y0 to it, so it gets a wider margin.
export const BOARD_NEAR_MARGIN = 1.6;

// While Chen is still next to the current object, another one takes over only
// when it is closer by more than this. Stops neighbors (Bucky and the sofa)
// from fighting for the popup as she walks between them.
export const SWITCH_MARGIN = 0.15;

// Strip of floor under the contact board, used only for proximity.
const CONTACT_WALL: Rect = { x0: 1.0, y0: 0, x1: 4.5, y1: 0.05 };

export interface ObjectArea {
  readonly key: ObjectKey;
  readonly rects: readonly Rect[];
  readonly margin: number;
}

// Proximity areas, in ROOM_OBJECTS order, which also breaks exact ties.
export const OBJECT_AREAS: readonly ObjectArea[] = ROOM_OBJECTS.map((o) => {
  const f = FOOTPRINT_BY_ID;
  switch (o.key) {
    case "desk":
      return { key: o.key, rects: [f.desk, f.chair], margin: NEAR_MARGIN };
    case "shelf":
      return { key: o.key, rects: [f.shelf], margin: NEAR_MARGIN };
    case "tv":
      return { key: o.key, rects: [f.tv, f.sofa], margin: NEAR_MARGIN };
    case "bucky":
      return { key: o.key, rects: [f.bucky], margin: NEAR_MARGIN };
    case "contact":
      return { key: o.key, rects: [CONTACT_WALL], margin: BOARD_NEAR_MARGIN };
  }
});

// World units per second.
export const WALK_SPEED = 2.6;

// How long Chen must stand still next to an object before its popup opens.
export const AUTO_OPEN_DWELL_SECONDS = 0.2;

export const OFF_DUTY_TEXT = "Off the clock: TV, PS5, tech and pets.";
export const BUCKY_TEXT = "Waiting for a snack.";
