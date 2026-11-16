import { normalizeCommand, toDisplayCommand } from "../consoleCommands";
import type { ConsoleLine } from "../consoleTypes";
import { uid } from "../../../utils/uid";
import { contact } from "../../../content/contact";
import { PROJECTS } from "../../projects/projectData";

type Deps = {
  initialLines: ConsoleLine[];

  pushHistory: (lines: ConsoleLine[], rawCmd: string) => void;
  setHistory: React.Dispatch<React.SetStateAction<ConsoleLine[]>>;
  setInput: (v: string) => void;
  resetAutocomplete: () => void;

  setCommandHistoryRaw: (rawCmd: string) => void;

  scrollToConsoleTop: () => void;

  // Back to the room on the same page.
  goHome: () => void;
};

// "https://example.com/path/" -> "example.com/path"
const toDisplayUrl = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const projectLines = (): ConsoleLine[] => {
  const lines: ConsoleLine[] = [
    { id: uid(), type: "system", text: `📂 Projects (${PROJECTS.length})` },
  ];

  PROJECTS.forEach((project, index) => {
    lines.push(
      { id: uid(), type: "commandsTitle", text: `${index + 1}. ${project.header}` },
      { id: uid(), type: "desc", text: project.summary },
    );

    if (project.web && !project.hideWeb) {
      lines.push({
        id: uid(),
        type: "link",
        text: "🌐 Live demo",
        href: project.web,
        label: toDisplayUrl(project.web),
      });
    }

    if (!project.hideGithub) {
      lines.push({
        id: uid(),
        type: "link",
        text: "💻 GitHub",
        href: project.github,
        label: toDisplayUrl(project.github),
      });
    }
  });

  return lines;
};

const contactLines = (): ConsoleLine[] => [
  { id: uid(), type: "system", text: "📬 Contact" },
  {
    id: uid(),
    type: "link",
    text: "✉️ Email",
    href: `mailto:${contact.email}`,
    label: contact.email,
  },
  {
    id: uid(),
    type: "link",
    text: "📱 Phone",
    href: `tel:${contact.phone}`,
    label: contact.phone,
  },
  {
    id: uid(),
    type: "link",
    text: "🔗 LinkedIn",
    href: contact.linkedin,
    label: "linkedin/chen-leiv",
  },
  {
    id: uid(),
    type: "link",
    text: "💻 GitHub",
    href: contact.github,
    label: toDisplayUrl(contact.github),
  },
  {
    id: uid(),
    type: "download",
    text: "📄 CV",
    href: contact.cvPath,
    download: contact.cvFileName,
  },
];

export function createCommandRunner(deps: Deps) {
  return function handleCommand(raw: string) {
    const canonical = normalizeCommand(raw);

    if (!canonical) {
      deps.pushHistory(
        [
          { id: uid(), type: "input", text: `> ${raw}` },
          {
            id: uid(),
            type: "error",
            text: `❌ Unknown command: '${raw}'. Try: showProjects / contact / recruiterMode / clear`,
          },
        ],
        raw,
      );
      deps.setCommandHistoryRaw(raw);
      return;
    }

    const echo: ConsoleLine = {
      id: uid(),
      type: "input",
      text: `> ${toDisplayCommand(canonical)}`,
    };

    switch (canonical) {
      case "portfolioCode": {
        deps.pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "link",
              text: "💻 Open portfolio source code",
              label: toDisplayUrl(contact.portfolioRepo),
              href: contact.portfolioRepo,
            },
          ],
          raw,
        );
        break;
      }

      case "cv": {
        deps.pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "download",
              text: "📄 Click to download CV",
              href: contact.cvPath,
              download: contact.cvFileName,
            },
          ],
          raw,
        );
        break;
      }

      case "linkedin": {
        deps.pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "link",
              text: "Open LinkedIn profile",
              label: "linkedin/chen-leiv",
              href: contact.linkedin,
            },
          ],
          raw,
        );
        break;
      }

      case "showProjects": {
        deps.pushHistory([{ ...echo }, ...projectLines()], raw);
        break;
      }

      case "contact": {
        deps.pushHistory([{ ...echo }, ...contactLines()], raw);
        break;
      }

      case "recruiterMode": {
        deps.pushHistory(
          [
            { ...echo },
            { id: uid(), type: "system", text: "🧩 Recruiter mode opened." },
          ],
          raw,
        );
        window.openSkillMatcher?.();
        break;
      }

      case "home": {
        deps.pushHistory(
          [
            { ...echo },
            { id: uid(), type: "system", text: "↩ Back to the room…" },
          ],
          raw,
        );
        deps.goHome();
        break;
      }

      case "clear": {
        deps.setHistory(deps.initialLines);
        deps.resetAutocomplete();
        deps.setInput("");
        deps.scrollToConsoleTop();
        break;
      }
    }

    deps.setCommandHistoryRaw(raw);
  };
}
