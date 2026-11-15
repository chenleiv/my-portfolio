import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import { AppProviders } from "../components/providers/AppProviders";
import "./globals.scss";

const displayFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '800'],
  display: 'swap',
  variable: '--font-display',
});

const bodyFont = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
});

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
  title: 'Chen Leiv | Frontend Engineer',
  description: 'Frontend Engineer with 4 years building scalable web applications with React, Angular, TypeScript & Node.js. Full-Stack · Security · AI Apps. Open to new opportunities.',
  openGraph: {
    title: 'Chen Leiv | Frontend Engineer',
    description: 'Frontend Engineer with 4 years building scalable web applications with React, Angular, TypeScript & Node.js. Full-Stack · Security · AI Apps.',
    siteName: 'Chen Leiv Portfolio',
    images: [{ url: '/assets/og/og-image.png', width: 1200, height: 630, alt: 'Chen Leiv — Frontend Engineer' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chen Leiv | Frontend Engineer',
    description: 'Frontend Engineer with 4 years building scalable web applications with React, Angular, TypeScript & Node.js. Full-Stack · Security · AI Apps.',
    images: ['/assets/og/og-image.png'],
  },
};

// Runs before first paint so the page never flashes the wrong theme.
// Order: saved choice, then system preference, then light.
const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.setAttribute("data-theme",t)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
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
