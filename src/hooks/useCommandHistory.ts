"use client";

import { useCallback, useState } from "react";

const getAt = (arr: readonly string[], index: number): string | undefined =>
  index >= 0 && index < arr.length ? arr[index] : undefined;

export function useCommandHistory() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushCommand = useCallback((rawCmd: string) => {
    setCommandHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);
  }, []);

  const moveUp = useCallback(() => {
    if (commandHistory.length === 0)
      return { nextInput: undefined as string | undefined };

    const newIndex =
      historyIndex < commandHistory.length - 1
        ? historyIndex + 1
        : historyIndex;

    const idx = commandHistory.length - 1 - newIndex;
    const cmd = getAt(commandHistory, idx);

    setHistoryIndex(newIndex);
    return { nextInput: cmd };
  }, [commandHistory, historyIndex]);

  const moveDown = useCallback(() => {
    if (historyIndex <= 0) {
      setHistoryIndex(-1);
      return { nextInput: "" };
    }

    const newIndex = historyIndex - 1;
    const idx = commandHistory.length - 1 - newIndex;
    const cmd = getAt(commandHistory, idx);

    setHistoryIndex(newIndex);
    return { nextInput: cmd ?? "" };
  }, [commandHistory, historyIndex]);

  const reset = useCallback(() => setHistoryIndex(-1), []);

  return {
    commandHistory,
    historyIndex,
    pushCommand,
    moveUp,
    moveDown,
    reset,
    setCommandHistory,
  };
}
