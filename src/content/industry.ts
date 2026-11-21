import type { PhotoSlot } from "./site";

/** INDUSTRY COLLABORATIONS: approved working copy. */
export const industry = {
  hero: {
    heading: "Education and clinical strategy for dental manufacturers.",
    text: "I work with dental manufacturers to connect their products with clinical practice through education, advisory work, and long-term partnerships.",
    photo: {
      // 4:5 crop: she reads larger and the ceiling pendants no longer compete with the headline.
      src: "/photos/industry-hero-4x5-g.jpg",
      srcBw: "/photos/industry-hero-4x5-bw.jpg",
      alt: "Dr. Joy seated in a black suit",
      treatment: "bw",
      direction: "Black-and-white editorial image. Professional and composed, black jacket; product or lab context optional.",
      focus: "50% 50%",
      original: "JVH-129",
    } satisfies PhotoSlot,
  },

  partnerships: {
    heading: "Sponsorships and KOL Partnerships",
    text: "I partner with manufacturers on sponsored education, speaking engagements, hands-on programs, professional content, and clinical advisory roles.",
    cta: "Discuss a Partnership",
    photo: {
      // 4:5 crop. The sponsor's out-of-focus lettering on the backdrop was removed
      // (logos need clearance); export the untouched original if clearance is given.
      src: "/photos/industry-partnership-stage-g.jpg",
      alt: "Dr. Joy presenting at a sponsored education program, mid-sentence, with a headset microphone",
      treatment: "color",
      direction: "Authentic photograph of sponsored education or teaching, in color.",
      focus: "50% 40%",
      original: "_DSC1299",
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
      // 4:5 crop around her face, gloved hands and the model. Calm grade
      // (scripts/grade_photos.py --foliage 0.45 --ceiling 0.26): the neon gloves,
      // chartreuse laptop and lilac sky are quieted so the frame sits with the set.
      src: "/photos/industry-launch-4x5-v2-g.jpg",
      alt: "Dr. Joy in gloves and glasses, working an instrument on a dental model",
      treatment: "color",
      direction: "Authentic product work or clinical training photograph.",
      focus: "50% 40%",
      original: "Facetune_22-10-2025",
    } satisfies PhotoSlot,
  },

  collaborations: {
    heading: "Selected Industry Collaborations",
    /**
     * Approved manufacturer logos only, each with written clearance. Use the
     * official one-color file the company supplies (no CSS recoloring). Up to
     * five show, in one row: this is not a logo wall.
     */
    logos: [] as { name: string; src: string }[],
  },

  closing: {
    heading: "Let’s Discuss Your Project",
    text: "Tell me what you are building: a clinical education program, a professional partnership, or a product launch.",
    cta: "Start a Conversation",
  },
};
