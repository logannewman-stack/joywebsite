import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Crawling stays open even in review mode: review pages carry a noindex tag,
 * which crawlers can only see if they are allowed to fetch the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
