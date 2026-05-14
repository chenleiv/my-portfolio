
import { lazy, Suspense } from 'react';
import About from '../components/about-console/About';
import ThemeToggle from '../components/theme-toggle/ThemeToggle';
const Projects = lazy(() => import('../components/projects/Projects'));
const Footer = lazy(() => import('../components/footer/Footer'));
const SkillsMatcher = lazy(() => import("../components/skills/SkillsMatcher"));
const LazyLoader = lazy(() => import("../components/loader/LazyLoader"));

export default function Page() {
  return (
    <div className="app">
      <ThemeToggle />
      <main className="app__main">
        <section id="about" className="app__section">
          <Suspense fallback={<LazyLoader />}>
            <SkillsMatcher scrollTargetId="about" />
          </Suspense>
          <About />
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
