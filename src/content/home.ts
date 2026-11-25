import type { PhotoSlot } from "./site";

/** HOME: approved working copy. */
export const home = {
  hero: {
    heading: "The work has always been bigger than the chair.",
    sub: "Clinical excellence matters. So does what it makes possible for patients, professionals, and practices.",
    primary: { label: "Explore Speaking", href: "/speaking" },
    secondary: { label: "Meet Dr. Joy", href: "/meet-dr-joy" },

    /**
     * The opening portrait: the white blazer with its background removed, set
     * straight on the black stage in full colour. It stands on the bottom edge
     * of the opening. The matte was made from the graded 4:5 frame
     * (meet-hero-133-g.jpg) with scripts/cutout.py.
     */
    photo: {
      src: "/photos/home-hero-cutout-133.webp",
      alt: "Dr. Joy in a white blazer with black trim, smiling",
      treatment: "cutout",
      direction: "Background-removed portrait in the white blazer (it separates on black). Clean hair and jacket edges, earrings kept. Waist up, room above the head.",
      original: "JVH-133 (cut-out, 1155 x 1647)",
    } satisfies PhotoSlot,
  },

  perspective: {
    heading: "A perspective shaped by every side of dentistry.",
    paragraphs: [
      "I started in dentistry at 16, at the front desk. Nearly three decades later, that experience continues to shape how I see our profession.",
      "I’ve experienced dentistry from the front office to the operatory, from clinical education to industry leadership. Every role has reinforced the same belief: dental hygiene has extraordinary potential when clinical excellence, education, and business understanding come together.",
      "Today, I bring that perspective to conference stages, hands-on education, industry collaborations, and practice consulting.",
    ],
    /**
     * Styling only, never wording: the phrase of the heading that carries the pale
     * pink marker. It must appear in the heading exactly as written.
     */
    headingMark: "every side",
    /** The photograph beside the story: a 4:5 crop of JVH-123. */
    photo: {
      src: "/photos/home-perspective-band-tall-g.jpg",
      srcBw: "/photos/home-perspective-band-tall-bw.jpg",
      alt: "Dr. Joy in a white blazer, looking away and smiling",
      treatment: "color",
      direction: "Candid: white blazer against a warm wall, looking out of the frame. A pause in the story, not another headshot.",
      focus: "50% 40%",
      original: "JVH-123 (crop)",
    } satisfies PhotoSlot,
  },

  /** "Explore My Work": the heading of the four pathways. */
  work: {
    heading: "Explore My Work",
  },

  pathways: [
    {
      kicker: "Speaking",
      heading: "Programs for conferences, study clubs, and dental organizations.",
      body: "Evidence-based presentations that connect clinical knowledge with real-world experience. Topics run from periodontal care to the business of hygiene, and every program gives clinicians something to use the next clinic day.",
      link: { label: "Speaking Topics", href: "/speaking#topics" },
      photo: {
        src: "/photos/path-speaking-4x5-g.jpg",
        alt: "Dr. Joy speaking on stage",
        treatment: "color",
        direction: "Color stage photograph of Dr. Joy presenting.",
        focus: "50% 40%",
        original: "54707922441",
      } satisfies PhotoSlot,
    },
    {
      kicker: "Hands-On Education",
      heading: "Skill-building with instruments in hand.",
      body: "Workshops and certificate courses built around clinical decision-making, instrumentation, and prevention. Participants practice each skill and refine how they perform it.",
      link: { label: "Courses and Workshops", href: "/hands-on-education" },
      photo: {
        src: "/photos/path-hands-on-4x5-g.jpg",
        alt: "Dr. Joy teaching a workshop with an instrument in hand",
        treatment: "color",
        direction: "Color photograph from a P3 workshop: instruments in hand, coaching.",
        focus: "50% 35%",
        original: "54708288935",
      } satisfies PhotoSlot,
    },
    {
      kicker: "Industry Collaborations",
      heading: "Clinical education for the products hygienists use.",
      body: "I work with dental manufacturers to build education programs, support product launches, and bring the clinician’s perspective into product decisions.",
      link: { label: "Industry Collaborations", href: "/industry-collaborations" },
      photo: {
        src: "/photos/path-industry-4x5-g.jpg",
        alt: "Dr. Joy holding a dental instrument and a dental model",
        treatment: "color",
        direction: "Authentic product, training or demonstration photograph.",
        focus: "50% 30%",
        original: "JVH-135",
      } satisfies PhotoSlot,
    },
    {
      kicker: "Consulting",
      heading: "Hygiene as a driver of practice value.",
      body: "Through the P3 System, I help practices and dental organizations build hygiene departments on clear protocols, measured performance, and profitability. Patient care gets stronger, and so does the value of the practice.",
      link: { label: "Consulting", href: "instrumental" }, // resolved through instrumentalLink()
      external: true,
      photo: {
        src: "/photos/path-consulting-4x5-g.jpg",
        alt: "Dr. Joy in a black suit in a modern lounge",
        treatment: "color",
        direction: "Practice environment or team photograph.",
        focus: "50% 30%",
        original: "JVH-140",
      } satisfies PhotoSlot,
    },
  ],

  testimonial: {
    heading: "What Others Are Saying",
    quote: "She works with integrity and always strives to reach higher. It is a pleasure to work with her.",
    name: "Claire Jeong, MS, RDH",
    role: "Founder, StudentRDH & DentalToaster",
    permission: "pending" as "pending" | "granted",
    /** The room behind the quote: in colour, dimmed and drifting slowly, so the words stay first. */
    backdrop: {
      src: "/photos/home-quote-room-g.jpg",
      alt: "A conference audience standing and applauding",
      treatment: "color",
      direction: "A full room on its feet, seen from the side. No stage, no signage: a backdrop for the quote.",
      focus: "50% 82%",
      focusMobile: "42% 82%",
      original: "54708276125",
    } satisfies PhotoSlot,
  },

  closing: {
    heading: "Let’s start a conversation.",
    body: "Planning a conference, organizing hands-on education, exploring a manufacturer partnership, or looking to strengthen a hygiene department? Tell me what you’re working on.",
    cta: "Start a Conversation",
  },
};
