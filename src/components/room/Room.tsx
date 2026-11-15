"use client";

import { useCallback, useMemo, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import { toViewPercent, VIEW_BOX } from "./iso";
import { PALETTES, type ScenePalette } from "./palettes";
import { FOOTPRINT_RECTS, OBJECT_BY_KEY, ROOM_OBJECTS, SCENE_FOOTPRINTS, type ObjectKey, type SceneItemId } from "./roomContent";
import { RoomDialog } from "./RoomDialog";
import { Background } from "./scene/Background";
import { Bucky } from "./scene/Bucky";
import { Chen } from "./scene/Chen";
import { Chair, CoffeeTable, Desk, Guitar, Lamp, Plant, Sofa, Tv } from "./scene/Furniture";
import { Shelf } from "./scene/Shelf";
import { WallPictures } from "./scene/WallPictures";
import { Window } from "./scene/Window";
import { ContactBoard } from "./scene/ContactBoard";
import { useWalker } from "./useWalker";

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
  bucky: () => <Bucky />,
  sofa: (p) => <Sofa p={p} />,
  plant: (p) => <Plant p={p} />,
};

const LABELS = ROOM_OBJECTS.map((o) => {
  const { left, top } = toViewPercent(o.label.x, o.label.y, o.label.z);
  return { key: o.key, name: o.name, left: `${left.toFixed(2)}%`, top: `${top.toFixed(2)}%` };
});

const VIEW_BOX_ATTR = [VIEW_BOX.x, VIEW_BOX.y, VIEW_BOX.w, VIEW_BOX.h].map((n) => n.toFixed(1)).join(" ");

// The stage keeps the viewBox ratio, so labels placed in percent stay on their objects.
const STAGE_STYLE = { "--room-ratio": (VIEW_BOX.w / VIEW_BOX.h).toFixed(4) } as CSSProperties;

const SCENE_LABEL = "Room. Use the arrow keys or WASD to walk. Stop next to an object to open it.";

function keyFromTarget(target: EventTarget | null): { key: ObjectKey; el: Element } | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest("[data-room-key]");
  const key = el?.getAttribute("data-room-key");
  return el && key && Object.hasOwn(OBJECT_BY_KEY, key) ? { key: key as ObjectKey, el } : null;
}

export default function Room() {
  const { theme, mounted } = useTheme();
  const palette = PALETTES[theme];

  const [openKey, setOpenKey] = useState<ObjectKey | null>(null);
  const [nearKey, setNearKey] = useState<ObjectKey | null>(null);
  const [hoverKey, setHoverKey] = useState<ObjectKey | null>(null);
  // Control that opened the popup; null means the scene itself.
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const onAutoOpen = useCallback((key: ObjectKey) => {
    returnFocusRef.current = null;
    setOpenKey(key);
  }, []);

  const { sceneRef, chenRef, slot, walkToAndOpen, markDialogOpen, markDialogClosed, handleKeyDown, getNear } = useWalker({
    footprints: FOOTPRINT_RECTS,
    onAutoOpen,
    onNearChange: setNearKey,
  });

  // Click on an object, a label or a quick button: open now, Chen walks there in the background.
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
    if (hit) openObject(hit.key, hit.el instanceof HTMLElement ? hit.el : null);
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
  const onLabelFocus = (e: FocusEvent<HTMLDivElement>) => setHoverKey(keyFromTarget(e.target)?.key ?? null);

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
  const prompt = nearKey
    ? `Next to: ${OBJECT_BY_KEY[nearKey].title}. Stay a moment to open it, or press E.`
    : "Walk next to an object and it opens, or click an object.";

  return (
    <section className="room" aria-label="Interactive room">
      <div
        ref={sceneRef}
        className="room__scene"
        style={STAGE_STYLE}
        tabIndex={0}
        role="application"
        aria-label={SCENE_LABEL}
        onClick={onSceneClick}
        onKeyDown={onSceneKeyDown}
        onPointerOver={onPointerOver}
        onPointerLeave={() => setHoverKey(null)}
        onFocus={onLabelFocus}
        onBlur={() => setHoverKey(null)}
      >
        <div className="room__stage" data-active={activeKey ?? undefined}>
          {mounted && (
            <svg className="room__svg" viewBox={VIEW_BOX_ATTR} aria-hidden="true" focusable="false">
              {background}
              {/* One keyed list, so a depth change moves Chen instead of remounting furniture. */}
              <g>{[...sceneItems.slice(0, slot), chen, ...sceneItems.slice(slot)]}</g>
            </svg>
          )}
          {LABELS.map((l) => (
            <button
              key={l.key}
              type="button"
              className="room__label"
              data-room-key={l.key}
              style={{ left: l.left, top: l.top }}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <p className="room__prompt" aria-live="polite">
        {prompt}
      </p>

      <div className="room__quick" role="group" aria-label="Open directly">
        {ROOM_OBJECTS.map((o) => (
          <button key={o.key} type="button" className="room__quick-btn" onClick={(e) => openObject(o.key, e.currentTarget)}>
            {o.name}
          </button>
        ))}
      </div>

      <RoomDialog openKey={openKey} onClose={closeDialog} onClosed={restoreFocus} />
    </section>
  );
}
