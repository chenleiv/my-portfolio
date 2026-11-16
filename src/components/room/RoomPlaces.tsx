import { useId } from "react";
import { OBJECT_BY_KEY, PLACES_ORDER, type ObjectKey } from "./roomContent";

interface RoomPlacesProps {
  // Opens an object as if it were clicked; focus returns to the button afterwards.
  onOpen: (key: ObjectKey, trigger: HTMLElement) => void;
}

// The one Places list: under the How to play panel on desktop, under the room elsewhere. The buttons are the
// keyboard and screen reader way into the room. The heading holds one text per
// layout and CSS shows exactly one, so screen readers hear only the visible one.
export function RoomPlaces({ onOpen }: RoomPlacesProps) {
  const titleId = useId();
  return (
    <div className="room-places">
      <h2 id={titleId} className="room-places__title">
        <span className="room-places__title-wide">Jump to a place</span>
        <span className="room-places__title-touch">Tap the place you want to visit</span>
      </h2>
      <ul className="room-places__list" aria-labelledby={titleId}>
        {PLACES_ORDER.map((key) => (
          <li key={key}>
            <button type="button" className="room-places__button" onClick={(e) => onOpen(key, e.currentTarget)}>
              {OBJECT_BY_KEY[key].name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
