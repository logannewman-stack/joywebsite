/**
 * ============================================================================
 *  SITE-WIDE SETTINGS
 *  Page copy lives in the other files in this folder, one per page.
 *  Copy in those files is the APPROVED WORKING COPY from the creative brief.
 *  Propose wording changes to Dr. Joy before editing it.
 * ============================================================================
 */

export const site = {
  name: "Dr. Joy RDH",
  shortName: "Dr. Joy",
  /**
   * Default search and share description (used by Home and any page without
   * its own). Approved copy: the third paragraph of Home's "A perspective
   * shaped by every side of dentistry".
   */
  description:
    "Today, I bring that perspective to conference stages, hands-on education, industry collaborations, and practice consulting.",
  /** Production address. Canonical URLs, the sitemap and share images use it. */
  url: "https://www.drjoyrdh.com",
  /** Public contact address (from the speaker materials). */
  email: "info@DrJoyRDH.com",
  /**
   * Full professional name, used only in the structured data that search
   * engines read (never shown on the page). Leave empty until Dr. Joy
   * confirms it may be used; "Dr. Joy" is used until then.
   */
  fullName: "" as string,

  /**
   * The Dr. Joy script wordmark (from "New Dr Joy RDH Logos"). The files in
   * /public/brand are the supplied SVGs with the background panel removed
   * and the frame cropped to the mark. Set to null to show a text stand-in.
   */
  wordmark: {
    onLight: "/brand/dr-joy-rdh-wordmark-charcoal.svg" as string | null,
    onDark: "/brand/dr-joy-rdh-wordmark-cream.svg" as string | null,
    // Cropped artwork is 3.07:1
    width: 160,
    height: 52,
  },

  /**
   * Review mode. While true, empty slots (logos, articles, event details,
   * testimonials awaiting files) show labelled placeholders so the layout can
   * be reviewed, and search engines are asked not to index the site. Set to
   * false for launch: anything still empty is hidden, /directions is removed,
   * and the launch checks below must pass.
   */
  showPlaceholders: true,

  /**
   * Which opening-screen direction Home uses: "a" | "b" | "c".
   * Compare all three at /directions.
   */
  homeHero: "b" as "a" | "b" | "c",

  /**
   * Portrait style: "color" (current) or "bw". Every portrait also has a
   * black-and-white version (srcBw), so the monochrome look Dr. Joy's brief
   * started from is one setting away.
   */
  photoStyle: "color" as "color" | "bw",
};

/** Every outbound destination in one place. Empty string = not yet supplied. */
export const links = {
  instrumental: "", // TODO: companion consulting site URL (required at launch)
  speakerResources: "", // TODO: speaker packet, bios, headshots, course PDFs
  speakerReel: "", // optional YouTube/Vimeo URL
  privacy: "", // TODO: privacy policy URL (required at launch while forms offer the text-message opt-in)
  /** Terms of service URL, if one is published. The old site's /terms-of-service redirects here. */
  terms: "",
  /** Public profiles (LinkedIn, Instagram, ...). Listed for search engines in the structured data. */
  profiles: [] as string[],
};

/**
 * Launch checks. While `showPlaceholders` is true (review) nothing is
 * required. A launch build (showPlaceholders false) fails with a list of
 * what is missing, instead of shipping a dead link or collecting consent
 * without a privacy policy.
 *
 * `smsOptIn`: whether any form offers the text-message opt-in. The root
 * layout passes it from the opt-in wording in integrations.ts.
 */
export function launchBlockers({ smsOptIn = true }: { smsOptIn?: boolean } = {}): string[] {
  if (site.showPlaceholders) return [];
  const missing: string[] = [];
  if (!links.instrumental) missing.push("links.instrumental: Consulting must link to the Instrumental site.");
  if (smsOptIn && !links.privacy)
    missing.push("links.privacy: the P3 interest list offers text messages, so it must link a privacy policy.");
  if (!/^https:\/\/[^/]+$/.test(site.url)) missing.push("site.url: set the production address, e.g. https://www.drjoyrdh.com (no trailing slash).");
  return missing;
}

// Consulting is a required pathway, so a launch build without the Instrumental
// URL fails here, wherever this file is imported.
if (!site.showPlaceholders && !links.instrumental) {
  throw new Error("links.instrumental must be set before launch (site.showPlaceholders is false).");
}

export const nav = [
  { label: "Meet Dr. Joy", href: "/meet-dr-joy" },
  { label: "Speaking", href: "/speaking" },
  { label: "Hands-On Education", href: "/hands-on-education" },
  { label: "Industry Collaborations", href: "/industry-collaborations" },
  { label: "Insights", href: "/insights" },
] as const;

/** Order used for the "Next" link at the foot of each page. */
export const pageOrder = [
  { label: "Home", href: "/" },
  ...nav,
] as const;

export type PhotoSlot = {
  /** Path in /public. null shows an art-direction placeholder. */
  src: string | null;
  /** Black-and-white version of the same photograph, used when site.photoStyle is "bw". */
  srcBw?: string;
  alt: string;
  /** Intended treatment from the photography plan. */
  treatment: "bw" | "color" | "cutout";
  /** Art direction shown on the placeholder until the real photo arrives. */
  direction: string;
  /** True for royalty-free stand-ins (Unsplash) that must be replaced. */
  stock?: boolean;
  /** Original filename from the shoot or event folder, for tracing and retouching. */
  original?: string;
  /** Focal point for object-position, e.g. "50% 30%". */
  focus?: string;
  /** Focal point below 768px, when the mobile crop needs a different center. */
  focusMobile?: string;
};
