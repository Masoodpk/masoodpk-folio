import type { MetadataRoute } from "next";
import { site } from "@/data/content";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const all = getAllPosts();
  const pages = ["", "/projects", ...(all.length > 0 ? ["/blog"] : [])].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
  const posts = all.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...pages, ...posts];
}
