"use client";

import { useRef } from "react";
import { CommandItem } from "./mobileCommands";

export function MobileCommandSheet({ open, onClose, commands, onSelect }: { open: boolean; onClose: () => void; commands: readonly CommandItem[]; onSelect: (id: string) => void }) {
    const startY = useRef<number | null>(null);

    if (!open) return null;

    const onTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (startY.current === null) return;

        const delta = e.touches[0].clientY - startY.current;

        // אם גררו למטה יותר מ-80px → נסגור
        if (delta > 80) {
            startY.current = null;
            onClose();
        }
    };

    const onTouchEnd = () => {
        startY.current = null;
    };

    return (
        <>
            <button
                type="button"
                className="cmdsheet-backdrop"
                onClick={onClose}
                aria-label="Close commands"
            />

            <div
                className="cmdsheet"
                role="dialog"
                aria-modal="true"
                aria-label="Commands"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="cmdsheet__grab" />

                <div className="cmdsheet__header">
                    <div className="cmdsheet__title">Commands</div>
                    <button
                        type="button"
                        className="cmdsheet__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="cmdsheet__list" role="list">
                    {commands.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            className="cmdsheet__item"
                            onClick={() => onSelect(c.id)}
                        >
                            <div className="cmdsheet__itemLabel">{c.label}</div>
                            <div className="cmdsheet__itemHint">{c.hint}</div>
                        </button>
                    ))}

                    {commands.length === 0 && (
                        <div className="cmdsheet__empty">No commands</div>
                    )}
                </div>
            </div>
        </>
    );
}