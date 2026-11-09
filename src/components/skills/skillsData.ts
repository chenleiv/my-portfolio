export interface SkillGroup {
  id: "technical" | "other";
  title: string;
  subtitle?: string;
  icon: string;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "technical",
    title: "Technical",
    icon: "⚡",
    skills: [
      "TypeScript",
      "React",
      "Angular",
      "JavaScript",
      "SCSS",
      "REST API",
      "Git",
      "Jira",
      "Node.js",
      "Next.js",
      "Nx",
      "Application Security",
      "OWASP Top 10",
      "Burp Suite",
      "Linux",
      "RAG/LLM apps",
      "Claude Code",
    ],
  },
  {
    id: "other",
    title: "Soft Skills",
    icon: "🧠",
    skills: [
      "Curiosity",
      "Quick learning",
      "Detail-oriented",
      "Ownership",
      "Problem solving",
      "Team player",
      "Time management",
    ],
  },
];
