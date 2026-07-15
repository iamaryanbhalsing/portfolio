import type { MetadataRoute } from "next";

const SITE_URL = "https://aryanbhalsing.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/blog"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
