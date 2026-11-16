"use client";

import type { MouseEvent } from "react";
import { MODE_PATH, type Mode } from "./mode";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "play", label: "Play" },
  { id: "terminal", label: "Terminal" },
];

interface ModeSwitchProps {
  active: Mode;
  // Swaps the content in place. Without JS the links load the page normally.
  onSelect: (mode: Mode) => void;
  // Called when the pointer or focus reaches a mode, to load its code early.
  onPrefetch?: (mode: Mode) => void;
}

// A plain left click is handled in place; modified clicks (new tab, new window)
// keep the browser's default.
function isPlainClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

// Segmented Play | Terminal switch. Both modes are always real links, so focus
// stays on the clicked one after the swap; the current mode is aria-current.
export default function ModeSwitch({ active, onSelect, onPrefetch }: ModeSwitchProps) {
  return (
    <div className="mode-switch">
      <nav aria-label="Mode">
        <ul className="mode-switch__list">
          {MODES.map((m) => (
            <li key={m.id}>
              <a
                className="mode-switch__item"
                href={MODE_PATH[m.id]}
                data-mode={m.id}
                aria-current={m.id === active ? "page" : undefined}
                onClick={(e) => {
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  onSelect(m.id);
                }}
                onPointerEnter={() => onPrefetch?.(m.id)}
                onFocus={() => onPrefetch?.(m.id)}
                onTouchStart={() => onPrefetch?.(m.id)}
              >
                {m.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* CSS shows exactly one of these lines, so only one is read. */}
      <p className="mode-switch__hint mode-switch__hint--wide">Explore my room, or type commands in the terminal.</p>
      <p className="mode-switch__hint mode-switch__hint--touch">
        Terminal: type commands like <code>contact()</code> or <code>cv()</code>.
      </p>
    </div>
  );
}
