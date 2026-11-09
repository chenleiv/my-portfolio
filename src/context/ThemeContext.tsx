"use client";

import { createContext, use, useEffect, useState, useMemo, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
    mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
};

const subscribeToNothing = () => () => {};

// False on the server and during hydration, true right after hydration.
const useHasMounted = () =>
    useSyncExternalStore(subscribeToNothing, () => true, () => false);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const mounted = useHasMounted();
    const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("data-theme", theme);
            window.localStorage.setItem("theme", theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const value = useMemo(
        () => ({ theme, toggleTheme, mounted }),
        [theme, mounted]
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
