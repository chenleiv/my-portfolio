"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import { toViewPercent, VIEW_BOX } from "./iso";
import { PALETTES, type ScenePalette } from "./palettes";
import { FOOTPRINT_RECTS, OBJECT_BY_KEY, ROOM_OBJECTS, SCENE_FOOTPRINTS, type ObjectKey, type SceneItemId } from "./roomContent";
import { RoomDialog } from "./RoomDialog";
import { Background } from "./scene/Background";
import { Chen } from "./scene/Chen";
import { Chair, CoffeeTable, Desk, Guitar, Lamp, Plant, Sofa, SofaFront, Tv } from "./scene/Furniture";
import { Shelf } from "./scene/Shelf";
import { WallPictures } from "./scene/WallPictures";
import { Window } from "./scene/Window";
import { ContactBoard } from "./scene/ContactBoard";
import { bubbleState } from "./bubbles";
import { HowToPlay } from "./HowToPlay";
import { RoomPlaces } from "./RoomPlaces";
import { useTouchLayout } from "../../hooks/useTouchLayout";
import { useWalker, type ScreenBox } from "./useWalker";

const RENDER: Readonly<Record<SceneItemId, (p: ScenePalette) => ReactNode>> = {
  "contact-board": (p) => <ContactBoard p={p} />,
  window: (p) => <Window p={p} />,
  guitar: (p) => <Guitar p={p} />,
  shelf: (p) => <Shelf p={p} />,
  lamp: (p) => <Lamp p={p} />,
  tv: (p) => <Tv p={p} />,
  desk: (p) => <Desk p={p} />,
  chair: (p) => <Chair p={p} />,
  "coffee-table": (p) => <CoffeeTable p={p} />,
  "sofa-front": (p) => <SofaFront p={p} />,
  sofa: (p) => <Sofa p={p} />,
  plant: (p) => <Plant p={p} />,
};

const LABELS = ROOM_OBJECTS.map((o) => {
  const { left, top } = toViewPercent(o.label.x, o.label.y, o.label.z);
  return { key: o.key, name: o.name, left: `${left.toFixed(2)}%`, top: `${top.toFixed(2)}%` };
});

const VIEW_BOX_ATTR = [VIEW_BOX.x, VIEW_BOX.y, VIEW_BOX.w, VIEW_BOX.h].map((n) => n.toFixed(1)).join(" ");

// The stage keeps the viewBox ratio, so labels placed in percent stay on their
// objects. Set on the layout so the Places row can share the room width.
const STAGE_STYLE = { "--room-ratio": (VIEW_BOX.w / VIEW_BOX.h).toFixed(4) } as CSSProperties;

const SCENE_LABEL = "Room. Use the arrow keys or WASD to walk. Stop next to an object to open it.";
const SCENE_LABEL_TOUCH = "Room. Tap an object to open it, or use the Places buttons below the room.";

function keyFromTarget(target: EventTarget | null): { key: ObjectKey; el: Element } | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest("[data-room-key]");
  const key = el?.getAttribute("data-room-key");
  return el && key && Object.hasOwn(OBJECT_BY_KEY, key) ? { key: key as ObjectKey, el } : null;
}

