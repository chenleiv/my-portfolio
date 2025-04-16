import { createContext, useContext, useRef } from 'react';

type FocusContextType = {
  setConsoleInputRef: (ref: HTMLInputElement | null) => void;
  focusConsoleInput: () => void;
};

const defaultContext: FocusContextType = {
  setConsoleInputRef: () => {},
  focusConsoleInput: () => {},
};

export const FocusContext = createContext<FocusContextType>(defaultContext);

export const useFocus = () => useContext(FocusContext);

export const FocusProvider = ({ children }: { children: React.ReactNode }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setConsoleInputRef = (ref: HTMLInputElement | null) => {
    inputRef.current = ref;
  };

  const focusConsoleInput = () => {
    inputRef.current?.focus();
  };

  return (
    <FocusContext.Provider value={{ setConsoleInputRef, focusConsoleInput }}>
      {children}
    </FocusContext.Provider>
  );
};