import { useCallback, useRef } from "react";
import { FocusContext } from "./FocusContext";
import type { FocusContextValue } from "./focus.types";

type Props = {
    children: React.ReactNode;
};

export const FocusProvider: React.FC<Props> = ({ children }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setConsoleInputRef = useCallback<FocusContextValue["setConsoleInputRef"]>(
        (ref) => {
            inputRef.current = ref;
        },
        []
    );

    const focusConsoleInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <FocusContext.Provider value={{ setConsoleInputRef, focusConsoleInput }}>
            {children}
        </FocusContext.Provider>
    );
};