"use client";

import { ThemeProvider } from "../../context/ThemeContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}
