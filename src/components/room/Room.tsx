"use client";

import { useCallback, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import { project, VIEW_H, VIEW_W } from "./iso";
import { PALETTES, type ScenePalette } from "./palettes";
import { OBJECT_BY_KEY, ROOM_OBJECTS, type ObjectKey } from "./roomContent";
import { RoomDialog } from "./RoomDialog";
import { Background } from "./scene/Background";
import { Bucky } from "./scene/Bucky";
import { Chen } from "./scene/Chen";
import { CoffeeTable, Desk, Lamp, Plant, Sofa, Tv } from "./scene/Furniture";
import { Shelf } from "./scene/Shelf";
import { WallPictures } from "./scene/WallPictures";
import { Window } from "./scene/Window";
import { useWalker } from "./useWalker";

interface SceneItem {
  readonly id: string;
  // Chen is drawn in front of every item whose depth is at most her x + y.
  readonly depth: number;
  readonly render: (p: ScenePalette) => ReactNode;
}

// Sorted by depth, back to front.
const SCENE_ITEMS: readonly SceneItem[] = [
  { id: "window", depth: 0.1, render: (p) => <Window p={p} /> },
  { id: "shelf", depth: 4.15, render: (p) => <Shelf p={p} /> },
  { id: "lamp", depth: 6.0, render: (p) => <Lamp p={p} /> },
  { id: "tv", depth: 8.3, render: (p) => <Tv p={p} /> },
  { id: "desk", depth: 8.35, render: (p) => <Desk p={p} /> },
  { id: "coffee-table", depth: 11.3, render: (p) => <CoffeeTable p={p} /> },
  { id: "bucky", depth: 12.3, render: () => <Bucky /> },
  { id: "sofa", depth: 13.45, render: (p) => <Sofa p={p} /> },
  { id: "plant", depth: 18.2, render: (p) => <Plant p={p} /> },
];

const DEPTHS = SCENE_ITEMS.map((i) => i.depth);

const LABELS = ROOM_OBJECTS.map((o) => {
  const [x, y] = project(o.label.x, o.label.y, o.label.z);
  return { key: o.key, name: o.name, left: `${((x / VIEW_W) * 100).toFixed(2)}%`, top: `${((y / VIEW_H) * 100).toFixed(2)}%` };
});

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

  const { sceneRef, chenRef, slot, walkTo, markDialogClosed, handleKeyDown, getNear } = useWalker({
    depths: DEPTHS,
    onAutoOpen,
    onNearChange: setNearKey,
  });

  const openObject = useCallback(
    (key: ObjectKey, trigger: HTMLElement | null) => {
      returnFocusRef.current = trigger;
      walkTo(key, true);
      setOpenKey(key);
    },
    [walkTo],
  );

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
      const near = getNear();
      if (!near) return;
      e.preventDefault();
      openObject(near, onScene ? null : (e.target as HTMLElement));
    }
  };

  const onPointerOver = (e: PointerEvent<HTMLDivElement>) => setHoverKey(keyFromTarget(e.target)?.key ?? null);
  const onLabelFocus = (e: FocusEvent<HTMLDivElement>) => setHoverKey(keyFromTarget(e.target)?.key ?? null);

  const sceneItems = useMemo(
    () => SCENE_ITEMS.map((item) => <g key={item.id}>{item.render(palette)}</g>),
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
            <svg className="room__svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" focusable="false">
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
