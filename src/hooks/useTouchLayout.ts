import { useSyncExternalStore } from "react";

// Same query as the touch-layout mixin in src/styles/_media.scss. Keep both in sync.
const TOUCH_LAYOUT_QUERY = "(hover: none) and (pointer: coarse), (max-width: 599px)";

// Room and panel side by side: wide and not touch (see .room__layout in _room.scss).
const SIDE_BY_SIDE_QUERY = "(min-width: 1100px) and (not ((hover: none) and (pointer: coarse)))";

// True while the media query matches. The server render assumes false.
function useMatchMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// True on phones and touch devices.
export function useTouchLayout(): boolean {
  return useMatchMedia(TOUCH_LAYOUT_QUERY);
}

// True when the room sits beside the How to play panel.
export function useSideBySide(): boolean {
  return useMatchMedia(SIDE_BY_SIDE_QUERY);
}
