"use client";

import { useCallback, useMemo, useState } from "react";
import { PALETTE_ITEMS } from "../components/about-console/consoleCommands";
import { toDisplayCommand } from "../components/about-console/consoleCommands";

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const getAt = (arr: readonly string[], index: number): string | undefined =>
  index >= 0 && index < arr.length ? arr[index] : undefined;

export function useConsoleAutocomplete() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<readonly string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  const resetAutocomplete = useCallback(() => {
    setSuggestions([]);
    setSuggestionIndex(-1);
  }, []);

  const updateFromInput = useCallback((value: string) => {
    setInput(value);

    const v = value.trim().toLowerCase();
    if (!v) {
      setSuggestions([]);
      setSuggestionIndex(-1);
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
  }, []);

  const cycle = useCallback(
    (direction: 1 | -1) => {
      setSuggestionIndex((prev) => {
        if (suggestions.length === 0) return -1;
        const start = prev < 0 ? 0 : prev;
        const next = start + direction;
        return clamp(next, 0, suggestions.length - 1);
      });
    },
    [suggestions.length],
  );

  const commitAt = useCallback(
    (index: number): string | undefined => {
      const cmd = getAt(suggestions, index);
      if (!cmd) return undefined;
      setInput(cmd);
      resetAutocomplete();
      return cmd;
    },
    [suggestions, resetAutocomplete],
  );

  const commitActive = useCallback((): string | undefined => {
    const idx = suggestionIndex < 0 ? 0 : suggestionIndex;
    return commitAt(idx);
  }, [commitAt, suggestionIndex]);

  const api = useMemo(
    () => ({
      input,
      setInput,
      suggestions,
      suggestionIndex,
      setSuggestionIndex,
      resetAutocomplete,
      updateFromInput,
      cycle,
      commitAt,
      commitActive,
    }),
    [
      input,
      suggestions,
      suggestionIndex,
      resetAutocomplete,
      updateFromInput,
      cycle,
      commitAt,
      commitActive,
    ],
  );

  return api;
}
