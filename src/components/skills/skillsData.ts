export interface SkillGroup {
  id: "frontend" | "backend" | "security" | "other";
  title: string;
  subtitle?: string;
  icon: string;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    icon: "⚡",
    skills: [
      "TypeScript",
      "JavaScript",
      "React",
      "Angular",
      "Next.js",
      "SCSS",
      "Nx",
    ],
  },
  {
    id: "backend",
    title: "Backend, AI & Tools",
    icon: "🤖",
    skills: [
      "Node.js",
      "MongoDB",
      "REST API",
      "RAG/LLM apps",
      "Claude Code",
      "Git",
      "Jira",
    ],
  },
  {
    id: "security",
    title: "Security",
    icon: "🔒",
    skills: [
      "Application Security",
      "OWASP Top 10",
      "Burp Suite",
      "Linux",
    ],
  },
  {
    id: "other",
    title: "Soft Skills",
    icon: "🧠",
    skills: [
      "Ownership",
      "Problem solving",
      "Quick learning",
      "Detail-oriented",
      "Team player",
    ],
  },
];
