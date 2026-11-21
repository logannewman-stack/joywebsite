import type { PhotoSlot } from "./site";

/** HOME: approved working copy. */
export const home = {
  hero: {
    heading: "The work has always been bigger than the chair.",
    sub: "Clinical excellence matters. So does what it makes possible for patients, professionals, and practices.",
    primary: { label: "Explore Speaking", href: "/speaking" },
    secondary: { label: "Meet Dr. Joy", href: "/meet-dr-joy" },
    portrait: {
      src: null,
      alt: "Dr. Joy, portrait",
      treatment: "bw",
      direction: "One strong monochrome portrait. Black jacket or white blazer, three-quarter length, direct and warm. Leave headline space on the left.",
    } satisfies PhotoSlot,
    cutout: {
      src: null,
      alt: "Dr. Joy, portrait",
      treatment: "cutout",
      direction: "Background-removed portrait in a white blazer (separates on black). Clean hair and jacket edges. Waist up, room above the head.",
    } satisfies PhotoSlot,
    color: {
      src: null,
      alt: "Dr. Joy speaking to a conference audience",
      treatment: "color",
      direction: "Color photograph on stage or mid-presentation, with the room visible. Warm, natural light.",
    } satisfies PhotoSlot,
  },

  perspective: {
    heading: "A perspective shaped by every side of dentistry.",
    paragraphs: [
      "I started in dentistry at 16, at the front desk. Nearly three decades later, that experience continues to shape how I see our profession.",
      "I’ve experienced dentistry from the front office to the operatory, from clinical education to industry leadership. Every role has reinforced the same belief: dental hygiene has extraordinary potential when clinical excellence, education, and business understanding come together.",
      "Today, I bring that perspective to conference stages, hands-on education, industry collaborations, and practice consulting.",
    ],
    cta: { label: "Explore My Work", href: "#work" },
    photo: {
      src: null,
      alt: "Dr. Joy, candid portrait",
      treatment: "bw",
      direction: "Quiet B&W editorial portrait, candid. White blazer on a light background, with enough tonal detail.",
    } satisfies PhotoSlot,
  },

  pathways: [
    {
      kicker: "Speaking",
      heading: "Programs for conferences, study clubs, and dental organizations.",
      body: "Evidence-based presentations that connect clinical knowledge with real-world experience. Topics run from periodontal care to the business of hygiene, and every program gives clinicians something to use the next clinic day.",
      link: { label: "Speaking Topics", href: "/speaking#topics" },
      photo: {
        src: "/images/audience.jpg",
        alt: "Conference audience in a large hall",
        treatment: "color",
        direction: "Color stage photograph of Dr. Joy presenting.",
        stock: true,
      } satisfies PhotoSlot,
    },
    {
      kicker: "Hands-On Education",
      heading: "Skill-building with instruments in hand.",
      body: "Workshops and certificate courses built around clinical decision-making, instrumentation, and prevention. Participants practice each skill and refine how they perform it.",
      link: { label: "Courses and Workshops", href: "/hands-on-education" },
      photo: {
        src: "/images/clinician-instruments.jpg",
        alt: "Clinician holding dental instruments",
        treatment: "color",
        direction: "Color photograph from a P3 workshop: instruments in hand, coaching.",
        stock: true,
      } satisfies PhotoSlot,
    },
    {
      kicker: "Industry Collaborations",
      heading: "Clinical education for the products hygienists use.",
      body: "I work with dental manufacturers to build education programs, support product launches, and bring the clinician’s perspective into product decisions.",
      link: { label: "Industry Collaborations", href: "/industry-collaborations" },
      photo: {
        src: "/images/xray-review.jpg",
        alt: "Clinician reviewing dental models and radiographs",
        treatment: "color",
        direction: "Authentic product, training or demonstration photograph.",
        stock: true,
      } satisfies PhotoSlot,
    },
    {
      kicker: "Consulting",
      heading: "Hygiene as a driver of practice value.",
      body: "Through the P3 System, I help practices and dental organizations build hygiene departments on clear protocols, measured performance, and profitability. Patient care gets stronger, and so does the value of the practice.",
      link: { label: "Consulting", href: "instrumental" }, // resolved to links.instrumental
      external: true,
      photo: {
        src: "/images/operatory.jpg",
        alt: "Dental operatory",
        treatment: "color",
        direction: "Practice environment or team photograph.",
        stock: true,
      } satisfies PhotoSlot,
    },
  ],

  testimonial: {
    heading: "What Others Are Saying",
    quote: "She works with integrity and always strives to reach higher. It is a pleasure to work with her.",
    name: "Claire Jeong, MS, RDH",
    role: "Founder, StudentRDH & DentalToaster",
    permission: "pending" as "pending" | "granted",
  },

  closing: {
    heading: "Let’s start a conversation.",
    body: "Planning a conference, organizing hands-on education, exploring a manufacturer partnership, or looking to strengthen a hygiene department? Tell me what you’re working on.",
    cta: "Start a Conversation",
  },
};
