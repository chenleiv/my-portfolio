import { profile } from "../../content/profile";

export type ConsoleLineType =
  | "heroName"
  | "heroTitle"
  | "openToWork"
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
  download?: string;
};

export const ABOUT_LINES: ConsoleLine[] = [
  { id: "h1", type: "heroName", text: profile.name },
  { id: "h2", type: "heroTitle", text: profile.title },
  { id: "h3", type: "openToWork", text: profile.tagline },

  {
    id: "d1",
    type: "desc",
    text: profile.intro,
  },
  {
    id: "s1",
    type: "recruiterMode",
    text: profile.stack,
  },

  { id: "c0", type: "commandsTitle", text: "# Available commands:" },
  {
    id: "c1",
    type: "cmd",
    text: "showProjects() | portfolioCode() | cv() | linkedin() | contact() | clear()",
  },
  {
    id: "hint1",
    type: "hint",
    text: "// 💡 Try recruiterMode() — find out if my skills are a match",
  },
];
