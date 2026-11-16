import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { bubbleState, type BubbleInput } from "./bubbles.ts";

const base: BubbleInput = { key: "bucky", nearKey: null, hoverKey: null, revealing: false, touch: false, listed: false };
const shown = (over: Partial<BubbleInput>) => bubbleState({ ...base, ...over }).shown;

describe("bubble visibility", () => {
  it("is hidden when nothing points at the object", () => {
    assert.equal(shown({}), false);
  });

  it("shows when Chen is next to the object, and only that object", () => {
    assert.equal(shown({ nearKey: "bucky" }), true);
    assert.equal(shown({ nearKey: "desk" }), false);
  });

  it("shows when the mouse is over the object or its bubble", () => {
    assert.equal(shown({ hoverKey: "bucky" }), true);
    assert.equal(shown({ hoverKey: "shelf" }), false);
  });

  it("shows every bubble during the first reveal", () => {
    assert.equal(shown({ revealing: true }), true);
    assert.equal(shown({ key: "contact", revealing: true }), true);
  });

  it("always shows on touch screens", () => {
    assert.equal(shown({ touch: true }), true);
    assert.equal(shown({ key: "desk", touch: true, nearKey: "bucky" }), true);
  });

  it("is not focusable or announced, except unlisted objects on touch", () => {
    for (const over of [{}, { nearKey: "bucky" as const }, { hoverKey: "bucky" as const }, { revealing: true }, { touch: true, listed: true }]) {
      const s = bubbleState({ ...base, ...over });
      assert.equal(s.tabIndex, -1);
      assert.equal(s.ariaHidden, true);
    }
  });

  it("is a real button on touch for objects missing from the Places list", () => {
    const s = bubbleState({ ...base, touch: true, listed: false });
    assert.equal(s.tabIndex, 0);
    assert.equal(s.ariaHidden, false);
  });
});
