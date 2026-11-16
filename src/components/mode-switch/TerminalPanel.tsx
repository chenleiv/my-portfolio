"use client";

import { InteractiveConsole } from "../about-console/InteractiveConsole";
import SkillsMatcher from "../skills/SkillsMatcher";

interface TerminalPanelProps {
  autoFocus: boolean;
}

// Everything Terminal mode needs, in one chunk that ModeArea loads on demand.
// SkillsMatcher renders nothing until the recruiterMode() command opens it.
export default function TerminalPanel({ autoFocus }: TerminalPanelProps) {
  return (
    <div className="terminal-panel">
      <SkillsMatcher />
      <div className="console-wrapper">
        <InteractiveConsole autoFocus={autoFocus} />
      </div>
    </div>
  );
}
