import { profile } from "../../content/profile";

export type ConsoleLineType =
  | "desc"
  | "hint"
  | "recruiterMode"
  | "commandsTitle"
  | "cmd"
  | "input"
  | "error"
  | "system"
  | "link"
  | "download";

export type ConsoleLine = {
  id: string;
  type: ConsoleLineType;
  text: string;
  href?: string;
  // Visible text of a "link" line.
  label?: string;
  // File name for a "download" line; also shown as its link text.
  download?: string;
};

// The console sits under the hero, so it starts at the stack line instead of
// repeating the name, title, tagline and intro.
export const ABOUT_LINES: ConsoleLine[] = [
  {
    id: "s1",
    type: "recruiterMode",
    text: profile.stack,
  },

  { id: "c0", type: "commandsTitle", text: "# Available commands:" },
  {
    id: "c1",
    type: "cmd",
    text: "showProjects() | recruiterMode() | portfolioCode() | cv() | linkedin() | contact() | clear() | home()",
  },
  {
    id: "hint1",
    type: "hint",
    text: "// 💡 Try recruiterMode() — find out if my skills are a match",
  },
];
