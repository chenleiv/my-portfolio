import type { Metadata } from 'next';
import { lazy, Suspense } from 'react';
import { InteractiveConsole } from '../../components/about-console/InteractiveConsole';
import ThemeToggle from '../../components/theme-toggle/ThemeToggle';
import ModeSwitch from '../../components/mode-switch/ModeSwitch';
const SkillsMatcher = lazy(() => import("../../components/skills/SkillsMatcher"));
const LazyLoader = lazy(() => import("../../components/loader/LazyLoader"));

export const metadata: Metadata = {
  title: 'Interactive Console | Chen Leiv',
};

export default function ConsolePage() {
  return (
    <div className="app">
      <header className="app__topbar">
        <ModeSwitch active="terminal" />
        <ThemeToggle />
      </header>
      <main className="app__main">
        <section className="app__section console-page">
          <Suspense fallback={<LazyLoader />}>
            <SkillsMatcher />
          </Suspense>
          <div className="console-wrapper">
            <InteractiveConsole />
          </div>
        </section>
      </main>
    </div>
  );
}