// Touch screens without hover keep every bubble visible so it can be tapped.
const NO_HOVER_QUERY = "(hover: none)";
function subscribeNoHover(onChange: () => void) {
  const mq = window.matchMedia(NO_HOVER_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function useNoHover(): boolean {
  return useSyncExternalStore(subscribeNoHover, () => window.matchMedia(NO_HOVER_QUERY).matches, () => false);
}

// How long every bubble shows the first time the room comes into view.
const REVEAL_MS = 3000;

export default function Room() {
  const { theme, mounted } = useTheme();
  const palette = PALETTES[theme];

  const [openKey, setOpenKey] = useState<ObjectKey | null>(null);
  const [nearKey, setNearKey] = useState<ObjectKey | null>(null);
  const [hoverKey, setHoverKey] = useState<ObjectKey | null>(null);
  const [revealing, setRevealing] = useState(false);
  const touch = useNoHover();
  const touchLayout = useTouchLayout();
  // Control that opened the popup; null means the scene itself.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Label boxes relative to the stage, measured once per stage width.
  const labelBoxesRef = useRef<{ width: number; boxes: { el: HTMLElement; x0: number; y0: number; x1: number; y1: number }[] }>({ width: 0, boxes: [] });

  // Fades a label while Chen stands under it, so no label ever hides her.
  const onPose = useCallback((box: ScreenBox) => {
    const stage = stageRef.current;
    if (!stage) return;
    const s = stage.getBoundingClientRect();
    if (s.width === 0) return;
    const cache = labelBoxesRef.current;
    if (cache.width !== s.width) {
      cache.width = s.width;
      cache.boxes = Array.from(stage.querySelectorAll<HTMLElement>(".room__label")).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x0: r.left - s.left, y0: r.top - s.top, x1: r.right - s.left, y1: r.bottom - s.top };
      });
    }
    const k = s.width / VIEW_BOX.w;
    const cx0 = (box.x0 - VIEW_BOX.x) * k;
    const cx1 = (box.x1 - VIEW_BOX.x) * k;
    const cy0 = (box.y0 - VIEW_BOX.y) * k;
    const cy1 = (box.y1 - VIEW_BOX.y) * k;
    for (const b of cache.boxes) {
      const hit = b.x0 < cx1 && b.x1 > cx0 && b.y0 < cy1 && b.y1 > cy0;
      if (b.el.classList.contains("is-faded") !== hit) b.el.classList.toggle("is-faded", hit);
    }
  }, []);

  const onAutoOpen = useCallback((key: ObjectKey) => {
    returnFocusRef.current = null;
    setOpenKey(key);
  }, []);

  const { sceneRef, chenRef, slot, walkToAndOpen, markDialogOpen, markDialogClosed, handleKeyDown, getNear } = useWalker({
    footprints: FOOTPRINT_RECTS,
    onAutoOpen,
    onNearChange: setNearKey,
    onPose,
  });

  // Click on an object, its bubble or a Places button: open now, Chen walks there in the background.
  const openObject = useCallback(
    (key: ObjectKey, trigger: HTMLElement | null) => {
      returnFocusRef.current = trigger;
      walkToAndOpen(key);
      setOpenKey(key);
    },
    [walkToAndOpen],
  );

  // E or Enter: open the object Chen is next to, without moving her.
  const openNearInPlace = (trigger: HTMLElement | null) => {
    const near = getNear();
    if (!near) return false;
    returnFocusRef.current = trigger;
    markDialogOpen();
    setOpenKey(near);
    return true;
  };

  const closeDialog = useCallback(() => {
    setOpenKey(null);
    markDialogClosed();
  }, [markDialogClosed]);

  const restoreFocus = useCallback(() => {
    const el = returnFocusRef.current;
    if (el && el.isConnected) el.focus();
    else sceneRef.current?.focus();
  }, [sceneRef]);

  const onSceneClick = (e: MouseEvent<HTMLDivElement>) => {
    const hit = keyFromTarget(e.target);
    // Bubbles are not focusable, so focus returns to the scene after a click on the scene.
    if (hit) openObject(hit.key, null);
    else sceneRef.current?.focus();
  };

  const onSceneKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (handleKeyDown(e)) return;
    const onScene = e.target === e.currentTarget;
    if (e.key === "e" || e.key === "E" || (e.key === "Enter" && onScene)) {
      if (openNearInPlace(onScene ? null : (e.target as HTMLElement))) e.preventDefault();
    }
  };

  const onPointerOver = (e: PointerEvent<HTMLDivElement>) => setHoverKey(keyFromTarget(e.target)?.key ?? null);

  // Show every bubble briefly the first time the room scrolls into view.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      setRevealing(true);
      timer = window.setTimeout(() => setRevealing(false), REVEAL_MS);
    });
    io.observe(scene);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [sceneRef]);

  const sceneItems = useMemo(
    // Back to front, in the same order as the footprints the walker uses for Chen's slot.
    () => SCENE_FOOTPRINTS.map(({ id }) => <g key={id}>{RENDER[id](palette)}</g>),
    [palette],
  );
  const background = useMemo(
    () => (
      <g>
        <Background p={palette} />
        <WallPictures p={palette} />
      </g>
    ),
    [palette],
  );

  const chen = <Chen key="chen" ref={chenRef} />;

  const activeKey = hoverKey ?? nearKey;

  return (
    <section className="room" aria-label="Interactive room">
      {/* DOM order: panel, scene, Places. CSS keeps the same visual order at every width. */}
      <div className="room__layout" style={STAGE_STYLE}>
        <HowToPlay nearName={nearKey ? OBJECT_BY_KEY[nearKey].name : null} />
        <div
          ref={sceneRef}
          className="room__scene"
          tabIndex={0}
          role="application"
          aria-label={touchLayout ? SCENE_LABEL_TOUCH : SCENE_LABEL}
          onClick={onSceneClick}
          onKeyDown={onSceneKeyDown}
          onPointerOver={onPointerOver}
          onPointerLeave={() => setHoverKey(null)}
        >
          <div ref={stageRef} className="room__stage" data-active={activeKey ?? undefined}>
            {mounted && (
              <svg className="room__svg" viewBox={VIEW_BOX_ATTR} aria-hidden="true" focusable="false">
                {background}
                {/* One keyed list, so a depth change moves Chen instead of remounting furniture. */}
                <g>{[...sceneItems.slice(0, slot), chen, ...sceneItems.slice(slot)]}</g>
              </svg>
            )}
            {LABELS.map((l) => {
              const bubble = bubbleState({ key: l.key, nearKey, hoverKey, revealing, touch });
              return (
                <button
                  key={l.key}
                  type="button"
                  className="room__label"
                  data-room-key={l.key}
                  data-shown={bubble.shown}
                  data-near={l.key === nearKey}
                  tabIndex={bubble.tabIndex}
                  aria-hidden={bubble.ariaHidden}
                  // Keep focus on the scene so the keys keep working after a click.
                  onMouseDown={(e) => e.preventDefault()}
                  style={{ left: l.left, top: l.top }}
                >
                  {l.name}
                </button>
              );
            })}
          </div>
        </div>
        <RoomPlaces onOpen={openObject} />
      </div>

      <RoomDialog openKey={openKey} onClose={closeDialog} onClosed={restoreFocus} />
    </section>
  );
}
