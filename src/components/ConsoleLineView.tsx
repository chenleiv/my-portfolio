import { memo } from "react";
import type { ConsoleLine } from "./consoleTypes";

const highlightTokens = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(".*?")|\b(const|let|var|return)\b/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text))) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

        if (match[1]) {
            parts.push(
                <span key={`${match.index}-str`} className="console-string">
                    {match[1]}
                </span>
            );
        } else if (match[2]) {
            parts.push(
                <span key={`${match.index}-kw`} className="console-keyword">
                    {match[2]}
                </span>
            );
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
};

export const ConsoleLineView = memo(function ConsoleLineView({ line }: { line: ConsoleLine }) {
    switch (line.type) {
        case "heroName":
            return <div className="console-name">{line.text}</div>;
        case "heroTitle":
            return <div className="console-title">{line.text}</div>;
        case "desc":
            return <div className="console-desc">{line.text}</div>;
        case "skills":
            return <div className="console-skills">{line.text}</div>;
        case "commandsTitle":
            return <div className="console-commands-title">{line.text}</div>;
        case "cmd":
            return <div className="console-cmd">{line.text}</div>;
        case "input":
            return <div className="console-input-lineText">{line.text}</div>;
        case "error":
            return <div className="console-error">{line.text}</div>;
        default:
            return <div className="console-system">{highlightTokens(line.text)}</div>;
    }
});