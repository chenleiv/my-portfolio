"use client";

import { useTheme, type Theme } from "../../context/ThemeContext";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {OPTIONS.map((option) => {
        // The server cannot know the theme, so nothing is pressed until hydration.
        const pressed = mounted && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className="theme-toggle__option"
            aria-pressed={pressed}
            onClick={() => setTheme(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
