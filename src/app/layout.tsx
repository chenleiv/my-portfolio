import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "Chen Leiv | Frontend Developer",
    template: "%s | Chen Leiv",
  },
  description: "Frontend Developer building scalable, high-performance web applications.",
  openGraph: {
    title: "Chen Leiv | Frontend Developer",
    description: "Portfolio – projects, skills, and contact.",
    type: "website",
    images: [{ url: "/assets/og/og-image.png", width: 1200, height: 630, alt: "Chen Leiv Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chen Leiv | Frontend Developer",
    description: "Portfolio – projects, skills, and contact.",
    images: ["/assets/og/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}