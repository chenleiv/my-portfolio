import dynamic from "next/dynamic";
import Hero from "../hero/Hero";
import ModeArea from "../mode-switch/ModeArea";
import Footer from "../footer/Footer";
import ThemeToggle from "../theme-toggle/ThemeToggle";
// Its own client chunk; still rendered on the server, so the HTML is unchanged.
const Projects = dynamic(() => import("../projects/Projects"));

// The one page behind both "/" (Play) and "/console" (Terminal). ModeArea reads
// the URL and shows the room or the terminal under the hero.
export default function HomePage() {
  return (
    <div className="app" id="top">
      <header className="app__topbar">
        {/* First focusable element; hidden until it gets keyboard focus. */}
        <a className="app__skip" href="#projects">Skip to projects</a>
        <ThemeToggle />
      </header>
      <main className="app__main">
        <section id="about" className="app__section app__section--intro">
          <Hero />
          <ModeArea />
        </section>

        <section id="projects" className="app__section">
          <Projects />
        </section>
      </main>
      <div className="app__footer-text">
        <p>
          &copy; {new Date().getFullYear()} Chen Leiv. Built with React, TypeScript and Next.js, with help from Claude Code.
        </p>
      </div>
      <footer className="app__footer">
        <Footer />
      </footer>
    </div>
  );
}
