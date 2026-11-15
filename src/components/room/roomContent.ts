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
  // World point where Chen stands to use the object.
  readonly spot: Vec2;
  // World anchor of the label in the scene.
  readonly label: { readonly x: number; readonly y: number; readonly z: number };
}

// Order matches the quick buttons under the scene.
export const ROOM_OBJECTS: readonly RoomObject[] = [
  { key: "desk", name: "Projects", title: "Projects", spot: [6.3, 3.75], label: { x: 7.3, y: 1.0, z: 3.0 } },
  { key: "shelf", name: "Skills", title: "Skills", spot: [1.9, 3.8], label: { x: 0.45, y: 3.7, z: 4.1 } },
  { key: "tv", name: "Off duty", title: "Off duty", spot: [2.1, 5.2], label: { x: 0.6, y: 7.7, z: 2.6 } },
  { key: "bucky", name: "Bucky", title: "Bucky", spot: [4.4, 9.3], label: { x: 5.1, y: 7.8, z: 1.6 } },
  { key: "contact", name: "Contact & CV", title: "Get in touch", spot: [2.75, 1.5], label: { x: 2.75, y: 0.0, z: 4.9 } },
];

export const OBJECT_BY_KEY: Readonly<Record<ObjectKey, RoomObject>> = Object.fromEntries(
  ROOM_OBJECTS.map((o) => [o.key, o]),
) as Record<ObjectKey, RoomObject>;

export const SPOTS: Readonly<Record<ObjectKey, Vec2>> = Object.fromEntries(
  ROOM_OBJECTS.map((o) => [o.key, o.spot]),
) as Record<ObjectKey, Vec2>;

// Clicked walks go through this open floor point so they never cut through furniture.
export const HUB: Vec2 = [3.6, 4.2];

export const START: Vec2 = SPOTS.desk;

// Bucky lies along world y on the middle of the rug. RAW is the box his
// drawing spans at scale 1; Bucky.tsx scales it about its center and moves
// that center to CENTER.
export const BUCKY_LAYOUT = {
  raw: { x0: 4.05, y0: 4.9, x1: 4.85, y1: 7.5 },
  scale: 1.1,
  center: [5.1, 7.4],
} as const;

function scaledFootprint({ raw, scale, center }: typeof BUCKY_LAYOUT): Rect {
  const hw = ((raw.x1 - raw.x0) * scale) / 2;
  const hd = ((raw.y1 - raw.y0) * scale) / 2;
  return { x0: center[0] - hw, y0: center[1] - hd, x1: center[0] + hw, y1: center[1] + hd };
}

// The living-room rug, long side along world x. Floor decoration, not a block.
export const RUG: Rect = { x0: 2.0, y0: 5.3, x1: 9.4, y1: 9.9 };

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
  | "bucky-bowl"
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
  { id: "desk", rect: { x0: 5.6, y0: 0.3, x1: 9.0, y1: 1.8 } },
  { id: "chair", rect: { x0: 6.9, y0: 2.35, x1: 7.9, y1: 3.37 } },
  { id: "coffee-table", rect: { x0: 2.3, y0: 7.2, x1: 3.7, y1: 8.8 } },
  { id: "bucky", rect: scaledFootprint(BUCKY_LAYOUT) },
  // Food bowl and bone on the rug beside Bucky.
  { id: "bucky-bowl", rect: { x0: 5.7, y0: 8.4, x1: 6.1, y1: 9.05 } },
  { id: "sofa", rect: { x0: 7.0, y0: 6.0, x1: 8.5, y1: 9.0 } },
  { id: "plant", rect: { x0: 9.2, y0: 4.8, x1: 9.65, y1: 5.25 } },
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

// Chen counts as "next to" an object within this distance of its spot.
export const NEAR_RADIUS = 1.5;

// World units per second.
export const WALK_SPEED = 2.6;

// How long Chen must stand still next to an object before its popup opens.
export const AUTO_OPEN_DWELL_SECONDS = 0.2;

export const OFF_DUTY_TEXT = "Off the clock: TV, PS5, tech and pets.";
export const BUCKY_TEXT = "Waiting for a snack.";
