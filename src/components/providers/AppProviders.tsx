"use client";

import { ThemeProvider } from "../../context/ThemeContext";
import { FocusContext } from "../../context/FocusContext";
import { FocusContextDefault } from "../../utils/focus.types";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <FocusContext.Provider value={FocusContextDefault}>
                {children}
            </FocusContext.Provider>
        </ThemeProvider>
    );
}
