import type { NextConfig } from "next";
import { links } from "./src/content/site";

type Redirect = { source: string; destination: string; permanent: boolean };

/**
 * The old drjoyrdh.com (WordPress) addresses, each sent to the closest new
 * page. Source: the live site's wp-sitemap.xml (46 URLs, November 2026).
 * Old URLs end in "/": Next first drops the trailing slash, then applies these.
 */
function oldSiteRedirects(): Redirect[] {
  const to = (destination: string, sources: string[]) => sources.map((source) => ({ source, destination, permanent: true }));
  const consulting = (source: string): Redirect =>
    // Consulting moved to Instrumental. Until its URL is set (review mode only; launch requires it), go to Home temporarily.
    links.instrumental ? { source, destination: links.instrumental, permanent: true } : { source, destination: "/", permanent: false };
  return [
    ...to("/meet-dr-joy", ["/about"]),
    // Topic and presentation pages, and the speaking catalog.
    ...to("/speaking#topics", [
      "/speaking-topics",
      "/speaking-educational-presentations",
      "/speaking-new",
      "/presentation/:slug*",
      "/presentation-type/:slug*",
    ]),
    // Inquiry, schedule and meeting-planner pages: the Speaking page has the inquiry and resources.
    ...to("/speaking", [
      "/speaking-inquiry",
      "/speaking/speaking-schedule",
    ]),
    // Meeting-planner resources, and the files the old page linked (bios, logistics, headshots).
    ...to("/speaking#resources", [
      "/speaking/resources-for-meeting-planners",
      "/download-my-speaking-kit",
      "/wp-content/uploads/2026/04/Dr-Joy-Short-Form-Bio.pdf",
      "/wp-content/uploads/2026/04/Dr-Joy-Long-Form-Bio.pdf",
      "/wp-content/uploads/2026/04/Dr-Joy-Last-Minute-Logistics.docx",
      ...["111", "117", "124", "132", "138", "145", "155"].map((n) => `/wp-content/uploads/2026/05/JVH-${n}.jpg`),
    ]),
    // The old speaker kit (it carries retired wording): the new packet once it exists, else the resources.
    {
      source: "/wp-content/uploads/2026/05/Final-Web-Version-J-Void-Holmes-SP.pdf",
      destination: links.speakerResources || "/speaking#resources",
      permanent: false,
    },
    // Clinical training for hygienists (P3 certification and workshops, 1:1 instrumentation coaching).
    ...to("/hands-on-education", [
      "/workshops",
      "/workshop-inquiry",
      "/p3-certification",
      "/p3-clinical-methodology",
      "/1-on-1-coaching",
      "/coaching-application",
      "/consulting/for-hygienists-clinical-teams",
    ]),
    ...to("/hands-on-education#events", ["/p3-waitlist"]),
    // Media, articles and the old blog.
    ...to("/insights", ["/media-events", "/clinical-board-tips"]),
    // Practice and DSO consulting, and the P3 Growth System call.
    consulting("/consulting"),
    consulting("/consulting/:path+"),
    consulting("/p3-hygiene-growth-call"),
    // Legal pages: only once the new addresses exist (the old A2P text-message registration may point here).
    ...(links.privacy ? to(links.privacy, ["/privacy-policy-2"]) : []),
    ...(links.terms ? to(links.terms, ["/terms-of-service"]) : []),
    // WordPress leftovers.
    ...to("/", ["/homepage", "/temp-home", "/sample-page", "/hello-world", "/thank-you", "/contact", "/category/:slug*", "/author/:slug*"]),
  ];
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 31 days. Replaced photos always get a new filename, so a long cache is safe.
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return oldSiteRedirects();
  },
  async headers() {
    return [
      // The course PDFs still carry the old logo and the speaker packet's page counters ("01 of 15").
      // Keep them out of search results until the final versions are in, then remove this rule.
      { source: "/pdfs/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
