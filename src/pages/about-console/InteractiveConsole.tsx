import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFocus } from "../../utils/useFocus";
import {
  PALETTE_ITEMS,
  normalizeCommand,
  toDisplayCommand,
  type PaletteItem,
} from "./consoleCommands";
import { ConsoleLineView } from "./ConsoleLineView";
import { type ConsoleLine, ABOUT_LINES } from "./consoleTypes";

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

  const [suggestions, setSuggestions] = useState<readonly string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(-1);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [paletteQuery, setPaletteQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const consoleRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<boolean>(true);

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

  useEffect(() => {
    setConsoleInputRef(inputRef.current);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [setConsoleInputRef]);

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
      lastActiveElementRef.current = document.activeElement as HTMLElement | null;
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isToggle) {
        e.preventDefault();
        lastActiveElementRef.current = document.activeElement as HTMLElement | null;

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
    return PALETTE_ITEMS.filter((item) => {
      const q = paletteQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
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

  const HIDDEN_COMMANDS = new Set(["whoami", "hireme", "why", "coffee"]);

  const handleCommand = (raw: string) => {
    const rawLower = raw.trim().toLowerCase().replace(/\(\s*\)\s*$/, "");

    if (HIDDEN_COMMANDS.has(rawLower)) {
      const echoHidden: ConsoleLine = { id: uid(), type: "input", text: `> ${rawLower}()` };

      switch (rawLower) {
        case "whoami":
          pushHistory(
            [
              echoHidden,
              { id: uid(), type: "system", text: "Frontend dev • 3+ years • React/Angular/TS" },
            ],
            raw
          );
          return;

        case "hireme":
          pushHistory(
            [
              echoHidden,
              { id: uid(), type: "system", text: "✔ Available for frontend positions\n✔ React / Angular / TypeScript\n✔ Tel Aviv / Remote" },
            ],
            raw
          );
          return;

        case "coffee":
          pushHistory(
            [
              echoHidden,
              { id: uid(), type: "system", text: "☕ Coffee always accepted." },
            ],
            raw
          );
          return;
      }
    }

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

      case "portfolioCode": {
        const url = "https://github.com/chenleiv/my-portfolio";

        pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "link",
              text: "💻 Open portfolio source code",
              download: "github.com/chenleiv/my-portfolio",
              href: url,
            },
          ],
          raw
        );

        break;
      }
      case "cv": {
        const pdfUrl = `${import.meta.env.BASE_URL}assets/files/ChenLeiv-CV.pdf`;

        pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "download",
              text: "📄 Click to download CV",
              href: pdfUrl,
              download: "ChenLeiv-CV.pdf",
            },
          ],
          raw
        );
        break;
      }
      case "linkedin": {
        const url = "https://www.linkedin.com/in/chen-leiv-9533a1178/";

        pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "link",
              text: "Open LinkedIn profile",
              download: "linkedin/chen-leiv",
              href: url,
            },
          ],
          raw
        );
        break;
      }
      case "showProjects": {
        pushHistory([{ ...echo }, { id: uid(), type: "system", text: "👉 Scrolling to #projects..." }], raw);
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

      case "recruiterMode": {
        pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "system",
              text: "🧩 Recruiter mode opened.",
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

    const matches = PALETTE_ITEMS.map((item) => {
      const cmd = toDisplayCommand(item.id);
      const cmdLower = cmd.toLowerCase();

      let score = 0;
      if (cmdLower.startsWith(v)) score += 30;
      if (cmdLower.includes(v)) score += 10;

      const kwHit = item.keywords.some((k) => k.toLowerCase().includes(v));
      if (kwHit) score += 5;

      return { cmd, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.cmd);

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

  const trapFocus = (
    e: React.KeyboardEvent,
    container: HTMLDivElement | null
  ) => {
    if (e.key !== "Tab" || !container) return;

    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const active = document.activeElement;

    // Tab forward on last -> jump to first
    if (!e.shiftKey && active === last) {
      e.preventDefault();
      first?.focus();
    }

    // Shift+Tab on first -> jump to last
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last?.focus();
    }
  };

  const setFromHistoryIndex = (newIndex: number) => {
    const idx = commandHistory.length - 1 - newIndex;
    const cmd = getAt(commandHistory, idx);
    if (cmd !== undefined) setInput(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const hasSuggestions = suggestions.length > 0;

    if (hasSuggestions && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      cycleSuggestionIndex(e.key === "ArrowDown" ? 1 : -1);
      return;
    }

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

    if (e.key === "Enter" && hasSuggestions) {
      e.preventDefault();

      if (suggestionIndex < 0) setSuggestionIndex(0);

      const idx = suggestionIndex < 0 ? 0 : suggestionIndex;
      const cmd = getAt(suggestions, idx);
      if (cmd !== undefined) {
        handleCommand(cmd);
        setInput("");
        resetAutocomplete();
      }
      return;
    }

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
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    setIsPaletteOpen(true);
    setTimeout(() => paletteInputRef.current?.focus(), 0);
  };

  const closePalette = () => {
    setIsPaletteOpen(false);
    setPaletteQuery("");
    setActiveIndex(0);
    setTimeout(() => lastActiveElementRef.current?.focus(), 0);
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
            onClick={(e) => e.stopPropagation()}
            ref={paletteRef}
            onKeyDown={(e) => trapFocus(e, paletteRef.current)}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            tabIndex={-1}
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
