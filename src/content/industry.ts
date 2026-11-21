import type { PhotoSlot } from "./site";

/** INDUSTRY COLLABORATIONS: approved working copy. */
export const industry = {
  hero: {
    heading: "Education and clinical strategy for dental manufacturers.",
    text: "I work with dental manufacturers to connect their products with clinical practice through education, advisory work, and long-term partnerships.",
    photo: {
      src: "/photos/industry-hero-seated.jpg",
      srcBw: "/photos/industry-hero-bw-seated.jpg",
      alt: "Dr. Joy seated in a black suit",
      treatment: "bw",
      direction: "Black-and-white editorial image. Professional and composed, black jacket; product or lab context optional.",
      focus: "50% 35%",
      original: "JVH-129",
    } satisfies PhotoSlot,
  },

  partnerships: {
    heading: "Sponsorships and KOL Partnerships",
    text: "I partner with manufacturers on sponsored education, speaking engagements, hands-on programs, professional content, and clinical advisory roles.",
    cta: "Discuss a Partnership",
    photo: {
      src: "/photos/industry-partnership.jpg",
      alt: "Dr. Joy leading a session for a room of dental professionals",
      treatment: "color",
      direction: "Authentic photograph of sponsored education or teaching, in color.",
      focus: "30% 45%",
      original: "54707145282",
    } satisfies PhotoSlot,
  },

  launch: {
    heading: "Clinical Launch Strategy",
    lead: "Clinicians adopt a product when they understand how it fits the care they deliver.",
    paragraphs: [
      "I work with manufacturers to assess where a product stands clinically, develop the rationale and protocols behind it, and build the education that supports its introduction into practice. I also train the people who will teach it and sell it.",
      "The work can begin before launch. I help companies establish where a product fits in patient care, how clinicians will use it, and what they need to know to bring it into practice.",
    ],
    cta: "Discuss a Clinical Launch Project",
    photo: {
      src: "/photos/industry-launch.jpg",
      alt: "Dr. Joy working with a dental model",
      treatment: "color",
      direction: "Authentic product work or clinical training photograph.",
      focus: "45% 40%",
      original: "Facetune_22-10-2025",
    } satisfies PhotoSlot,
  },

  collaborations: {
    heading: "Selected Industry Collaborations",
    // Approved manufacturer logos only: { name, src }
    logos: [] as { name: string; src: string }[],
  },

  closing: {
    heading: "Let’s Discuss Your Project",
    text: "Tell me what you are building: a clinical education program, a professional partnership, or a product launch.",
    cta: "Start a Conversation",
  },
};
