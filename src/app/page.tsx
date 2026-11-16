
import { lazy, Suspense } from 'react';
import ThemeToggle from '../components/theme-toggle/ThemeToggle';
import Hero from '../components/hero/Hero';
import Room from '../components/room/Room';
import ModeSwitch from '../components/mode-switch/ModeSwitch';
const Projects = lazy(() => import('../components/projects/Projects'));
const Footer = lazy(() => import('../components/footer/Footer'));

export default function Page() {
  return (
    <div className="app" id="top">
      <header className="app__topbar">
        <a className="app__logo" href="#top">Chen Leiv</a>
        <div className="app__topbar-actions">
          <a className="app__skip" href="#projects">Skip to projects</a>
          <ThemeToggle />
        </div>
      </header>
      <main className="app__main">
        <section id="about" className="app__section app__section--intro">
          <Hero />
          <ModeSwitch active="play" hint />
          <Room />
        </section>

        <section id="projects" className="app__section">
          <Suspense fallback={null}>
            <Projects />
          </Suspense>
        </section>
      </main>
      <div className="app__footer-text">
        <p>
          &copy; {new Date().getFullYear()} Chen Leiv. Built with React, TypeScript, and Next.js.
        </p>
      </div>
      <footer className="app__footer">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </footer>
    </div>
  );
}
