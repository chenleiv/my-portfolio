import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AUTO_OPEN_DWELL_SECONDS,
  BLOCKS,
  BODY_RADIUS,
  BOUNDS,
  FOOTPRINT_BY_ID,
  HUB,
  NEAR_RADIUS,
  SPOTS,
  WALK_SPEED,
  type ObjectKey,
} from "./roomContent.ts";
import {
  createWalkerState,
  isBlocked,
  keysToWorld,
  nearestSpot,
  noKeys,
  onDialogClosed,
  planWalk,
  tick,
  type HeldKeys,
  type WalkerConfig,
  type WalkerState,
} from "./walker.ts";

const cfg: WalkerConfig<ObjectKey> = {
  spots: SPOTS,
  hub: HUB,
  blocks: BLOCKS,
  bounds: BOUNDS,
  bodyRadius: BODY_RADIUS,
  nearRadius: NEAR_RADIUS,
  speed: WALK_SPEED,
  dwellSeconds: AUTO_OPEN_DWELL_SECONDS,
};

const DT = 0.01;

function run(state: WalkerState<ObjectKey>, keys: HeldKeys, seconds: number, dialogOpen = false) {
  const opened: ObjectKey[] = [];
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps; i++) {
    const r = tick(state, keys, DT, dialogOpen, cfg);
    if (r.open) opened.push(r.open);
  }
  return opened;
}

const hold = (k: Partial<HeldKeys>): HeldKeys => ({ ...noKeys(), ...k });

// Walks the user to the desk spot with the keys, so userMoved is set as in real use.
function arriveAtDeskByKeys(): WalkerState<ObjectKey> {
  const state = createWalkerState<ObjectKey>(SPOTS.desk);
  run(state, hold({ left: true }), 1);
  run(state, hold({ right: true }), 1);
  return state;
}

describe("collision", () => {
  it("keeps every spot, the hub and the start point walkable", () => {
    for (const [key, [x, y]] of Object.entries(SPOTS)) {
      assert.equal(isBlocked(x, y, cfg), false, `spot ${key} is blocked`);
    }
    assert.equal(isBlocked(HUB[0], HUB[1], cfg), false);
  });

  it("blocks points outside the room and inside padded furniture", () => {
    assert.equal(isBlocked(0.2, 5, cfg), true);
    assert.equal(isBlocked(5, 9.9, cfg), true);
    assert.equal(isBlocked(3.3, 8.0, cfg), true); // coffee table
    const table = FOOTPRINT_BY_ID["coffee-table"];
    assert.equal(isBlocked(table.x0 - BODY_RADIUS + 0.01, (table.y0 + table.y1) / 2, cfg), true); // padded edge
  });

  it("never lets held keys push Chen into furniture", () => {
    const state = createWalkerState<ObjectKey>(SPOTS.cv);
    run(state, hold({ right: true }), 3);
    assert.equal(isBlocked(state.x, state.y, cfg), false);
  });
});

describe("keys and nearest spot", () => {
  it("maps screen directions to world directions", () => {
    const close = (actual: readonly number[] | null, expected: number[]) => {
      assert.ok(actual);
      actual.forEach((v, i) => assert.ok(Math.abs(v - expected[i]) < 1e-9, `${v} != ${expected[i]}`));
    };
    close(keysToWorld(hold({ up: true })), [-Math.SQRT1_2, -Math.SQRT1_2]);
    close(keysToWorld(hold({ right: true })), [Math.SQRT1_2, -Math.SQRT1_2]);
    assert.equal(keysToWorld(hold({ left: true, right: true })), null);
  });

  it("finds the object within the near radius only", () => {
    assert.equal(nearestSpot(SPOTS.shelf[0], SPOTS.shelf[1], cfg), "shelf");
    assert.equal(nearestSpot(4.5, 4.5, cfg), null);
  });
});

describe("auto-open", () => {
  it("opens after standing still for the dwell time, not before", () => {
    const state = arriveAtDeskByKeys();
    assert.equal(state.near, "desk");
    assert.deepEqual(run(state, noKeys(), AUTO_OPEN_DWELL_SECONDS - 3 * DT), []);
    assert.deepEqual(run(state, noKeys(), 4 * DT), ["desk"]);
  });

  it("does not reopen after close until Chen leaves and comes back", () => {
    const state = arriveAtDeskByKeys();
    assert.deepEqual(run(state, noKeys(), 1), ["desk"]);
    onDialogClosed(state);
    assert.deepEqual(run(state, noKeys(), 2), []);

    // A small step that stays next to the desk does not clear the suppression.
    run(state, hold({ left: true }), 0.1);
    assert.equal(state.near, "desk");
    assert.deepEqual(run(state, noKeys(), 1), []);

    // Walk away, then back.
    run(state, hold({ left: true }), 1);
    assert.equal(state.near, null);
    run(state, hold({ right: true }), 1.1);
    assert.equal(state.near, "desk");
    assert.deepEqual(run(state, noKeys(), 1), ["desk"]);
  });

  it("does not open while a dialog is open", () => {
    const state = arriveAtDeskByKeys();
    assert.deepEqual(run(state, noKeys(), 1, true), []);
  });

  it("ignores held keys while a dialog is open", () => {
    const state = createWalkerState<ObjectKey>(SPOTS.desk);
    run(state, hold({ left: true }), 1, true);
    assert.deepEqual([state.x, state.y], [...SPOTS.desk]);
  });
});

describe("scripted walks", () => {
  it("walks through the hub to the target and never auto-opens on arrival", () => {
    const state = createWalkerState<ObjectKey>(SPOTS.desk);
    assert.equal(planWalk(state, "cv", cfg, false), false);
    assert.deepEqual(state.path, [HUB, SPOTS.cv]);
    const opened = run(state, noKeys(), 10);
    assert.deepEqual([state.x, state.y], [...SPOTS.cv]);
    assert.equal(state.near, "cv");
    assert.equal(state.moving, false);
    assert.deepEqual(opened, []);
  });

  it("teleports with reduced motion", () => {
    const state = createWalkerState<ObjectKey>(SPOTS.desk);
    assert.equal(planWalk(state, "bucky", cfg, true), true);
    assert.deepEqual([state.x, state.y], [...SPOTS.bucky]);
    assert.equal(state.path.length, 0);
    assert.equal(state.near, "bucky");
  });
});
