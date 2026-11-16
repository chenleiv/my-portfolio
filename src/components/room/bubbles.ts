// When a label bubble on the scene is shown. Pure, with only type imports, so
// the Node test runner can load it directly.
//
// Bubbles are a mouse and touch affordance only. The Places list in the How to
// play panel is the way in for keyboard and screen reader users, so a bubble is
// never in the tab order or the accessibility tree, shown or not.
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
}

export interface BubbleState {
  readonly shown: boolean;
  readonly tabIndex: -1;
  readonly ariaHidden: true;
}

export function bubbleState({ key, nearKey, hoverKey, revealing, touch }: BubbleInput): BubbleState {
  const shown = touch || revealing || key === nearKey || key === hoverKey;
  return { shown, tabIndex: -1, ariaHidden: true };
}
