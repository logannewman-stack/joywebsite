import type { MetadataRoute } from "next";
import { pageOrder, site } from "@/content/site";
import { insights } from "@/content/insights";

/**
 * The six public pages, plus an /insights/<slug> page for each original
 * article that has its own text (`slug` and `body`).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = pageOrder.map((page) => ({ url: page.href === "/" ? site.url : `${site.url}${page.href}` }));
  const articles = (insights.original.articles as unknown as { slug?: string; body?: unknown }[])
    .filter((a) => a.slug && a.body)
    .map((a) => ({ url: `${site.url}/insights/${a.slug}` }));
  return [...pages, ...articles];
}
