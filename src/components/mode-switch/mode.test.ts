import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MODE_PATH, modeFromPath } from "./mode.ts";

describe("modeFromPath", () => {
  it("is Play on the home page", () => {
    assert.equal(modeFromPath("/"), "play");
  });

  it("is Terminal on /console, with or without a trailing slash", () => {
    assert.equal(modeFromPath("/console"), "terminal");
    assert.equal(modeFromPath("/console/"), "terminal");
  });

  it("is Play for other or missing paths", () => {
    assert.equal(modeFromPath("/consoles"), "play");
    assert.equal(modeFromPath("/console/x"), "play");
    assert.equal(modeFromPath(null), "play");
    assert.equal(modeFromPath(undefined), "play");
  });

  it("maps each mode to a path that maps back to it", () => {
    for (const mode of ["play", "terminal"] as const) {
      assert.equal(modeFromPath(MODE_PATH[mode]), mode);
    }
  });
});
