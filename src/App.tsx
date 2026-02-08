
import { lazy, Suspense } from 'react';
import Projects from './components/Projects';
import Footer from './components/Footer';
import About from './components/About';
import { ThemeToggle } from './components/ThemeToggle';
const SkillsMatcher = lazy(() => import("./components/SkillsMatcher"));
const LazyLoader = lazy(() => import("./components/loader/LazyLoader"));

function App() {
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
          <Projects />
        </section>
      </main>

      <footer className="app__footer">
        <Footer />
      </footer>
    </div>
  );
}

export default App;