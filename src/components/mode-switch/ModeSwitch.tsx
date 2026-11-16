import Link from "next/link";

export type Mode = "play" | "terminal";

const MODES: readonly { id: Mode; label: string; href: string }[] = [
  { id: "play", label: "Play", href: "/" },
  { id: "terminal", label: "Terminal", href: "/console" },
];

interface ModeSwitchProps {
  active: Mode;
  // Shows the line that explains the two modes (home page only).
  hint?: boolean;
}

// Segmented Play | Terminal switch. It navigates between pages, so the inactive
// mode is a real link and the active one is plain text marked aria-current.
export default function ModeSwitch({ active, hint = false }: ModeSwitchProps) {
  return (
    <div className="mode-switch">
      <nav aria-label="Mode">
        <ul className="mode-switch__list">
          {MODES.map((m) => (
            <li key={m.id}>
              {m.id === active ? (
                <span className="mode-switch__item" aria-current="page">
                  {m.label}
                </span>
              ) : (
                <Link className="mode-switch__item" href={m.href}>
                  {m.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {hint && (
        <>
          {/* CSS shows exactly one of these lines, so only one is read. */}
          <p className="mode-switch__hint mode-switch__hint--wide">
            Play walks around my room. Terminal opens a console: type commands like <code>contact()</code> or{" "}
            <code>cv()</code>.
          </p>
          <p className="mode-switch__hint mode-switch__hint--touch">
            Terminal: type commands like <code>contact()</code> or <code>cv()</code>.
          </p>
        </>
      )}
    </div>
  );
}
