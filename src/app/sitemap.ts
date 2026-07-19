import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/features",
    "/chat",
    "/stadium",
    "/dashboard",
    "/accessibility",
    "/volunteer",
    "/organizer",
    "/about",
    "/settings",
    "/profile",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
