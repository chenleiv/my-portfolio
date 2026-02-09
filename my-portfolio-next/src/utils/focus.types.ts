export type FocusContextValue = {
  setConsoleInputRef: (ref: HTMLInputElement | null) => void;
  focusConsoleInput: () => void;
};

export const FocusContextDefault: FocusContextValue = {
  setConsoleInputRef: () => {},
  focusConsoleInput: () => {},
};
