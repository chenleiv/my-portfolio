import { useId } from "react";

// Same order in both rows, so each column pairs an arrow with its letter.
const ARROWS = ["up", "left", "down", "right"] as const;
const LETTERS = ["W", "A", "S", "D"] as const;

// Key caps are drawn only; the scene's aria-label names the keys for screen
// readers. Two tight rows: the arrows, then W A S D.
function KeyCaps() {
  return (
    <div className="how-to-play__keys" aria-hidden="true">
      {ARROWS.map((dir) => (
        <kbd key={dir} className="how-to-play__key">
          <span className={`how-to-play__arrow how-to-play__arrow--${dir}`} />
        </kbd>
      ))}
      {LETTERS.map((letter) => (
        <kbd key={letter} className="how-to-play__key">
          {letter}
        </kbd>
      ))}
    </div>
  );
}

interface HowToPlayProps {
  nearName: string | null;
}

// Game-style instructions and the live status line; the Places list sits under
// the room (RoomPlaces). The status text is written in sentence case and shown
// in capitals by CSS, so screen readers read words, not letters. It changes
// only when the nearest object changes.
export function HowToPlay({ nearName }: HowToPlayProps) {
  const titleId = useId();
  return (
    <aside className="how-to-play" aria-labelledby={titleId}>
      <h2 id={titleId} className="how-to-play__title">
        How to play
      </h2>
      <KeyCaps />
      <p className="how-to-play__steps">Walk to an object and it opens, or click it.</p>
      <div className="how-to-play__status">
        <p className="how-to-play__status-title" aria-hidden="true">
          Status
        </p>
        {/* Same structure in both states so the panel never changes size:
            the options keep their space and are hidden while nothing is near.
            Hidden options are left out of the announcement too. */}
        <div aria-live="polite" aria-atomic="true">
          <p className="how-to-play__status-main">{nearName ? `Next to: ${nearName}` : "Walk to an object"}</p>
          <ul className={`how-to-play__options${nearName ? "" : " how-to-play__options--idle"}`}>
            <li>Stay a moment</li>
            <li>Press E</li>
            <li>Click</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
