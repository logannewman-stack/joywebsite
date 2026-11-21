import { links, site } from "@/content/site";
import { meet } from "@/content/meet";

/** Stable ids, so a page can point at the same person, e.g. an Event's organizer: { "@id": personId }. */
export const personId = `${site.url}/#person`;
export const websiteId = `${site.url}/#website`;

/** Universities from the approved Education list ("Degree, University"). */
function universities(): string[] {
  const items = meet.credentials.groups.find((g) => g.title === "Education")?.items ?? [];
  const names = items.map((item) => item.slice(item.lastIndexOf(", ") + 2)).filter(Boolean);
  return [...new Set(names)];
}

/**
 * Who the site is about, for search engines (schema.org JSON-LD). Built only
 * from approved copy and settings in site.ts; nothing here is shown on the page.
 */
export function StructuredData() {
  const name = site.fullName || site.shortName;
  const alternateName = [site.shortName, site.name].filter((n) => n !== name);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        inLanguage: "en-US",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name,
        alternateName,
        honorificPrefix: "Dr.",
        honorificSuffix: "RDH",
        url: site.url,
        image: `${site.url}/photos/home-hero.jpg`,
        email: site.email,
        alumniOf: universities().map((u) => ({ "@type": "CollegeOrUniversity", name: u })),
        // The Speaking page's approved topics.
        knowsAbout: ["Periodontal care", "Emerging technology", "The business of hygiene", "Professional well-being"],
        ...(links.profiles.length ? { sameAs: links.profiles } : {}),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // Escaped as the Next.js JSON-LD guide recommends.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
