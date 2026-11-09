import type { Metadata } from 'next';
import { AppProviders } from "../components/providers/AppProviders";
import "./globals.scss";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
