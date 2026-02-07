README.md

🧠 Interactive Developer Portfolio

A modern, animated developer portfolio built with React, TypeScript, Vite, and Framer Motion, featuring an interactive terminal-style console, smooth UX, accessibility considerations, and production-ready architecture.

🔗 Live: https://chenleiv.github.io/my-portfolio
💻 GitHub: https://github.com/chenleiv/my-portfolio

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

✨ Features

🎛 Interactive Console (Core Experience)
• Terminal-like command interface inside the About section
• Command history navigation (↑ ↓)
• Autocomplete suggestions with keyboard support
• Command palette (⌘K / Ctrl+K) similar to modern IDEs
• Smooth scrolling & section highlighting
• Mobile-aware behavior

Supported commands:
showProjects → scrolls to projects section
contact → highlights contact area or scrolls on mobile
skills → opens recruiter skill matcher
clear → resets console

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

🎬 Modern UI & Animations
• Framer Motion powered transitions
• Scroll-triggered animations (useInView)
• Glassmorphism design system
• Smooth auto-scroll console behavior
• Lazy-loaded assets for performance

📬 Contact Experience
• Social links (LinkedIn, GitHub, Phone)
• CV download handler
• Email dropdown with:
• Gmail / Outlook deep links
• Click-outside close behavior
• Scroll-safe positioning
• Accessible keyboard interaction

♿ Accessibility & UX
• Keyboard-navigable UI
• Focus trapping in command palette
• ARIA labels for interactive elements
• Mobile responsiveness
• Sticky scroll logic to prevent unwanted jumps

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

🏗 Tech Stack

Frontend
• React 18
• TypeScript
• Vite
• Framer Motion
• SCSS

Tooling & Quality
• ESLint (flat config)
• unused-imports auto cleanup
• Type checking script
• GitHub Pages deployment

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

📁 Project Structure (Simplified)

src/
components/
About/
About.tsx
InteractiveConsole.tsx
ConsoleLineView.tsx
consoleCommands.ts
consoleTypes.ts
assets/
styles/

Browser
│
▼
React App (Vite + TS)
│
├── Layout & Sections
│ ├── About
│ ├── Projects
│ ├── Skills
│ └── Contact
│
├── Interactive Console System
│ ├── Command Parser
│ ├── History Manager
│ ├── Autocomplete Engine
│ ├── Command Palette (⌘K)
│ └── Scroll/Highlight Controller
│
├── UI/Animation Layer
│ ├── Framer Motion
│ ├── Intersection Observer
│ └── Glass UI (SCSS)
│
└── Assets & Static Files
├── Images
├── CV PDF
└── Icons

Architecture goals:
• Clear separation of UI / logic / data
• Strong TypeScript safety
• Reusable console system

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

🚀 Getting Started

Install:
npm install

Run dev server:
npm run dev

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

🧩 Notable Engineering Decisions

Secure UID generation

Uses:
• crypto.randomUUID() when available
• crypto.getRandomValues() fallback
• timestamp fallback as last resort

Ensures:
• Stable React keys
• No external UUID dependency

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

Scroll-safe console behavior

Implements:
• Sticky auto-scroll only when user is near bottom
• Skip-scroll flag during navigation
• Prevents jarring UX jumps

Command Palette UX

Inspired by:
• VS Code
• Raycast
• Modern dev tools

Includes:
• Keyboard navigation
• Focus trapping
• Instant filtering

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

📊 Lighthouse Goals

Target:
• Performance ≥ 95
• Accessibility ≥ 95
• Best Practices ≥ 95
• SEO ≥ 95

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

👩‍💻 Author

Chen Leiv
Frontend Developer focused on:
• High-quality UX
• Clean architecture
• Interactive web experiences
• Performance & accessibility

LinkedIn: https://www.linkedin.com/in/chen-leiv-9533a1178/
