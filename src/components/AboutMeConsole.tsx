import React, { useState } from 'react';

const COMMANDS = [
  'help();',
  'about();',
  'showProjects();',
  'contact();',
  'clear();',
];

const ABOUT_TEXT = `

const aboutMe = 
"Passionate Frontend Developer, with 3 years of hands-on experience in modern web technologies. A fast learner, creative problem solver and a strong team player. Always eager to learn, create, and innovate."

//Please type the command you want to use
Available commands:\nhelp();, about();, showProjects();, contact();, clear();     
`;

export const InteractiveConsole = () => {
  const initialLines = [ABOUT_TEXT];
  const [history, setHistory] = useState<string[]>([...initialLines]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleCommand = (cmd: string) => {
    let output = '';
    const cleaned = cmd.trim();

    switch (cleaned) {
      case 'help();':
        output = `Available commands:\n - about();\n - showProjects();\n - contact();\n`;
        break;
      case 'about();':
        output = ABOUT_TEXT;
        break;
      case 'showProjects();':
        output = '👉 Scrolling to #projects...';
        scrollToSection('projects');
        break;
        case 'contact();':
          output = '📬 Highlighting contact section...';
          highlightSection('contact');
          break;
        case 'clear();':
        setHistory([...initialLines]);
        return;
      default:
        output = `❌ Unknown command: '${cmd}' please add ; at the end of the command`;
    }

    setHistory((prev) => [...prev, `> ${cmd}`, output]);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
  };

  

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const highlightSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('highlight');
      setTimeout(() => el.classList.remove('highlight'), 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    handleCommand(input);
    setInput('');
    setSuggestions([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const matches = COMMANDS.filter((cmd) =>
      cmd.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(matches);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex]);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  const highlightLine = (line: string) => {
    if (line.startsWith('//')) {
      return `<span class="console-comment">${line}</span>`;
    }
    if (line.startsWith('>')) {
      return `<span class="console-input-line">${line}</span>`;
    }
    return line
      .replace(/"(.*?)"/g, '<span class="console-string">"$1"</span>')
      .replace(/`([^`]*)`/g, '<span class="console-string">`$1`</span>')
      .replace(/\b(const|let|var|return)\b/g, '<span class="console-keyword">$1</span>')
      .replace(/\b()\(/g, '<span class="console-method">$1</span>(');
  };

  return (
    <div className="interactive-console">
      <div className="console-header">dev@portfolio:~$ interactive mode</div>

      <div className="console-history">
        {history.map((line, idx) => (
          <div
            key={idx}
            className="console-line"
            dangerouslySetInnerHTML={{ __html: highlightLine(line) }}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="console-input-line">
        <span className="prompt"></span>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
          className="console-input"
          placeholder="Type a command..."
        />
      </form>

      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((sug, i) => (
            <li key={i} className="autocomplete-item" onClick={() => handleSuggestionClick(sug)}>
              {sug}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};