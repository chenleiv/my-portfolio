"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PALETTE_ITEMS } from "../components/about-console/consoleCommands";
import type { PaletteItem } from "../components/about-console/consoleCommands";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PALETTE_ITEMS.filter((item) => {
      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query]);

  const openPalette = () => {
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closePalette = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => lastActiveRef.current?.focus(), 0);
  };

  // Cmd/Ctrl+K toggle
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isToggle) {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
        return;
      }
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    run: (item: PaletteItem) => void,
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredItems.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = filteredItems[activeIndex];
      if (item) run(item);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    }
  };

  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !containerRef.current) return;

    const focusable = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (!e.shiftKey && active === last) {
      e.preventDefault();
      first?.focus();
    }

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last?.focus();
    }
  };

  return {
    open,
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    filteredItems,
    inputRef,
    containerRef,
    openPalette,
    closePalette,
    onInputKeyDown,
    trapFocus,
  };
}
