"use client";

import { createContext, use, useCallback, useEffect, useState, useMemo, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

// The inline script in app/layout.tsx sets data-theme before first paint
// (the saved choice, otherwise light). Read it back here.
const getInitialTheme = (): Theme => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
};

const saveTheme = (theme: Theme) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Storage can be blocked; the theme still applies for this visit.
    }
};

const subscribeToNothing = () => () => {};

// False on the server and during hydration, true right after hydration.
const useHasMounted = () =>
    useSyncExternalStore(subscribeToNothing, () => true, () => false);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const mounted = useHasMounted();
    const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [theme, mounted]);

    // Only an explicit choice is saved. Without one, the page starts in light
    // (see app/layout.tsx); the system preference is not used.
    const setTheme = useCallback((next: Theme) => {
        setThemeState(next);
        saveTheme(next);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            saveTheme(next);
            return next;
        });
    }, []);

    const value = useMemo(
        () => ({ theme, setTheme, toggleTheme, mounted }),
        [theme, setTheme, toggleTheme, mounted]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = use(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
