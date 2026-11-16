// When a label bubble on the scene is shown, and whether it is a real button.
// Pure, with only type imports, so the Node test runner can load it directly.
//
// Bubbles are a mouse and touch affordance. The Places list is the way in for
// keyboard and screen reader users to the objects it lists. Objects that are
// not in the list (For fun and Bucky) have no other way in on touch screens,
// where nobody walks with keys, so there their always-visible bubbles are real
// buttons: focusable and announced. Every other bubble stays out of the tab
// order and the accessibility tree.
import type { ObjectKey } from "./roomContent";

export interface BubbleInput {
  readonly key: ObjectKey;
  // Object Chen is next to.
  readonly nearKey: ObjectKey | null;
  // Object under the mouse (the object itself or its bubble).
  readonly hoverKey: ObjectKey | null;
  // The short reveal when the room first comes into view.
  readonly revealing: boolean;
  // Device without hover (touch): bubbles stay visible so they can be tapped.
  readonly touch: boolean;
  // The object has a button in the Places list.
  readonly listed: boolean;
}

export interface BubbleState {
  readonly shown: boolean;
  readonly tabIndex: 0 | -1;
  readonly ariaHidden: boolean;
}

export function bubbleState({ key, nearKey, hoverKey, revealing, touch, listed }: BubbleInput): BubbleState {
  const shown = touch || revealing || key === nearKey || key === hoverKey;
  const button = touch && !listed;
  return { shown, tabIndex: button ? 0 : -1, ariaHidden: !button };
}
