import { useCallback, useMemo, useState } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getAt = (arr: readonly string[], index: number): string | undefined =>
  index >= 0 && index < arr.length ? arr[index] : undefined;

type PaletteItem = {
  id: string;
  keywords: readonly string[];
};

type ToDisplayCommand = (id: string) => string;

export function useAutocomplete(params: {
  items: readonly PaletteItem[];
  toDisplayCommand: ToDisplayCommand;
  disabled?: boolean;
}) {
  const { items, toDisplayCommand, disabled } = params;

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<readonly string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  const resetAutocomplete = useCallback(() => {
    setSuggestions([]);
    setSuggestionIndex(-1);
  }, []);

  const computeSuggestions = useCallback(
    (value: string) => {
      const v = value.trim().toLowerCase();
      if (!v) return [];

      return items
        .map((item) => {
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
    },
    [items, toDisplayCommand],
  );

  const onChange = useCallback(
    (value: string) => {
      setInput(value);

      if (disabled) return;

      const next = computeSuggestions(value);
      setSuggestions(next);
      setSuggestionIndex(next.length ? 0 : -1);
    },
    [computeSuggestions, disabled],
  );

  const cycleSuggestionIndex = useCallback(
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

  const commitSuggestion = useCallback(() => {
    if (suggestions.length === 0) return undefined;
    const idx = suggestionIndex < 0 ? 0 : suggestionIndex;
    const cmd = getAt(suggestions, idx);
    if (!cmd) return undefined;

    setInput(cmd);
    resetAutocomplete();
    return cmd;
  }, [resetAutocomplete, suggestionIndex, suggestions]);

  return {
    input,
    setInput,
    suggestions,
    suggestionIndex,
    setSuggestionIndex,

    resetAutocomplete,
    onChange,
    cycleSuggestionIndex,
    commitSuggestion,
  };
}
