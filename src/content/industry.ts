import type { PhotoSlot } from "./site";

/** INDUSTRY COLLABORATIONS: approved working copy. */
export const industry = {
  hero: {
    heading: "Education and clinical strategy for dental manufacturers.",
    text: "I work with dental manufacturers to connect their products with clinical practice through education, advisory work, and long-term partnerships.",
    photo: {
      src: null,
      alt: "Dr. Joy, editorial portrait",
      treatment: "bw",
      direction: "Black-and-white editorial image. Professional and composed, black jacket; product or lab context optional.",
    } satisfies PhotoSlot,
  },

  partnerships: {
    heading: "Sponsorships and KOL Partnerships",
    text: "I partner with manufacturers on sponsored education, speaking engagements, hands-on programs, professional content, and clinical advisory roles.",
    cta: "Discuss a Partnership",
    photo: {
      src: "/images/lecture-room.jpg",
      alt: "Educator presenting to a room of dental professionals",
      treatment: "color",
      direction: "Authentic photograph of sponsored education or teaching, in color.",
      stock: true,
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
      src: "/images/xray-review.jpg",
      alt: "Clinician reviewing dental models and radiographs",
      treatment: "color",
      direction: "Authentic product work or clinical training photograph.",
      stock: true,
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
