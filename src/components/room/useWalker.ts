"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { project, worldOffset } from "./iso";
import {
  AUTO_OPEN_DWELL_SECONDS,
  BLOCKS,
  BODY_RADIUS,
  BOUNDS,
  HUB,
  OBJECT_AREAS,
  SPOTS,
  START,
  SWITCH_MARGIN,
  WALK_SPEED,
  type ObjectKey,
  type Rect,
} from "./roomContent";
import { drawSlot } from "./depth";
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
  areas: OBJECT_AREAS,
  switchMargin: SWITCH_MARGIN,
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

export interface ScreenBox {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

// Box around Chen's figure on screen: arms reach 0.4 to each side, she is about 2 tall.
function chenScreenBox(x: number, y: number): ScreenBox {
  const pts = [];
  for (const dx of [-0.4, 0.4]) for (const dy of [-0.3, 0.3]) for (const z of [0, 2]) pts.push(project(x + dx, y + dy, z));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

interface UseWalkerOptions {
  // Floor footprints of the scene items, back to front. Must be a stable reference.
  footprints: readonly (Rect | null)[];
  onAutoOpen: (key: ObjectKey) => void;
  onNearChange: (key: ObjectKey | null) => void;
  // Chen's screen box in viewBox units, after every pose change.
  onPose?: (box: ScreenBox) => void;
}

// Chen moves only while a movement key is held, or along a walk started by a
// click on an object, a label or a Places button. Nothing else moves her.
export function useWalker({ footprints, onAutoOpen, onNearChange, onPose }: UseWalkerOptions) {
  const reducedMotion = usePrefersReducedMotion();

  const stateRef = useRef(createWalkerState<ObjectKey>(START));
  const keysRef = useRef<HeldKeys>(noKeys());
  const dialogOpenRef = useRef(false);
  const reducedRef = useRef(reducedMotion);
  const callbacksRef = useRef({ onAutoOpen, onNearChange, onPose });

  const sceneRef = useRef<HTMLDivElement>(null);
  const chenElRef = useRef<SVGGElement | null>(null);
  const limbsRef = useRef<Partial<Record<ChenPart, SVGGElement>>>({});
  // The groups that turn Chen, and the facing last applied to them.
  const viewRef = useRef<{ applied: string; flip?: SVGGElement; front?: SVGGElement; back?: SVGGElement }>({ applied: "" });

  const [slot, setSlot] = useState(() => drawSlot(START[0], START[1], footprints));
  const slotRef = useRef(slot);

  useEffect(() => {
    callbacksRef.current = { onAutoOpen, onNearChange, onPose };
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
    // Facing: the drawing faces front-left. Mirroring turns front-left into
    // front-right and the back view (facing back-right) into back-left.
    const { front, right } = s.facing;
    const key = `${front ? "f" : "b"}${right ? "r" : "l"}`;
    const view = viewRef.current;
    if (view.flip && key !== view.applied) {
      view.applied = key;
      const flip = front ? right : !right;
      if (flip) view.flip.setAttribute("transform", "scale(-1,1)");
      else view.flip.removeAttribute("transform");
      view.front?.setAttribute("display", front ? "inline" : "none");
      view.back?.setAttribute("display", front ? "none" : "inline");
    }
    callbacksRef.current.onPose?.(chenScreenBox(s.x, s.y));
    const next = drawSlot(s.x, s.y, footprints);
    if (next !== slotRef.current) {
      slotRef.current = next;
      setSlot(next);
    }
  }, [footprints]);

  const chenRef = useCallback(
    (el: SVGGElement | null) => {
      chenElRef.current = el;
      limbsRef.current = {};
      viewRef.current = { applied: "" };
      if (!el) return;
      for (const part of CHEN_PARTS) {
        const g = el.querySelector<SVGGElement>(`[data-part="${part}"]`);
        if (g) limbsRef.current[part] = g;
      }
      viewRef.current = {
        applied: "",
        flip: el.querySelector<SVGGElement>("[data-flip]") ?? undefined,
        front: el.querySelector<SVGGElement>('[data-view="front"]') ?? undefined,
        back: el.querySelector<SVGGElement>('[data-view="back"]') ?? undefined,
      };
      applyPose();
    },
    [applyPose],
  );

  // Frame loop, running only while the scene is on screen.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let raf = 0;
    let last = 0;
    let running = false;

    const frame = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      const s = stateRef.current;
      const r = tick(s, keysRef.current, dt, dialogOpenRef.current, CONFIG);
      if (r.changed) applyPose();
      if (r.nearChanged) callbacksRef.current.onNearChange(s.near);
      if (r.open) {
        dialogOpenRef.current = true;
        keysRef.current = noKeys();
        callbacksRef.current.onAutoOpen(r.open);
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

  // Marks a popup as open so held keys stop and auto-open waits until it closes.
  const markDialogOpen = useCallback(() => {
    dialogOpenRef.current = true;
    keysRef.current = noKeys();
  }, []);

  // Sends Chen to an object after a click. The popup opens right away and she walks in the background.
  const walkToAndOpen = useCallback(
    (key: ObjectKey) => {
      const s = stateRef.current;
      markDialogOpen();
      if (planWalk(s, key, CONFIG, reducedRef.current)) applyPose();
      s.near = key;
      callbacksRef.current.onNearChange(key);
    },
    [applyPose, markDialogOpen],
  );

  // Returns true when the key was a movement key and has been handled.
  const handleKeyDown = useCallback((e: KeyboardEvent | globalThis.KeyboardEvent) => {
    const dir = KEYMAP[e.key];
    if (!dir || e.metaKey || e.ctrlKey || e.altKey || dialogOpenRef.current) return false;
    e.preventDefault();
    keysRef.current[dir] = true;
    stateRef.current.path = [];
    return true;
  }, []);

  // No click needed to start: a movement key pressed while nothing on the page
  // has focus and the room is at least half on screen moves focus to the room
  // (without scrolling) and walks on that same press. Otherwise the keys keep
  // their normal job, such as scrolling the page. Not on touch screens.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.5;
    }, { threshold: [0, 0.5, 1] });
    io.observe(scene);

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (!visible || e.defaultPrevented || !KEYMAP[e.key]) return;
      const active = document.activeElement;
      if (active && active !== document.body && active !== document.documentElement) return;
      if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
      if (!handleKeyDown(e)) return;
      scene.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      io.disconnect();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [handleKeyDown]);

  const markDialogClosed = useCallback(() => {
    dialogOpenRef.current = false;
    onDialogClosed(stateRef.current);
  }, []);

  const getNear = useCallback(() => stateRef.current.near, []);

  return { sceneRef, chenRef, slot, walkToAndOpen, markDialogOpen, handleKeyDown, markDialogClosed, getNear, reducedMotion };
}
