"use client";
import { useCallback, useRef, type ReactNode } from "react";
import { FocusContext } from "./FocusContext";

type Props = {
  children: ReactNode;
};

export const FocusProvider = ({ children }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setConsoleInputRef = useCallback((ref: HTMLInputElement | null) => {
    inputRef.current = ref;
  }, []);

  const focusConsoleInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <FocusContext.Provider value={{ setConsoleInputRef, focusConsoleInput }}>
      {children}
    </FocusContext.Provider>
  );
};
