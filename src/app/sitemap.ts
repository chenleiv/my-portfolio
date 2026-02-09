import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://YOUR_DOMAIN.vercel.app";
  return [{ url: `${base}/`, lastModified: new Date() }];
}
