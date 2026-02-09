import { normalizeCommand, toDisplayCommand } from "../consoleCommands";
import type { ConsoleLine } from "../consoleTypes";
import { uid } from "../../../utils/uid";

type Deps = {
  isMobile: boolean;
  initialLines: ConsoleLine[];

  pushHistory: (lines: ConsoleLine[], rawCmd: string) => void;
  setHistory: React.Dispatch<React.SetStateAction<ConsoleLine[]>>;
  setInput: (v: string) => void;
  resetAutocomplete: () => void;

  setCommandHistoryRaw: (rawCmd: string) => void;

  scrollToSection: (id: string) => void;
  highlightSection: (id: string) => void;
  scrollToConsoleTop: () => void;
};

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
        const url = "https://github.com/chenleiv/my-portfolio";
        deps.pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "link",
              text: "💻 Open portfolio source code",
              download: "github.com/chenleiv/my-portfolio",
              href: url,
            },
          ],
          raw,
        );
        break;
      }

      case "cv": {
        const pdfUrl = "/assets/files/ChenLeiv-CV.pdf";
        deps.pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "download",
              text: "📄 Click to download CV",
              href: pdfUrl,
              download: "ChenLeiv-CV.pdf",
            },
          ],
          raw,
        );
        break;
      }

      case "linkedin": {
        const url = "https://www.linkedin.com/in/chen-leiv-9533a1178/";
        deps.pushHistory(
          [
            { ...echo },
            {
              id: uid(),
              type: "link",
              text: "Open LinkedIn profile",
              download: "linkedin/chen-leiv",
              href: url,
            },
          ],
          raw,
        );
        break;
      }

      case "showProjects": {
        deps.pushHistory(
          [
            { ...echo },
            { id: uid(), type: "system", text: "👉 Scrolling to #projects..." },
          ],
          raw,
        );
        deps.scrollToSection("projects");
        break;
      }

      case "contact": {
        if (deps.isMobile) {
          deps.pushHistory(
            [
              { ...echo },
              {
                id: uid(),
                type: "system",
                text: "📬 Scrolling to contact section...",
              },
            ],
            raw,
          );
          deps.scrollToSection("contact");
          deps.highlightSection("info");
        } else {
          deps.pushHistory(
            [
              { ...echo },
              {
                id: uid(),
                type: "system",
                text: "📬 Highlighting contact section...",
              },
            ],
            raw,
          );
          deps.highlightSection("info");
        }
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
