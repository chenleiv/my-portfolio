"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { OBJECT_BY_KEY, type ObjectKey } from "./roomContent";
import { RoomPopupBody } from "./RoomPopupBody";

interface RoomDialogProps {
  openKey: ObjectKey | null;
  // Asks the parent to close (close button, Esc, backdrop click).
  onClose: () => void;
  // Runs after the dialog has closed, to return focus.
  onClosed: () => void;
}

const FOCUSABLE = "a[href], button:not([disabled])";

// Modal popup for a room object, built on the native <dialog> element:
// showModal() makes the rest of the page inert and gives Esc for free.
export function RoomDialog({ openKey, onClose, onClosed }: RoomDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onClosedRef = useRef(onClosed);
  const titleId = useId();
  const isOpen = openKey !== null;

  useEffect(() => {
    onClosedRef.current = onClosed;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      onClosedRef.current();
    };
  }, [isOpen]);

  // Keep Tab inside the dialog.
  const handleKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // The dialog element fills the viewport; a click on it outside the card is a backdrop click.
  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const object = openKey ? OBJECT_BY_KEY[openKey] : null;

  return (
    <dialog
      ref={dialogRef}
      className="room-dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {object && (
        <div className={`room-dialog__card${openKey === "shelf" ? " room-dialog__card--wide" : ""}`}>
          {/* The header stays put; only the body scrolls, so the close button is always visible. */}
          <div className="room-dialog__header">
            <h2 id={titleId} className="room-dialog__title">
              {object.title}
            </h2>
            <button ref={closeRef} type="button" className="room-dialog__close" aria-label="Close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="room-dialog__body">
            <RoomPopupBody objectKey={object.key} />
          </div>
        </div>
      )}
    </dialog>
  );
}
