import type { Metadata } from 'next';
import { AppProviders } from "../components/providers/AppProviders";
import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Chen Leiv | Frontend Developer',
  description: 'Frontend Developer with 4+ years building scalable web applications with React, Angular, TypeScript & Node.js. Open to new opportunities.',
  openGraph: {
    title: 'Chen Leiv | Frontend Developer',
    description: 'Frontend Developer with 4+ years building scalable web applications with React, Angular, TypeScript & Node.js.',
    siteName: 'Chen Leiv Portfolio',
    images: [{ url: '/assets/og/og-image.png', width: 1200, height: 630, alt: 'Chen Leiv — Frontend Developer' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chen Leiv | Frontend Developer',
    description: 'Frontend Developer with 4+ years building scalable web applications with React, Angular, TypeScript & Node.js.',
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
