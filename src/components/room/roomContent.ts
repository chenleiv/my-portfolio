// Room configuration: objects, where Chen stands for each, labels, collision
// and timing. Keep this file free of runtime imports so the Node test runner
// can load it directly. Links and project data live in popupContent.ts.

export type ObjectKey = "desk" | "cv" | "shelf" | "tv" | "bucky" | "win";

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
  { key: "desk", name: "Projects", title: "Projects", spot: [6.2, 2.7], label: { x: 7.3, y: 1.0, z: 3.0 } },
  { key: "cv", name: "CV", title: "Resume", spot: [1.9, 8.0], label: { x: 3.3, y: 8.0, z: 1.25 } },
  { key: "shelf", name: "Skills", title: "Skills", spot: [1.9, 3.8], label: { x: 0.45, y: 3.7, z: 4.1 } },
  { key: "tv", name: "Off duty", title: "Off duty", spot: [2.1, 5.2], label: { x: 0.6, y: 7.7, z: 2.6 } },
  { key: "bucky", name: "Bucky", title: "Bucky", spot: [5.7, 7.6], label: { x: 4.4, y: 7.4, z: 1.5 } },
  { key: "win", name: "Contact", title: "Get in touch", spot: [2.8, 1.5], label: { x: 2.8, y: 0.0, z: 4.5 } },
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

// Furniture footprints Chen cannot walk into.
export const BLOCKS: readonly Rect[] = [
  { x0: 0, y0: 2.2, x1: 0.9, y1: 5.2 }, // bookshelf
  { x0: 0, y0: 6.2, x1: 1.2, y1: 9.2 }, // TV cabinet
  { x0: 5.6, y0: 0.3, x1: 9.0, y1: 1.8 }, // desk
  { x0: 6.9, y0: 2.15, x1: 7.9, y1: 3.3 }, // desk chair
  { x0: 2.6, y0: 7.2, x1: 4.0, y1: 8.8 }, // coffee table
  { x0: 6.4, y0: 6.4, x1: 7.9, y1: 9.4 }, // sofa
  { x0: 4.3, y0: 6.5, x1: 5.1, y1: 8.7 }, // Bucky
  { x0: 9.0, y0: 8.9, x1: 9.45, y1: 9.35 }, // plant
  { x0: 0.2, y0: 5.35, x1: 0.6, y1: 5.75 }, // lamp
];

export const BOUNDS: Rect = { x0: 0.45, y0: 0.5, x1: 9.7, y1: 9.7 };

// Half the width of Chen's footprint, used to pad every block.
export const BODY_RADIUS = 0.28;

// Chen counts as "next to" an object within this distance of its spot.
export const NEAR_RADIUS = 1.5;

// World units per second.
export const WALK_SPEED = 2.6;

// How long Chen must stand still next to an object before its popup opens.
export const AUTO_OPEN_DWELL_SECONDS = 0.2;

export const OFF_DUTY_TEXT = "PS5 and TV series. I also write, and one day a series of my own.";
export const BUCKY_TEXT = "Bucky supervises my code reviews from the floor.";
