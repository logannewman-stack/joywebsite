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
  description:
    "Dr. Joy RDH: dental hygiene speaker, educator and clinical strategist. Conference presentations, hands-on P3 education and industry collaborations.",
  url: "https://example.com", // TODO: production domain

  /**
   * The existing Dr. Joy script wordmark. Add the supplied files to
   * /public/brand and set the paths here. Until then a plain typographic
   * stand-in is shown (it is NOT a logo and must not ship).
   */
  wordmark: {
    onLight: null as string | null, // e.g. "/brand/dr-joy-wordmark-black.svg"
    onDark: null as string | null, // e.g. "/brand/dr-joy-wordmark-white.svg"
    width: 132,
    height: 44,
  },

  /**
   * Review mode. While true, empty slots (logos, articles, event details,
   * testimonials awaiting files) show labelled placeholders so the layout can
   * be reviewed. Set to false for launch: anything still empty is hidden.
   */
  showPlaceholders: true,

  /**
   * Which opening-screen direction Home uses: "a" | "b" | "c".
   * Compare all three at /directions.
   */
  homeHero: "a" as "a" | "b" | "c",
};

/** Every outbound destination in one place. Empty string = not yet supplied. */
export const links = {
  instrumental: "", // TODO: companion consulting site URL
  speakerResources: "", // TODO: speaker packet, bios, headshots, course PDFs
  speakerReel: "", // optional YouTube/Vimeo URL
  privacy: "", // TODO: privacy policy URL
};

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
  alt: string;
  /** Intended treatment from the photography plan. */
  treatment: "bw" | "color" | "cutout";
  /** Art direction shown on the placeholder until the real photo arrives. */
  direction: string;
  /** True for royalty-free stand-ins (Unsplash) that must be replaced. */
  stock?: boolean;
  /** Focal point for object-position, e.g. "50% 30%". */
  focus?: string;
};
