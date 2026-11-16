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

// Game-style instructions: the title, the arrow keys and one line of text. The
// Places list sits under it (RoomPlaces); the room itself shows which object
// Chen is next to, with its highlight and bubble.
export function HowToPlay() {
  const titleId = useId();
  return (
    <aside className="how-to-play" aria-labelledby={titleId}>
      <h2 id={titleId} className="how-to-play__title">
        How to play
      </h2>
      <KeyCaps />
      <p className="how-to-play__steps">Walk to an object and it opens, or click it.</p>
    </aside>
  );
}
