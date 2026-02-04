import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFocus } from "../utils/useFocus";
import { PALETTE_ITEMS, normalizeCommand, toDisplayCommand, type PaletteItem } from "./consoleCommands";
import { ConsoleLineView } from "./ConsoleLineView";
import { ConsoleLine } from "./consoleTypes";

const ABOUT_LINES: ConsoleLine[] = [
  { id: "h1", type: "heroName", text: "CHEN LEIV" },
  { id: "h2", type: "heroTitle", text: "Frontend Developer" },
  { id: "s1", type: "skills", text: "React • Angular • TypeScript • SCSS • Node.js" },
  {
    id: "d1", type: "desc", text: "Turns complex requirements into elegant frontend systems, focused on intuitive and scalable interfaces, bringing adaptability, ownership, and a strong teamwork mindset.",
  },
  { id: "c0", type: "commandsTitle", text: "# Available commands:" },
  { id: "c1", type: "cmd", text: "showProjects()" },
  { id: "c2", type: "cmd", text: "contact()" },
  { id: "c3", type: "cmd", text: "recruiterMode()" },
  { id: "c4", type: "cmd", text: "clear()" },
];

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

export const InteractiveConsole = () => {
  const initialLines = useMemo(() => ABOUT_LINES, []);

  const [history, setHistory] = useState<ConsoleLine[]>(initialLines);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Palette
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const consoleRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // auto-scroll policy: only if user is “sticky” (near bottom)
  const stickyRef = useRef(true);

  // navigation guard: when we do page scroll, skip console autoscroll once
  const skipNextConsoleAutoScrollRef = useRef(false);

  const { setConsoleInputRef } = useFocus();

  const shortcutLabel = useMemo(() => (/mac/i.test(navigator.platform) ? "⌘K" : "Ctrl+K"), []);

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
    // This prevents the console autoscroll from “winning” the frame
    skipNextConsoleAutoScrollRef.current = true;

    const el = document.getElementById(id);
    if (!el) return;

    // Let React commit the console lines first, then scroll page.
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

    // print command echo as the canonical display (clean)
    const echo = { id: uid(), type: "input" as const, text: `> ${toDisplayCommand(canonical)}` };

    switch (canonical) {
      case "showProjects": {
        pushHistory([{ ...echo }, { id: uid(), type: "system", text: "👉 Scrolling to #projects..." }], raw);
        scrollToSection("projects");
        break;
      }

      case "contact": {
        if (isMobile()) {
          pushHistory([{ ...echo }, { id: uid(), type: "system", text: "📬 Scrolling to contact section..." }], raw);
          scrollToSection("contact");
          highlightSection("info");
        } else {
          pushHistory([{ ...echo }, { id: uid(), type: "system", text: "📬 Highlighting contact section..." }], raw);
          highlightSection("info");
        }
        break;
      }

      case "recruiterMode": {
        pushHistory([{ ...echo }, { id: uid(), type: "system", text: "🧩 Recruiter mode opened — pick a few skills." }], raw);
        window.openSkillMatcher?.();
        break;
      }

      case "clear": {
        setHistory(initialLines);
        setCommandHistory((prev) => [...prev, raw]);
        setHistoryIndex(-1);
        setSuggestions([]);
        setSuggestionIndex(-1);
        setInput("");
        scrollToConsoleTop();
        break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
    setSuggestions([]);
    setSuggestionIndex(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const v = value.trim().toLowerCase();
    if (!v) {
      setSuggestions([]);
      setSuggestionIndex(-1);
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
    setSuggestions([]);
    setSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const hasSuggestions = suggestions.length > 0;

    if (hasSuggestions && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setSuggestionIndex((prev) => {
        const start = prev < 0 ? 0 : prev;
        return e.key === "ArrowDown"
          ? Math.min(start + 1, suggestions.length - 1)
          : Math.max(start - 1, 0);
      });
      return;
    }

    if (e.key === "Tab" && hasSuggestions) {
      e.preventDefault();
      setInput(suggestions[suggestionIndex >= 0 ? suggestionIndex : 0]);
      return;
    }

    if (e.key === "Enter" && hasSuggestions && suggestionIndex >= 0) {
      e.preventDefault();
      handleCommand(suggestions[suggestionIndex]);
      setInput("");
      setSuggestions([]);
      setSuggestionIndex(-1);
      return;
    }

    // command history nav (when no suggestions)
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!commandHistory.length) return;
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex]);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
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

  const onPaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredItems.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = filteredItems[activeIndex];
      if (item) runPaletteItem(item);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    }
  };

  return (
    <div className="interactive-console" ref={consoleRef}>
      <div className="console-header" onClick={openPalette} style={{ cursor: "pointer" }}>
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

          <button type="button" className="palette-button" onClick={openPalette} aria-label="Open command palette">
            {shortcutLabel}
          </button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((sug, i) => (
            <li
              key={sug}
              className={`autocomplete-item ${i === suggestionIndex ? "active" : ""}`}
              onMouseDown={(e) => {
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
        <div className="palette-overlay" onClick={closePalette}>
          <div className="palette" onClick={(e) => e.stopPropagation()}>
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