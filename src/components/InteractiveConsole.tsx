import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFocus } from "../utils/useFocus";
import {
  PALETTE_ITEMS,
  normalizeCommand,
  toDisplayCommand,
  type PaletteItem,
} from "./consoleCommands";
import { ConsoleLineView } from "./ConsoleLineView";
import { type ConsoleLine, ABOUT_LINES } from "./consoleTypes";

/**
 * Better ID:
 * - Primary: crypto.randomUUID() (modern, collision-resistant)
 * - Fallback: crypto.getRandomValues + timestamp (still very safe for UI keys)
 */
const uid = (): string => {
  const c = globalThis.crypto as Crypto & {
    randomUUID?: () => string;
    getRandomValues?: (array: Uint8Array) => Uint8Array;
  };

  if (c?.randomUUID) return c.randomUUID();

  if (c?.getRandomValues) {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${Date.now().toString(16)}-${hex}`;
  }

  // last-resort fallback (still fine for UI keys)
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
};

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

// Safe array access (strict + noUncheckedIndexedAccess friendly)
const getAt = (arr: readonly string[], index: number): string | undefined =>
  index >= 0 && index < arr.length ? arr[index] : undefined;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const InteractiveConsole = () => {
  const initialLines = useMemo(() => ABOUT_LINES, []);

  const [history, setHistory] = useState<ConsoleLine[]>(initialLines);
  const [input, setInput] = useState<string>("");

  // suggestions is effectively immutable: we only replace it
  const [suggestions, setSuggestions] = useState<readonly string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(-1);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Palette
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [paletteQuery, setPaletteQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const consoleRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // auto-scroll policy: only if user is “sticky” (near bottom)
  const stickyRef = useRef<boolean>(true);

  // navigation guard: when we do page scroll, skip console autoscroll once
  const skipNextConsoleAutoScrollRef = useRef<boolean>(false);

  const { setConsoleInputRef } = useFocus();

  const shortcutLabel = useMemo(
    () => (/mac/i.test(navigator.platform) ? "⌘K" : "Ctrl+K"),
    []
  );

  const resetAutocomplete = () => {
    setSuggestions([]);
    setSuggestionIndex(-1);
  };

  // focus on load + register
  useEffect(() => {
    setConsoleInputRef(inputRef.current);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [setConsoleInputRef]);

  // track user scroll inside console-history (sticky mode)
  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;

    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      stickyRef.current = distance < 80;
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // auto-scroll when new history printed
  useEffect(() => {
    if (skipNextConsoleAutoScrollRef.current) {
      skipNextConsoleAutoScrollRef.current = false;
      return;
    }
    if (!stickyRef.current) return;

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [history]);

  // Cmd/Ctrl+K palette toggle
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isToggle) {
        e.preventDefault();
        setIsPaletteOpen((prev) => {
          const next = !prev;
          if (next) {
            setPaletteQuery("");
            setActiveIndex(0);
            window.setTimeout(() => paletteInputRef.current?.focus(), 0);
          }
          return next;
        });
        return;
      }

      if (e.key === "Escape") setIsPaletteOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredItems = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    return PALETTE_ITEMS.filter((item) => {
      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
      );
    });
  }, [paletteQuery]);

  const pushHistory = (lines: ConsoleLine[], rawCmd: string) => {
    setHistory((prev) => [...prev, ...lines]);
    setCommandHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);
  };

  const scrollToSection = (id: string) => {
    skipNextConsoleAutoScrollRef.current = true;

    const el = document.getElementById(id);
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const highlightSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("highlight");
    window.setTimeout(() => el.classList.remove("highlight"), 900);
  };

  const scrollToConsoleTop = () => {
    consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(() => {
      if (historyRef.current) historyRef.current.scrollTop = 0;
    });
  };

  const handleCommand = (raw: string) => {
    const canonical = normalizeCommand(raw);

    if (!canonical) {
      pushHistory(
        [
          { id: uid(), type: "input", text: `> ${raw}` },
          {
            id: uid(),
            type: "error",
            text: `❌ Unknown command: '${raw}'. Try: showProjects / contact / recruiterMode / clear`,
          },
        ],
        raw
      );
      return;
    }

    const echo: ConsoleLine = {
      id: uid(),
      type: "input",
      text: `> ${toDisplayCommand(canonical)}`,
    };

    switch (canonical) {
      case "showProjects": {
        pushHistory(
          [
            { ...echo },
            { id: uid(), type: "system", text: "👉 Scrolling to #projects..." },
          ],
          raw
        );
        scrollToSection("projects");
        break;
      }

      case "contact": {
        if (isMobile()) {
          pushHistory(
            [
              { ...echo },
              {
                id: uid(),
                type: "system",
                text: "📬 Scrolling to contact section...",
              },
            ],
            raw
          );
          scrollToSection("contact");
          highlightSection("info");
        } else {
          pushHistory(
            [
              { ...echo },
              {
                id: uid(),
                type: "system",
                text: "📬 Highlighting contact section...",
              },
            ],
            raw
          );
          highlightSection("info");
        }
        break;
      }

      case "skills": {
        pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "system",
              text: "🧩 Recruiter mode opened — pick a few skills.",
            },
          ],
          raw
        );
        window.openSkillMatcher?.();
        break;
      }

      case "clear": {
        setHistory(initialLines);
        setCommandHistory((prev) => [...prev, raw]);
        setHistoryIndex(-1);
        resetAutocomplete();
        setInput("");
        scrollToConsoleTop();
        break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    handleCommand(trimmed);
    setInput("");
    resetAutocomplete();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const v = value.trim().toLowerCase();
    if (!v) {
      resetAutocomplete();
      return;
    }

    const matches = PALETTE_ITEMS.map((x) => toDisplayCommand(x.id)).filter((c) =>
      c.toLowerCase().startsWith(v)
    );

    setSuggestions(matches);
    setSuggestionIndex(matches.length ? 0 : -1);
  };

  const pickSuggestion = (suggestion: string) => {
    setInput(suggestion);
    resetAutocomplete();
    inputRef.current?.focus();
  };

  const cycleSuggestionIndex = (direction: 1 | -1) => {
    setSuggestionIndex((prev) => {
      if (suggestions.length === 0) return -1;

      const start = prev < 0 ? 0 : prev;
      const next = start + direction;

      return clamp(next, 0, suggestions.length - 1);
    });
  };

  const runActiveSuggestion = () => {
    if (suggestionIndex < 0) return;
    const cmd = getAt(suggestions, suggestionIndex);
    if (cmd === undefined) return;

    handleCommand(cmd);
    setInput("");
    resetAutocomplete();
  };

  const setFromHistoryIndex = (newIndex: number) => {
    const idx = commandHistory.length - 1 - newIndex;
    const cmd = getAt(commandHistory, idx);
    if (cmd !== undefined) setInput(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const hasSuggestions = suggestions.length > 0;

    // Suggestions navigation
    if (hasSuggestions && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      cycleSuggestionIndex(e.key === "ArrowDown" ? 1 : -1);
      return;
    }

    // Tab cycles suggestions (Shift+Tab goes backwards)
    if (e.key === "Tab" && hasSuggestions) {
      e.preventDefault();

      const dir: 1 | -1 = e.shiftKey ? -1 : 1;

      // If nothing selected yet, select first/last and commit
      if (suggestionIndex < 0) {
        const idx = dir === 1 ? 0 : suggestions.length - 1;
        setSuggestionIndex(idx);
        const next = getAt(suggestions, idx);
        if (next !== undefined) setInput(next);
        return;
      }

      const nextIndex = clamp(suggestionIndex + dir, 0, suggestions.length - 1);
      setSuggestionIndex(nextIndex);
      const next = getAt(suggestions, nextIndex);
      if (next !== undefined) setInput(next);

      return;
    }

    // Enter runs selected suggestion
    if (e.key === "Enter" && hasSuggestions && suggestionIndex >= 0) {
      e.preventDefault();
      runActiveSuggestion();
      return;
    }

    // Command history navigation (only when no suggestions)
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex =
        historyIndex < commandHistory.length - 1
          ? historyIndex + 1
          : historyIndex;

      setHistoryIndex(newIndex);
      setFromHistoryIndex(newIndex);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFromHistoryIndex(newIndex);
      return;
    }
  };

  const openPalette = () => {
    setIsPaletteOpen(true);
    setPaletteQuery("");
    setActiveIndex(0);
    window.setTimeout(() => paletteInputRef.current?.focus(), 0);
  };

  const closePalette = () => {
    setIsPaletteOpen(false);
    setPaletteQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  const runPaletteItem = (item: PaletteItem) => {
    handleCommand(item.id);
    closePalette();
  };

  const onPaletteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      if (item) runPaletteItem(item);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    }
  };

  return (
    <div className="interactive-console" ref={consoleRef}>
      <div
        className="console-header"
        onClick={openPalette}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPalette();
        }}
        aria-label="Open command palette"
      >
        dev@portfolio:~$ interactive mode
      </div>

      <div className="console-history" ref={historyRef}>
        {history.map((line) => (
          <div key={line.id} className="console-line">
            <ConsoleLineView line={line} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="console-input-row">
        <div className="console-input-wrap">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="console-input"
            placeholder="Type a command..."
            autoComplete="off"
            spellCheck={false}
          />

          <button
            type="button"
            className="palette-button"
            onClick={openPalette}
            aria-label="Open command palette"
          >
            {shortcutLabel}
          </button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <ul className="autocomplete-list" role="listbox" aria-label="Command suggestions">
          {suggestions.map((sug, i) => (
            <li
              key={sug}
              className={`autocomplete-item ${i === suggestionIndex ? "active" : ""}`}
              role="option"
              aria-selected={i === suggestionIndex}
              onMouseDown={(e: React.MouseEvent<HTMLLIElement>) => {
                e.preventDefault();
                pickSuggestion(sug);
              }}
              onMouseEnter={() => setSuggestionIndex(i)}
            >
              {sug}
            </li>
          ))}
        </ul>
      )}

      {isPaletteOpen && (
        <div className="palette-overlay" onClick={closePalette} role="presentation">
          <div
            className="palette"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="palette-header">
              <span>Command Palette</span>
              <span className="palette-hint">Enter: run • Esc: close</span>
            </div>

            <input
              ref={paletteInputRef}
              className="palette-input"
              value={paletteQuery}
              onChange={(e) => {
                setPaletteQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onPaletteKeyDown}
              placeholder="Type a command…"
            />

            <ul className="palette-list">
              {filteredItems.map((item, idx) => (
                <li
                  key={item.id}
                  className={`palette-item ${idx === activeIndex ? "active" : ""}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => runPaletteItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runPaletteItem(item);
                  }}
                >
                  <div className="palette-item-title">{item.label}</div>
                  <div className="palette-item-cmd">{toDisplayCommand(item.id)}</div>
                </li>
              ))}
              {filteredItems.length === 0 && <li className="palette-empty">No matches</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
