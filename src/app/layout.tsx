import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AppProviders } from "../components/providers/AppProviders";
import "./globals.scss";
import { SITE_TITLE } from "../content/titles";

// Self-hosted from Fontsource (latin subset), OFL 1.1; see src/fonts/*/OFL.txt.
// Only weight 800 of the display font is used (h1 to h3).
const displayFont = localFont({
  src: [{ path: '../fonts/bricolage-grotesque/bricolage-grotesque-latin-800-normal.woff2', weight: '800', style: 'normal' }],
  display: 'swap',
  preload: true,
  variable: '--font-display',
  fallback: ['Arial Black', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

// Variable weight axis covering 400 to 700; the site uses 400, 500 and 600.
const bodyFont = localFont({
  src: [{ path: '../fonts/instrument-sans/instrument-sans-latin-wght-normal.woff2', weight: '400 700', style: 'normal' }],
  display: 'swap',
  preload: true,
  variable: '--font-body',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

// Pixel font for the Play | Terminal switch and the room's How to play panel,
// OFL 1.1; see src/fonts/pixelify-sans/OFL.txt. The switch is above the fold
// on every page, so both files (about 8 KB each) are preloaded everywhere.
const pixelFont = localFont({
  src: [
    { path: '../fonts/pixelify-sans/pixelify-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/pixelify-sans/pixelify-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-pixel',
  fallback: ['ui-monospace', 'monospace'],
});

// Shared by the meta, Open Graph and Twitter descriptions, so link previews match.
const SITE_DESCRIPTION =
  "Frontend Engineer with 4+ years building enterprise web apps with Angular, React and TypeScript. Frontend architecture, performance and a security-first mindset.";

const DEFAULT_SITE_URL = 'https://chenleiv.vercel.app';

// An invalid or local override must never end up in social preview URLs.
function resolveSiteUrl(): URL {
  const fallback = new URL(DEFAULT_SITE_URL);
  const override = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!override) return fallback;

  try {
    const url = new URL(override);
    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname);
    return isLocal ? fallback : url;
  } catch {
    return fallback;
  }
}

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'Chen Leiv | Frontend Engineer',
    description: SITE_DESCRIPTION,
    siteName: 'Chen Leiv Portfolio',
    images: [{ url: '/assets/og/og-image.png', width: 1200, height: 630, alt: 'Chen Leiv — Frontend Engineer' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chen Leiv | Frontend Engineer',
    description: SITE_DESCRIPTION,
    images: ['/assets/og/og-image.png'],
  },
};

// Runs before first paint so the page never flashes the wrong theme.
// Order: saved choice, then system preference, then light.
const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.setAttribute("data-theme",t)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${pixelFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
