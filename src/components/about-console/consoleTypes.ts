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
  { id: "h1", type: "heroName", text: "CHEN LEIV" },
  { id: "h2", type: "heroTitle", text: "Frontend Engineer" },
  { id: "h3", type: "openToWork", text: "Full-Stack · Security · AI Apps" },

  {
    id: "d1",
    type: "desc",
    text: "4 years of experience building scalable, high-performance web applications using modern frontend frameworks, now also building full-stack applications with built-in security and AI features. Focus on intuitive user experiences, problem-solving skills, attention to detail, and a drive for learning and growth.",
  },
  {
    id: "o1",
    type: "openToWork",
    text: "Open to Frontend / Full-stack roles with a security focus, or Junior AppSec",
  },
  {
    id: "s1",
    type: "recruiterMode",
    text: "React • Angular • TypeScript • SCSS • Node.js",
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
