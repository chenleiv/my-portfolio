import { useId } from "react";
import { OBJECT_BY_KEY, PLACES_ORDER, type ObjectKey } from "./roomContent";

// Key caps are drawn only; the scene's aria-label names the keys for screen readers.
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

interface PlacesListProps {
  labelledBy: string;
  onOpen: (key: ObjectKey, trigger: HTMLElement) => void;
  className?: string;
}

// One button per place. Used in the panel and, on touch screens, under the room.
export function PlacesList({ labelledBy, onOpen, className }: PlacesListProps) {
  return (
    <ul className={`how-to-play__places-list${className ? ` ${className}` : ""}`} aria-labelledby={labelledBy}>
      {PLACES_ORDER.map((key) => (
        <li key={key}>
          <button type="button" className="how-to-play__place" onClick={(e) => onOpen(key, e.currentTarget)}>
            {OBJECT_BY_KEY[key].name}
          </button>
        </li>
      ))}
    </ul>
  );
}

interface HowToPlayProps {
  nearName: string | null;
  // Opens an object as if it were clicked; focus returns to the button afterwards.
  onOpen: (key: ObjectKey, trigger: HTMLElement) => void;
}

// Game-style instructions, the Places list and the live status line. The Places
// buttons are the keyboard and screen reader way into the room. The status text
// is written in sentence case and shown in capitals by CSS, so screen readers
// read words, not letters. It changes only when the nearest object changes.
export function HowToPlay({ nearName, onOpen }: HowToPlayProps) {
  const titleId = useId();
  const placesId = useId();
  return (
    <aside className="how-to-play" aria-labelledby={titleId}>
      <h2 id={titleId} className="how-to-play__title">
        How to play
      </h2>
      <KeyCaps />
      <p className="how-to-play__steps">Walk to an object and it opens, or click it.</p>
      <div className="how-to-play__places">
        <p id={placesId} className="how-to-play__places-title">
          Places
        </p>
        <PlacesList labelledBy={placesId} onOpen={onOpen} />
      </div>
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
