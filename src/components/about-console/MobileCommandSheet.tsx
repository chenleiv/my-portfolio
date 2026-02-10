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
    const [q, setQ] = useState("");
    const [activeGroup, setActiveGroup] = useState<string>("All");

    const groups = useMemo(() => {
        const set = new Set(commands.map((c) => c.group));
        return ["All", ...Array.from(set)];
    }, [commands]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        return commands.filter((c) => {
            const groupOk = activeGroup === "All" || c.group === activeGroup;
            if (!groupOk) return false;
            if (!query) return true;

            return (
                c.label.toLowerCase().includes(query) ||
                c.hint.toLowerCase().includes(query) ||
                c.id.toLowerCase().includes(query) ||
                c.keywords.some((k) => k.toLowerCase().includes(query))
            );
        });
    }, [commands, q, activeGroup]);

    if (!open) return null;

    return (
        <div className="mcs-overlay" onClick={onClose} role="presentation">
            <div
                className="mcs-sheet"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Commands"
            >
                <div className="mcs-header">
                    <div className="mcs-title">Commands</div>
                    <button type="button" className="mcs-close" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                <input
                    className="mcs-search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search…"
                    autoFocus
                />

                <div className="mcs-groups">
                    {groups.map((g) => (
                        <button
                            key={g}
                            type="button"
                            className={`mcs-group ${g === activeGroup ? "active" : ""}`}
                            onClick={() => setActiveGroup(g)}
                        >
                            {g}
                        </button>
                    ))}
                </div>

                <div className="mcs-list">
                    {filtered.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            className="mcs-item"
                            onClick={() => onSelect(c.id)}
                        >
                            <div className="mcs-item__label">{c.label}</div>
                            <div className="mcs-item__hint">{c.hint}</div>
                        </button>
                    ))}

                    {filtered.length === 0 && <div className="mcs-empty">No matches</div>}
                </div>
            </div>
        </div>
    );
}