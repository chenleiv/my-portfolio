// Where Chen is drawn among the scene items. Pure world-space logic with only
// type imports, so the Node test runner can load it directly.
import type { Rect } from "./roomContent";

// Chen stands in front of an item when she is past its far x edge or its far
// y edge: those are the item's visible sides. Collision keeps her outside
// every footprint, so otherwise she is behind it.
export function isInFront(x: number, y: number, rect: Rect): boolean {
  return x >= rect.x1 || y >= rect.y1;
}

// Index in the back-to-front item list where Chen is inserted: just before
// the first item she stands behind. Items with no footprint (on the wall)
// are always behind her.
export function drawSlot(x: number, y: number, footprints: readonly (Rect | null)[]): number {
  const i = footprints.findIndex((rect) => rect !== null && !isInFront(x, y, rect));
  return i === -1 ? footprints.length : i;
}
