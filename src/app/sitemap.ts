import type { MetadataRoute } from "next";

const routes = ["", "/about", "/services", "/projects", "/careers", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://irontechdetailing.com";
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : 0.7,
  }));
}
