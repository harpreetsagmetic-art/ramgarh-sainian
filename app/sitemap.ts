import type { MetadataRoute } from "next";

const BASE_URL = "https://www.ramgarhsainian.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/pa",
    "/en",
    "/pa/village",
    "/en/village",
    "/pa/donate",
    "/en/donate",
  ];

  return pages.map((page) => ({
    url: `${BASE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page === "" ? 1 : 0.8,
  }));
}