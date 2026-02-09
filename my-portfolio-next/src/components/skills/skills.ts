export interface SkillGroup {
  id: "technical" | "other";
  title: string;
  subtitle?: string;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "technical",
    title: "Technical skills",
    skills: [
      "TypeScript",
      "React",
      "Angular",
      "JavaScript",
      "SCSS",
      "HTML",
      "REST API",
      "Git",
      "Jira",
      "Node.js",
      "Nx",
    ],
  },
  {
    id: "other",
    title: "Other skills",
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
