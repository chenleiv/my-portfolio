import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AUTO_OPEN_DWELL_SECONDS,
  BLOCKS,
  BODY_RADIUS,
  BOUNDS,
  FOOTPRINT_BY_ID,
  HUB,
  OBJECT_AREAS,
  SPOTS,
  SWITCH_MARGIN,
  WALK_SPEED,
  type ObjectKey,
} from "./roomContent.ts";
import {
  createWalkerState,
  isBlocked,
  keysToWorld,
  nearestObject,
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
  areas: OBJECT_AREAS,
  switchMargin: SWITCH_MARGIN,
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

// Walks the user away from the desk spot and back with the keys, so userMoved is set as in real use.
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
    assert.equal(isBlocked(4.8, 6.5, cfg), true); // coffee table
    const table = FOOTPRINT_BY_ID["coffee-table"];
    assert.equal(isBlocked(table.x0 - BODY_RADIUS + 0.01, (table.y0 + table.y1) / 2, cfg), true); // padded edge
  });

  it("never lets held keys push Chen into furniture", () => {
    // Start just left of the coffee table, then hold "right" into it.
    const table = FOOTPRINT_BY_ID["coffee-table"];
    const state = createWalkerState<ObjectKey>([table.x0 - BODY_RADIUS - 0.1, (table.y0 + table.y1) / 2]);
    run(state, hold({ right: true }), 3);
    assert.equal(isBlocked(state.x, state.y, cfg), false);
  });
});

describe("keys and proximity", () => {
  it("maps screen directions to world directions", () => {
    const close = (actual: readonly number[] | null, expected: number[]) => {
      assert.ok(actual);
      actual.forEach((v, i) => assert.ok(Math.abs(v - expected[i]) < 1e-9, `${v} != ${expected[i]}`));
    };
    close(keysToWorld(hold({ up: true })), [-Math.SQRT1_2, -Math.SQRT1_2]);
    close(keysToWorld(hold({ right: true })), [Math.SQRT1_2, -Math.SQRT1_2]);
    assert.equal(keysToWorld(hold({ left: true, right: true })), null);
  });

  it("counts each spot as next to its own object", () => {
    for (const [key, [x, y]] of Object.entries(SPOTS)) {
      assert.equal(nearestObject(x, y, null, cfg), key, `spot ${key}`);
    }
  });

  it("is next to nothing on open floor", () => {
    assert.equal(nearestObject(HUB[0], HUB[1], null, cfg), null);
  });

  it("is next to an object from every side Chen can stand on", () => {
    const f = FOOTPRINT_BY_ID;
    const cases: [ObjectKey, (typeof f)[keyof typeof f]][] = [
      ["tv", f.tv],
      ["shelf", f.shelf],
      ["desk", f.chair],
    ];
    const off = BODY_RADIUS + 0.1;
    for (const [key, r] of cases) {
      const cx = (r.x0 + r.x1) / 2;
      const cy = (r.y0 + r.y1) / 2;
      const sides = [[r.x0 - off, cy], [r.x1 + off, cy], [cx, r.y0 - off], [cx, r.y1 + off]];
      const free = sides.filter(([x, y]) => !isBlocked(x, y, cfg));
      assert.ok(free.length >= 2, `${key}: fewer than two free sides`);
      for (const [x, y] of free) {
        assert.equal(nearestObject(x, y, null, cfg), key, `${key} at ${x.toFixed(2)}, ${y.toFixed(2)}`);
      }
    }
  });

  it("breaks exact ties by area order", () => {
    const tie: WalkerConfig<"a" | "b"> = {
      ...cfg,
      spots: { a: [0, 0], b: [0, 0] },
      areas: [
        { key: "a", rects: [{ x0: 0, y0: 0, x1: 1, y1: 1 }], margin: 1 },
        { key: "b", rects: [{ x0: 2, y0: 0, x1: 3, y1: 1 }], margin: 1 },
      ],
    };
    assert.equal(nearestObject(1.5, 0.5, null, tie), "a");
  });

  it("keeps the current object until another is clearly closer", () => {
    // In the passage between the Skills shelf and the TV cabinet.
    const x = 1.3;
    const y = 5.7; // TV slightly closer (0.51 vs 0.64), by less than the switch margin
    assert.equal(nearestObject(x, y, null, cfg), "tv");
    assert.equal(nearestObject(x, y, "shelf", cfg), "shelf");
    assert.equal(nearestObject(x, 5.76, "shelf", cfg), "tv"); // TV clearly closer (0.45 vs 0.69)
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
    run(state, hold({ down: true }), 0.1);
    assert.equal(state.near, "desk");
    assert.deepEqual(run(state, noKeys(), 1), []);

    // Walk away, then back.
    run(state, hold({ left: true }), 1.2);
    assert.equal(state.near, null);
    run(state, hold({ right: true }), 1.2);
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
    assert.equal(planWalk(state, "bucky", cfg, false), false);
    assert.deepEqual(state.path, [HUB, SPOTS.bucky]);
    const opened = run(state, noKeys(), 10);
    assert.deepEqual([state.x, state.y], [...SPOTS.bucky]);
    assert.equal(state.near, "bucky");
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

describe("facing", () => {
  it("faces the direction of the last move and keeps it when stopping", () => {
    // Start on open floor at the hub, facing front-left.
    const state = createWalkerState<ObjectKey>(HUB);
    assert.deepEqual(state.facing, { front: true, right: false });

    run(state, hold({ right: true }), 0.1);
    assert.deepEqual(state.facing, { front: true, right: true }); // across: keeps front

    run(state, hold({ up: true }), 0.1);
    assert.deepEqual(state.facing, { front: false, right: true }); // up: back, keeps right

    run(state, hold({ left: true }), 0.1);
    assert.deepEqual(state.facing, { front: false, right: false });

    run(state, noKeys(), 0.5);
    assert.deepEqual(state.facing, { front: false, right: false }); // standing still keeps it
  });

  it("faces the way a clicked walk goes", () => {
    const state = createWalkerState<ObjectKey>(HUB);
    state.path = [[HUB[0] + 1, HUB[1] - 2]]; // up the screen and to the right
    run(state, noKeys(), 0.1);
    assert.deepEqual(state.facing, { front: false, right: true });
  });
});
