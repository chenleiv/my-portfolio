import { useCallback, useState } from "react";

export function useConsoleHistory<TLine extends { id: string }>(
  initialLines: readonly TLine[],
) {
  const [history, setHistory] = useState<TLine[]>([...initialLines]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback((lines: TLine[], rawCmd: string) => {
    setHistory((prev) => [...prev, ...lines]);
    setCommandHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);
  }, []);

  const clearHistory = useCallback(
    (lines: readonly TLine[], rawCmd: string) => {
      setHistory([...lines]);
      setCommandHistory((prev) => [...prev, rawCmd]);
      setHistoryIndex(-1);
    },
    [],
  );

  return {
    history,
    setHistory,

    commandHistory,
    historyIndex,
    setHistoryIndex,

    pushHistory,
    clearHistory,
  };
}
