"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useDeferredValue } from "react";
import {
  PALETTE_ITEMS,
  type PaletteItem,
} from "../components/about-console/consoleCommands";

type Params = {
  shortcutEnabled?: boolean;
};

export function useCommandPalette(params: Params = {}) {
  const { shortcutEnabled = true } = params;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  const filteredItems = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return PALETTE_ITEMS;

    return PALETTE_ITEMS.filter((item) => {
      return (
        item.id.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [deferredQuery]);

  const openPalette = useCallback(() => {
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    window.setTimeout(() => lastActiveElementRef.current?.focus(), 0);
  }, []);

  const trapFocus = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const container = containerRef.current;
    if (!container) return;

    const focusable = container.querySelectorAll<HTMLElement>(
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
  }, []);

  const onInputKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      runItem: (item: PaletteItem) => void,
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
        if (item) runItem(item);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closePalette();
      }
    },
    [activeIndex, closePalette, filteredItems],
  );

  // Ctrl/Cmd + K
  useEffect(() => {
    if (!shortcutEnabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isToggle) {
        e.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          if (next) {
            lastActiveElementRef.current =
              document.activeElement as HTMLElement | null;
            setQuery("");
            setActiveIndex(0);
            window.setTimeout(() => inputRef.current?.focus(), 0);
          }
          return next;
        });
        return;
      }
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcutEnabled]);

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
    trapFocus,
    onInputKeyDown,
  };
}
