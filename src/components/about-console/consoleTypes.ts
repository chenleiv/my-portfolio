export type ConsoleLineType =
  | "heroName"
  | "heroTitle"
  | "desc"
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
  { id: "h2", type: "heroTitle", text: "Frontend Developer" },

  {
    id: "d1",
    type: "desc",
    text: "4 years of experience building scalable, high-performance web applications using modern frontend frameworks. Focus on intuitive user experiences, problem-solving skills, attention to detail, and a drive for learning and growth.",
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
    text: "showProjects() | portfolioCode() | recruiterMode() | cv() | linkedin() | contact() | clear()",
  },
];
