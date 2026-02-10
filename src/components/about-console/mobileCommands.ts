export type CommandItem = {
  id: string;
  label: string;
  hint: string;
  group: "Actions" | "Links";
  keywords: string[];
};

export const MOBILE_COMMANDS: readonly CommandItem[] = [
  {
    id: "showProjects",
    label: "Show Projects",
    hint: "Open projects section",
    group: "Actions",
    keywords: ["projects"],
  },
  {
    id: "portfolioCode",
    label: "Portfolio Code",
    hint: "GitHub repo",
    group: "Links",
    keywords: ["github"],
  },
  {
    id: "cv",
    label: "Download CV",
    hint: "PDF file",
    group: "Actions",
    keywords: ["resume"],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    hint: "Open profile",
    group: "Links",
    keywords: ["profile"],
  },
  {
    id: "recruiterMode",
    label: "Recruiter mode",
    hint: "Open recruiter mode",
    group: "Actions",
    keywords: ["recruiter", "mode"],
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Email options",
    group: "Links",
    keywords: ["email"],
  },
  {
    id: "clear",
    label: "Clear",
    hint: "Clear console",
    group: "Actions",
    keywords: ["reset"],
  },
];
