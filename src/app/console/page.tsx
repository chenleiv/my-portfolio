import type { Metadata } from 'next';
import HomePage from '../../components/home/HomePage';
import { CONSOLE_TITLE } from '../../content/titles';

export const metadata: Metadata = {
  title: CONSOLE_TITLE,
};

// Direct link to Terminal mode: the same page as "/", with the terminal under the hero.
export default function ConsolePage() {
  return <HomePage />;
}
