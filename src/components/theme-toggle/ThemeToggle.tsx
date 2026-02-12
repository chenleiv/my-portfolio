"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";

  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  return "dark";
};

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      window.localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      className="theme-toggle"
      data-theme={mounted ? theme : undefined}
      onClick={toggleTheme}
      type="button"
    >
      <span className="theme-toggle__thumb">
        {mounted ? (theme === "dark" ? <FaMoon /> : <FaSun />) : null}
      </span>
    </button>
  );
}