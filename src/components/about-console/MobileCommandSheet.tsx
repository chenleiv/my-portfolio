"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type CommandItem = {
    id: string;
    label: string;
    hint?: string;
    group?: string;
    keywords?: readonly string[];
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

    // Lock background scroll while open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // ESC close (useful for desktop emulation)
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useEffect(() => {
        if (open) {
            setQ("");
            setActiveGroup("All");
        }
    }, [open]);

    const groups = useMemo(() => {
        const set = new Set<string>();
        for (const c of commands) if (c.group) set.add(c.group);
        return ["All", ...Array.from(set)];
    }, [commands]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return commands.filter((c) => {
            if (activeGroup !== "All" && c.group !== activeGroup) return false;
            if (!query) return true;
            const hay = [
                c.label,
                c.id,
                c.hint ?? "",
                ...(c.keywords ?? []),
                c.group ?? "",
            ]
                .join(" ")
                .toLowerCase();
            return hay.includes(query);
        });
    }, [commands, q, activeGroup]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.button
                        type="button"
                        className="cmdsheet-backdrop"
                        aria-label="Close commands"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Sheet */}
                    <motion.div
                        className="cmdsheet"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Commands"
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 24, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    >
                        <div className="cmdsheet__grab" />

                        <div className="cmdsheet__header">
                            <div className="cmdsheet__title">Commands</div>
                            <button type="button" className="cmdsheet__close" onClick={onClose} aria-label="Close">
                                ✕
                            </button>
                        </div>

                        <div className="cmdsheet__tabs">
                            {groups.map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    className={`cmdsheet__tab ${activeGroup === g ? "is-active" : ""}`}
                                    onClick={() => setActiveGroup(g)}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>

                        <div className="cmdsheet__list">
                            {filtered.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    className="cmdsheet__item"
                                    onClick={() => {
                                        onSelect(c.id);
                                        onClose();
                                    }}
                                >
                                    <div className="cmdsheet__itemLabel">{c.label}</div>
                                    {c.hint && <div className="cmdsheet__itemHint">{c.hint}</div>}
                                </button>
                            ))}

                            {filtered.length === 0 && (
                                <div className="cmdsheet__empty">No matches</div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}