export type ConsoleLineType =
  | "heroName"
  | "heroTitle"
  | "desc"
  | "skills"
  | "commandsTitle"
  | "cmd"
  | "input"
  | "error"
  | "system";

export type ConsoleLine = {
  id: string;
  type: ConsoleLineType;
  text: string;
};

export const ABOUT_LINES: ConsoleLine[] = [
  { id: "h1", type: "heroName", text: "CHEN LEIV" },
  { id: "h2", type: "heroTitle", text: "Frontend Developer" },

  {
    id: "d1",
    type: "desc",
    text: "Turns complex requirements into elegant frontend systems, focused on intuitive and scalable interfaces, bringing adaptability, ownership, and a strong teamwork mindset.",
  },
  {
    id: "s1",
    type: "skills",
    text: "React • Angular • TypeScript • SCSS • Node.js",
  },

  { id: "c0", type: "commandsTitle", text: "# Available commands:" },
  { id: "c1", type: "cmd", text: "showProjects()" },
  { id: "c2", type: "cmd", text: "contact()" },
  { id: "c3", type: "cmd", text: "recruiterMode()" },
  { id: "c4", type: "cmd", text: "clear()" },
];
