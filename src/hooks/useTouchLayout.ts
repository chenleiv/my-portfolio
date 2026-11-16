import { useSyncExternalStore } from "react";

// Same query as the touch-layout mixin in src/styles/_media.scss. Keep both in sync.
export const TOUCH_LAYOUT_QUERY = "(hover: none) and (pointer: coarse), (max-width: 599px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(TOUCH_LAYOUT_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// True on phones and touch devices. The server render assumes desktop.
export function useTouchLayout(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(TOUCH_LAYOUT_QUERY).matches, () => false);
}
