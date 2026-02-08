import { memo } from "react";
import type { ConsoleLine } from "./consoleTypes";

const linkify = (text: string): React.ReactNode => {
    const urlRegex = /(https?:\/\/[^\s)]+|www\.[^\s)]+)/g;

    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(urlRegex)) {
        const index = match.index ?? 0;
        const rawUrl = match[0];

        if (index > lastIndex) nodes.push(text.slice(lastIndex, index));

        const href = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

        nodes.push(
            <a
                key={`${index}-url`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="console-link"
            >
                {rawUrl}
            </a>
        );

        lastIndex = index + rawUrl.length;
    }

    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
};

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

const hasUrl = (text: string): boolean => {
    const urlRegex = /(https?:\/\/[^\s)]+|www\.[^\s)]+)/g;
    return urlRegex.test(text);
};

export const ConsoleLineView = memo(function ConsoleLineView({ line }: { line: ConsoleLine }) {
    switch (line.type) {
        case "heroName":
            return <div className="console-name">{line.text}</div>;
        case "heroTitle":
            return <div className="console-title">{line.text}</div>;
        case "desc":
            return <div className="console-desc">{line.text}</div>;
        case "recruiterMode":
            return <div className="console-skills">{line.text}</div>;
        case "commandsTitle":
            return <div className="console-commands-title">{line.text}</div>;
        case "cmd":
            return <div className="console-cmd">{line.text}</div>;
        case "input":
            return <div className="console-input-lineText">{line.text}</div>;
        case "error":
            return <div className="console-error">{line.text}</div>;
        case "link":
            return (
                <div className="console-system">
                    <span className="console-text">{line.text}:</span>
                    <a
                        className="console-link"
                        href={line.href}
                        download={line.download}
                        aria-label={line.text}
                    >
                        {line.download}
                    </a>
                </div>
            );
        default:
            return (
                <div className="console-system">
                    {hasUrl(line.text) ? linkify(line.text) : highlightTokens(line.text)}
                </div>
            );
    }
});