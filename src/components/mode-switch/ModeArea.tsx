"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { CONSOLE_TITLE, SITE_TITLE } from "../../content/titles";
import { useSideBySide, useTouchLayout } from "../../hooks/useTouchLayout";
import { VIEW_BOX } from "../room/iso";
import Room from "../room/Room";
import { MODE_PATH, modeFromPath, type Mode } from "./mode";
import ModeSwitch from "./ModeSwitch";

const loadTerminal = () => import("./TerminalPanel");

function TerminalLoading() {
  return (
    <div className="terminal-panel">
      <div className="console-wrapper">
        <div className="console-placeholder" role="status">
          Loading the terminal…
        </div>
      </div>
    </div>
  );
}

// Loaded only when Terminal is shown (or about to be). Client only: the
// console reads browser APIs while rendering.
const TerminalPanel = dynamic(loadTerminal, { ssr: false, loading: TerminalLoading });

// The room's width-to-height ratio, so the terminal can take the same size as the room scene.
const AREA_STYLE = { "--room-ratio": (VIEW_BOX.w / VIEW_BOX.h).toFixed(4) } as CSSProperties;

const ANNOUNCE: Readonly<Record<Mode, string>> = {
  play: "Room shown",
  terminal: "Terminal shown",
};

// Height of the room area while Play was last shown, and the viewport width it
// was measured at. A different width means the room would have another height.
type Lock = { height: number; width: number };

// The Play | Terminal switch and the area under it. The mode follows the URL:
// "/" is Play and "/console" is Terminal. Switching pushes the other URL with
// history.pushState, which Next keeps in sync with usePathname, so there is no
// reload and Back / Forward switch modes too. Play unmounts while Terminal shows.
export default function ModeArea() {
  const mode = modeFromPath(usePathname());
  const touch = useTouchLayout();
  const sideBySide = useSideBySide();
  const switchRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const prevModeRef = useRef<Mode>(mode);
  const [lock, setLock] = useState<Lock | null>(null);
  // Polite live region, written only after a mode change, never on first load.
  const liveRef = useRef<HTMLParagraphElement>(null);

  const select = useCallback((next: Mode) => {
    if (next === modeFromPath(window.location.pathname)) return;
    window.history.pushState(null, "", MODE_PATH[next]);
  }, []);

  const prefetch = useCallback((m: Mode) => {
    if (m === "terminal") void loadTerminal();
  }, []);

  const focusModeLink = useCallback((m: Mode) => {
    switchRef.current?.querySelector<HTMLElement>(`[data-mode="${m}"]`)?.focus({ preventScroll: true });
  }, []);

  // While Play shows, remember the room area's height for the terminal.
  useEffect(() => {
    if (mode !== "play") return;
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const height = el.getBoundingClientRect().height;
      const width = window.innerWidth;
      setLock((prev) => (prev && prev.height === height && prev.width === width ? prev : { height, width }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  // While Terminal shows, a width change makes the remembered height stale.
  useEffect(() => {
    if (mode !== "terminal" || !lock) return;
    const onResize = () => {
      if (window.innerWidth !== lock.width) setLock(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mode, lock]);

  // After a mode change (click or Back / Forward): title, announcement,
  // and focus back on the switch if it was lost with the content that unmounted.
  useEffect(() => {
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;
    document.title = mode === "terminal" ? CONSOLE_TITLE : SITE_TITLE;
    if (liveRef.current) liveRef.current.textContent = ANNOUNCE[mode];
    if (document.activeElement === document.body || document.activeElement === null) focusModeLink(mode);
  }, [mode, focusModeLink]);

  // Only side by side: there the room area is about the console's own height, so
  // locking it keeps the page still. Stacked, the area also holds the panel and
  // Places, so the console takes its own height and the content below moves once.
  const locked = mode === "terminal" && sideBySide && lock !== null;

  return (
    <>
      <div ref={switchRef} className="mode-switch-slot">
        <ModeSwitch active={mode} onSelect={select} onPrefetch={prefetch} />
      </div>
      <p ref={liveRef} className="visually-hidden" aria-live="polite" />
      <div
        ref={areaRef}
        className={`mode-area mode-area--${mode}${locked ? " mode-area--locked" : ""}`}
        style={{ ...AREA_STYLE, ...(locked ? { height: lock.height } : {}) }}
      >
        {mode === "play" ? <Room /> : <TerminalPanel autoFocus={!touch} />}
      </div>
    </>
  );
}
