"use client";

import { useMemo, useState } from "react";

export type CommandItem = {
    id: string;
    label: string;
    hint: string;
    group: string;
    keywords: readonly string[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    commands: readonly CommandItem[];
    onSelect: (cmdId: string) => void;
};

export function MobileCommandSheet({ open, onClose, commands, onSelect }: Props) {
    const [activeGroup, setActiveGroup] = useState<string>("All");

    const groups = useMemo(() => {
        const set = new Set(commands.map((c) => c.group));
        return ["All", ...Array.from(set)];
    }, [commands]);

    const filtered = useMemo(() => {
        if (activeGroup === "All") return commands;
        return commands.filter((c) => c.group === activeGroup);
    }, [commands, activeGroup]);

    if (!open) return null;

    return (
        <>
            <button
                type="button"
                className="cmdsheet-backdrop"
                onClick={onClose}
                aria-label="Close commands"
            />

            <div className="cmdsheet" role="dialog" aria-modal="true" aria-label="Commands">
                <div className="cmdsheet__grab" />

                <div className="cmdsheet__header">
                    <div className="cmdsheet__title">Commands</div>
                    <button type="button" className="cmdsheet__close" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="cmdsheet__tabs" role="tablist" aria-label="Command groups">
                    {groups.map((g) => (
                        <button
                            key={g}
                            type="button"
                            className={`cmdsheet__tab ${g === activeGroup ? "is-active" : ""}`}
                            onClick={() => setActiveGroup(g)}
                            role="tab"
                            aria-selected={g === activeGroup}
                        >
                            {g}
                        </button>
                    ))}
                </div>

                <div className="cmdsheet__list" role="list">
                    {filtered.map((c) => (
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

                    {filtered.length === 0 && <div className="cmdsheet__empty">No commands</div>}
                </div>
            </div>
        </>
    );
}