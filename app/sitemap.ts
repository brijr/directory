import { MetadataRoute } from "next";
import { getAllBookmarks } from "@/lib/data";
import { directory } from "@/directory.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = directory.baseUrl;

  // Fetch all bookmarks
  const bookmarks = await getAllBookmarks();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Dynamic pages from bookmarks
  const dynamicPages: MetadataRoute.Sitemap = bookmarks.map((bookmark) => ({
    url: `${baseUrl}/${bookmark.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...dynamicPages];
}
