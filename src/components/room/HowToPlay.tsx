import { useId } from "react";

const ARROWS = ["up", "left", "down", "right"] as const;

// Key caps are drawn only; the scene's aria-label names the keys for screen
// readers. Only the arrows are shown; W A S D also work (see useWalker.ts).
function KeyCaps() {
  return (
    <div className="how-to-play__keys" aria-hidden="true">
      {ARROWS.map((dir) => (
        <kbd key={dir} className="how-to-play__key">
          <span className={`how-to-play__arrow how-to-play__arrow--${dir}`} />
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
        {/* Always two lines tall, so the panel never changes size. */}
        <p className="how-to-play__status-main" aria-live="polite" aria-atomic="true">
          {nearName ? `Next to: ${nearName}` : "Walk to an object"}
        </p>
      </div>
    </aside>
  );
}
