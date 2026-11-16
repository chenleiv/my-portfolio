// Play | Terminal modes and their URLs. No runtime imports, so the Node test
// runner can load this file directly.

export type Mode = "play" | "terminal";

export const MODE_PATH: Readonly<Record<Mode, string>> = {
  play: "/",
  terminal: "/console",
};

// /console (with or without a trailing slash) is Terminal; every other path is Play.
export function modeFromPath(pathname: string | null | undefined): Mode {
  const path = (pathname ?? "/").replace(/\/+$/, "");
  return path === MODE_PATH.terminal ? "terminal" : "play";
}
