
import { lazy, Suspense } from 'react';
import ThemeToggle from '../components/theme-toggle/ThemeToggle';
import Hero from '../components/hero/Hero';
const Projects = lazy(() => import('../components/projects/Projects'));
const Footer = lazy(() => import('../components/footer/Footer'));

export default function Page() {
  return (
    <div className="app">
      <header className="app__topbar">
        <ThemeToggle />
      </header>
      <main className="app__main">
        <section id="about" className="app__section">
          <Hero />
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
