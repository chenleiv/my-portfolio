import { useId } from "react";

// Key caps are drawn only; the first instruction line says the same in text.
function KeyCaps() {
  return (
    <div className="how-to-play__keys" aria-hidden="true">
      <div className="how-to-play__cluster">
        <kbd className="how-to-play__key how-to-play__key--up">
          <span className="how-to-play__arrow how-to-play__arrow--up" />
        </kbd>
        <kbd className="how-to-play__key">
          <span className="how-to-play__arrow how-to-play__arrow--left" />
        </kbd>
        <kbd className="how-to-play__key">
          <span className="how-to-play__arrow how-to-play__arrow--down" />
        </kbd>
        <kbd className="how-to-play__key">
          <span className="how-to-play__arrow how-to-play__arrow--right" />
        </kbd>
      </div>
      <div className="how-to-play__cluster">
        <kbd className="how-to-play__key how-to-play__key--up">W</kbd>
        <kbd className="how-to-play__key">A</kbd>
        <kbd className="how-to-play__key">S</kbd>
        <kbd className="how-to-play__key">D</kbd>
      </div>
    </div>
  );
}

// Game-style instructions and the live status line. The status text is written
// in sentence case and shown in capitals by CSS, so screen readers read words,
// not letters. It changes only when the nearest object changes.
export function HowToPlay({ nearName }: { nearName: string | null }) {
  const titleId = useId();
  return (
    <aside className="how-to-play" aria-labelledby={titleId}>
      <h2 id={titleId} className="how-to-play__title">
        How to play
      </h2>
      <KeyCaps />
      <ul className="how-to-play__steps">
        <li>Walk with the arrow keys or WASD.</li>
        <li>Stop next to an object and it opens.</li>
        <li>Or click any label.</li>
      </ul>
      <div className="how-to-play__status">
        <p className="how-to-play__status-title" aria-hidden="true">
          Status
        </p>
        <div aria-live="polite" aria-atomic="true">
          {nearName ? (
            <>
              <p className="how-to-play__status-main">Next to: {nearName}</p>
              <ul className="how-to-play__options">
                <li>Stay a moment</li>
                <li>Press E</li>
                <li>Click</li>
              </ul>
            </>
          ) : (
            <p className="how-to-play__status-main">Walk to an object</p>
          )}
        </div>
      </div>
    </aside>
  );
}
