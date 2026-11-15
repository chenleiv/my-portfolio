"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { worldOffset } from "./iso";
import {
  AUTO_OPEN_DWELL_SECONDS,
  BLOCKS,
  BODY_RADIUS,
  BOUNDS,
  HUB,
  IDLE_BEFORE_WANDER_MS,
  NEAR_RADIUS,
  ROOM_OBJECTS,
  SPOTS,
  START,
  WALK_SPEED,
  WANDER_CHECK_MS,
  type ObjectKey,
} from "./roomContent";
import { CHEN_PARTS, SWING, type ChenPart } from "./scene/Chen";
import {
  createWalkerState,
  noKeys,
  onDialogClosed,
  planWalk,
  tick,
  type HeldKeys,
  type WalkerConfig,
} from "./walker";

const CONFIG: WalkerConfig<ObjectKey> = {
  spots: SPOTS,
  hub: HUB,
  blocks: BLOCKS,
  bounds: BOUNDS,
  bodyRadius: BODY_RADIUS,
  nearRadius: NEAR_RADIUS,
  speed: WALK_SPEED,
  dwellSeconds: AUTO_OPEN_DWELL_SECONDS,
};

const KEYMAP: Readonly<Record<string, keyof HeldKeys>> = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
};

const STRIDE = 0.14;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

// Index among the depth-sorted scene items where Chen is drawn.
function slotFor(depth: number, depths: readonly number[]): number {
  return depths.filter((d) => d <= depth).length;
}

interface UseWalkerOptions {
  // Depths of the scene items, sorted ascending. Must be a stable reference.
  depths: readonly number[];
  onAutoOpen: (key: ObjectKey) => void;
  onNearChange: (key: ObjectKey | null) => void;
}

export function useWalker({ depths, onAutoOpen, onNearChange }: UseWalkerOptions) {
  const reducedMotion = usePrefersReducedMotion();

  const stateRef = useRef(createWalkerState<ObjectKey>(START));
  const keysRef = useRef<HeldKeys>(noKeys());
  const dialogOpenRef = useRef(false);
  const reducedRef = useRef(reducedMotion);
  const lastActivityRef = useRef(0);
  // Last place Chen was sent, so wandering picks somewhere else.
  const whereRef = useRef<ObjectKey>("desk");
  const callbacksRef = useRef({ onAutoOpen, onNearChange });

  const sceneRef = useRef<HTMLDivElement>(null);
  const chenElRef = useRef<SVGGElement | null>(null);
  const limbsRef = useRef<Partial<Record<ChenPart, SVGGElement>>>({});

  const [slot, setSlot] = useState(() => slotFor(START[0] + START[1], depths));
  const slotRef = useRef(slot);

  useEffect(() => {
    callbacksRef.current = { onAutoOpen, onNearChange };
    reducedRef.current = reducedMotion;
  });

  const applyPose = useCallback(() => {
    const el = chenElRef.current;
    if (!el) return;
    const s = stateRef.current;
    const [tx, ty] = worldOffset(s.x, s.y);
    el.setAttribute("transform", `translate(${tx.toFixed(1)},${ty.toFixed(1)})`);
    const stride = s.moving && !reducedRef.current ? Math.sin(s.phase) * STRIDE : 0;
    for (const part of CHEN_PARTS) {
      const g = limbsRef.current[part];
      if (!g) continue;
      const [lx, ly] = worldOffset(0, stride * SWING[part]);
      g.setAttribute("transform", `translate(${lx.toFixed(2)},${ly.toFixed(2)})`);
    }
    const next = slotFor(s.x + s.y, depths);
    if (next !== slotRef.current) {
      slotRef.current = next;
      setSlot(next);
    }
  }, [depths]);

  const chenRef = useCallback(
    (el: SVGGElement | null) => {
      chenElRef.current = el;
      limbsRef.current = {};
      if (!el) return;
      for (const part of CHEN_PARTS) {
        const g = el.querySelector<SVGGElement>(`[data-part="${part}"]`);
        if (g) limbsRef.current[part] = g;
      }
      applyPose();
    },
    [applyPose],
  );

  // Frame loop, running only while the scene is on screen.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    lastActivityRef.current = performance.now();
    let raf = 0;
    let last = 0;
    let wanderClock = 0;
    let running = false;

    const maybeWander = () => {
      const s = stateRef.current;
      if (reducedRef.current || document.hidden || dialogOpenRef.current) return;
      if (s.path.length > 0 || s.moving) return;
      if (performance.now() - lastActivityRef.current < IDLE_BEFORE_WANDER_MS) return;
      const others = ROOM_OBJECTS.map((o) => o.key).filter((k) => k !== whereRef.current);
      const key = others[Math.floor(Math.random() * others.length)];
      whereRef.current = key;
      planWalk(stateRef.current, key, CONFIG, false);
    };

    const frame = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      const s = stateRef.current;
      const r = tick(s, keysRef.current, dt, dialogOpenRef.current, CONFIG);
      if (r.changed) applyPose();
      if (r.userActed) lastActivityRef.current = performance.now();
      if (r.nearChanged) callbacksRef.current.onNearChange(s.near);
      if (r.open) {
        dialogOpenRef.current = true;
        keysRef.current = noKeys();
        callbacksRef.current.onAutoOpen(r.open);
      }
      wanderClock += dt;
      if (wanderClock >= WANDER_CHECK_MS / 1000) {
        wanderClock = 0;
        maybeWander();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(scene);
    return () => {
      io.disconnect();
      stop();
    };
  }, [applyPose]);

  // Release held keys when they are let go anywhere, or when the page loses focus.
  useEffect(() => {
    const release = (e: globalThis.KeyboardEvent) => {
      const dir = KEYMAP[e.key];
      if (dir) keysRef.current[dir] = false;
    };
    const releaseAll = () => {
      keysRef.current = noKeys();
    };
    const onVisibility = () => {
      if (document.hidden) releaseAll();
    };
    window.addEventListener("keyup", release);
    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", releaseAll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Sends Chen to an object. With `open`, the popup opens right away and she walks in the background.
  const walkTo = useCallback(
    (key: ObjectKey, open: boolean) => {
      const s = stateRef.current;
      whereRef.current = key;
      lastActivityRef.current = performance.now();
      if (open) {
        dialogOpenRef.current = true;
        keysRef.current = noKeys();
      }
      const jumped = planWalk(s, key, CONFIG, reducedRef.current);
      if (jumped) applyPose();
      if (jumped || open) {
        s.near = key;
        callbacksRef.current.onNearChange(key);
      }
    },
    [applyPose],
  );

  // Returns true when the key was a movement key and has been handled.
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const dir = KEYMAP[e.key];
    if (!dir || e.metaKey || e.ctrlKey || e.altKey || dialogOpenRef.current) return false;
    e.preventDefault();
    keysRef.current[dir] = true;
    stateRef.current.path = [];
    lastActivityRef.current = performance.now();
    return true;
  }, []);

  const markDialogClosed = useCallback(() => {
    dialogOpenRef.current = false;
    onDialogClosed(stateRef.current);
    lastActivityRef.current = performance.now();
  }, []);

  const getNear = useCallback(() => stateRef.current.near, []);

  return { sceneRef, chenRef, slot, walkTo, handleKeyDown, markDialogClosed, getNear, reducedMotion };
}
