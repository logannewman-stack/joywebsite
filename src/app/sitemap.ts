import type { MetadataRoute } from "next";
import { pageOrder, site } from "@/content/site";

/** The six public pages. /directions (review only) is deliberately left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pageOrder.map((page) => ({ url: page.href === "/" ? site.url : `${site.url}${page.href}` }));
}
