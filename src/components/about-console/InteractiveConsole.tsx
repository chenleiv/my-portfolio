"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFocus } from "../../utils/useFocus";
import { useIsMobile } from "../../hooks/useIsMobile";

import { ABOUT_LINES, type ConsoleLine } from "./consoleTypes";
import { ConsoleLineView } from "./ConsoleLineView";
import { MobileCommandSheet } from "./MobileCommandSheet";

import { useStickyAutoScroll } from "../../hooks/useStickyAutoScroll";
import { useConsoleAutocomplete } from "../../hooks/useConsoleAutocomplete";
import { useCommandHistory } from "../../hooks/useCommandHistory";
import { useCommandPalette } from "../../hooks/useCommandPalette";

import { createCommandRunner } from "./commands/createCommandRunner";
import { MOBILE_COMMANDS } from "./mobileCommands";
import { toDisplayCommand, type PaletteItem } from "./consoleCommands";

export const InteractiveConsole = () => {
  const isMobile = useIsMobile(768);
  const initialLines = useMemo(() => ABOUT_LINES, []);
  const shortcutLabel = useMemo(() => (/mac/i.test(navigator.platform) ? "⌘K" : "Ctrl+K"), []);

  const [history, setHistory] = useState<ConsoleLine[]>(initialLines);
  const [sheetOpen, setSheetOpen] = useState(false);

  const consoleRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const skipNextAutoScrollRef = useRef(false);
  const { setConsoleInputRef } = useFocus();

  const auto = useStickyAutoScroll({
    historyRef,
    deps: [history],
    skipRef: skipNextAutoScrollRef,
  });

  const ac = useConsoleAutocomplete();
  const cmdHistory = useCommandHistory();

  const palette = useCommandPalette();

  const scrollToConsoleTop = () => {
    consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(() => {
      if (historyRef.current) historyRef.current.scrollTop = 0;
    });
  };

  const scrollToSection = (id: string) => {
    skipNextAutoScrollRef.current = true;
    const el = document.getElementById(id);
    if (!el) return;
    requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const highlightSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("highlight");
    window.setTimeout(() => el.classList.remove("highlight"), 900);
  };

  const pushHistory = (lines: ConsoleLine[], rawCmd: string) => {
    setHistory((prev) => [...prev, ...lines]);
    cmdHistory.pushCommand(rawCmd);
  };

  const handleCommand = useMemo(
    () =>
      createCommandRunner({
        isMobile,
        initialLines,

        pushHistory,
        setHistory,
        setInput: ac.setInput,
        resetAutocomplete: ac.resetAutocomplete,

        setCommandHistoryRaw: cmdHistory.pushCommand,

        scrollToSection,
        highlightSection,
        scrollToConsoleTop,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile, initialLines]
  );

  useEffect(() => {
    setConsoleInputRef(inputRef.current);
    if (!isMobile) window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [setConsoleInputRef, isMobile]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ac.input.trim();
    if (!trimmed) return;

    handleCommand(trimmed);
    ac.setInput("");
    ac.resetAutocomplete();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ac.updateFromInput(e.target.value);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const hasSuggestions = ac.suggestions.length > 0;

    if (hasSuggestions && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      ac.cycle(e.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (e.key === "Tab" && hasSuggestions) {
      e.preventDefault();
      const dir: 1 | -1 = e.shiftKey ? -1 : 1;

      if (ac.suggestionIndex < 0) {
        const idx = dir === 1 ? 0 : ac.suggestions.length - 1;
        ac.setSuggestionIndex(idx);
        ac.commitAt(idx);
        return;
      }

      const nextIndex = Math.min(
        Math.max(ac.suggestionIndex + dir, 0),
        ac.suggestions.length - 1
      );
      ac.setSuggestionIndex(nextIndex);
      ac.commitAt(nextIndex);
      return;
    }

    if (e.key === "Enter" && hasSuggestions) {
      e.preventDefault();
      const cmd = ac.commitActive();
      if (cmd) {
        handleCommand(cmd);
        ac.setInput("");
        ac.resetAutocomplete();
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const { nextInput } = cmdHistory.moveUp();
      if (nextInput !== undefined) ac.setInput(nextInput);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const { nextInput } = cmdHistory.moveDown();
      ac.setInput(nextInput ?? "");
      return;
    }
  };

  const runPaletteItem = (item: PaletteItem) => {
    handleCommand(item.id);
    palette.closePalette();
  };

  return (
    <div className="interactive-console" ref={consoleRef}>
      <div
        className="console-header"
        onClick={() => {
          if (isMobile) setSheetOpen(true);
          else palette.openPalette();
        }}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (isMobile) setSheetOpen(true);
            else palette.openPalette();
          }
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
      </div>

      <form onSubmit={onSubmit} className="console-input-row">
        <div className="console-input-wrap">
          <input
            ref={inputRef}
            className="console-input"
            value={ac.input}
            onChange={isMobile ? undefined : onInputChange}
            onKeyDown={isMobile ? undefined : onInputKeyDown}
            readOnly={isMobile}
            placeholder={isMobile ? "Tap to choose a command…" : "Type a command…"}
            onClick={() => {
              if (!isMobile) return;
              setSheetOpen(true);
              requestAnimationFrame(() => auto.scrollToBottom("smooth"));
            }}
          />

          {!isMobile && (
            <button
              type="button"
              className="palette-button"
              onClick={palette.openPalette}
              aria-label="Open command palette"
            >
              {shortcutLabel}
            </button>
          )}
        </div>
      </form>

      {!isMobile && ac.suggestions.length > 0 && (
        <ul className="autocomplete-list" role="listbox" aria-label="Command suggestions">
          {ac.suggestions.map((sug, i) => (
            <li
              key={sug}
              className={`autocomplete-item ${i === ac.suggestionIndex ? "active" : ""}`}
              role="option"
              aria-selected={i === ac.suggestionIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                ac.setInput(sug);
                ac.resetAutocomplete();
                inputRef.current?.focus();
              }}
              onMouseEnter={() => ac.setSuggestionIndex(i)}
            >
              {sug}
            </li>
          ))}
        </ul>
      )}

      {palette.open && (
        <div className="palette-overlay" onClick={palette.closePalette} role="presentation">
          <div
            className="palette"
            onClick={(e) => e.stopPropagation()}
            ref={palette.containerRef}
            onKeyDown={palette.trapFocus}
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
              ref={palette.inputRef}
              className="palette-input"
              value={palette.query}
              onChange={(e) => {
                palette.setQuery(e.target.value);
                palette.setActiveIndex(0);
              }}
              onKeyDown={(e) => palette.onInputKeyDown(e, runPaletteItem)}
              placeholder="Type a command…"
            />

            <ul className="palette-list">
              {palette.filteredItems.map((item, idx) => (
                <li
                  key={item.id}
                  className={`palette-item ${idx === palette.activeIndex ? "active" : ""}`}
                  onMouseEnter={() => palette.setActiveIndex(idx)}
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
              {palette.filteredItems.length === 0 && <li className="palette-empty">No matches</li>}
            </ul>
          </div>
        </div>
      )}

      <MobileCommandSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        commands={MOBILE_COMMANDS}
        onSelect={(cmdId) => {
          handleCommand(cmdId);
          setSheetOpen(false);
        }}
      />
    </div>
  );
};