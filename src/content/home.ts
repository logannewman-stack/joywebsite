import type { PhotoSlot } from "./site";

/** HOME: approved working copy. */
export const home = {
  hero: {
    heading: "The work has always been bigger than the chair.",
    sub: "Clinical excellence matters. So does what it makes possible for patients, professionals, and practices.",
    primary: { label: "Explore Speaking", href: "/speaking" },
    secondary: { label: "Meet Dr. Joy", href: "/meet-dr-joy" },

    /**
     * Direction B (the Home default): "photo" is the photographic black stage
     * (JVH-111). "cutout" is the layered cutout, kept for when a retouched
     * matte of JVH-130 exists; the current file is an automated test.
     */
    bStyle: "photo" as "photo" | "cutout",
    /** Direction B stage, 768px and up: the full landscape frame, bleeding off the right edge. */
    stage: {
      src: "/photos/home-hero-stage-g.jpg",
      srcBw: "/photos/home-hero-stage-bw.jpg",
      alt: "Dr. Joy in a black suit, smiling, seated on steps",
      treatment: "bw",
      direction: "Black jacket on dark steps, direct and warm. Head and shoulders on the right; the left side fades into the black stage.",
      // Left of center, so she sits in the solid part of the pane and clear of the headline at every width.
      focus: "25% 30%",
      original: "JVH-111",
    } satisfies PhotoSlot,
    /** Direction B stage on phones: a taller crop of the same frame, so the face stays sharp and centered. */
    stageTall: {
      src: "/photos/home-hero-stage-tall-g.jpg",
      srcBw: "/photos/home-hero-stage-tall-bw.jpg",
      alt: "Dr. Joy in a black suit, smiling, seated on steps",
      treatment: "bw",
      direction: "Head and shoulders, centered, rising out of the black stage under the headline.",
      focus: "50% 0%",
      original: "JVH-111 (crop)",
    } satisfies PhotoSlot,

    /** Direction A portrait. */
    portrait: {
      src: "/photos/home-hero-g.jpg",
      srcBw: "/photos/home-hero-bw.jpg",
      alt: "Dr. Joy in a black suit, arms crossed, smiling",
      treatment: "bw",
      direction: "One strong monochrome portrait. Black jacket or white blazer, three-quarter length, direct and warm. Leave headline space on the left.",
      focus: "50% 22%",
      focusMobile: "50% 18%",
      original: "JVH-155",
    } satisfies PhotoSlot,
    /** Direction B, cutout variant (automated test matte: do not launch). */
    cutout: {
      src: "/photos/home-hero-cutout.png",
      srcBw: "/photos/home-hero-cutout-bw.png",
      alt: "Dr. Joy in a white blazer",
      treatment: "cutout",
      direction: "Background-removed portrait in a white blazer (separates on black). Clean hair and jacket edges. Waist up, room above the head.",
      focus: "50% 0%",
      original: "JVH-130 (cutout)",
    } satisfies PhotoSlot,
    /** Direction C photograph: a warm workshop room. */
    color: {
      src: "/photos/home-hero-room-g.jpg",
      alt: "Dr. Joy teaching a room of dental professionals",
      treatment: "color",
      direction: "Color photograph from a real room, mid-presentation. Warm, natural light.",
      focus: "40% 38%",
      focusMobile: "38% 30%",
      original: "54707956836",
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
     * Styling only, never wording: the phrase of the heading that carries the blush
     * marker, and the phrases set in blush when the paragraphs above are shown one
     * sentence at a time over the photograph (one list per sentence, in order).
     * Each phrase must appear in its sentence exactly as written.
     */
    headingMark: "every side",
    marks: [
      ["at 16", "the front desk"],
      ["three decades later"],
      ["the front office", "industry leadership"],
      ["extraordinary potential"],
      ["that perspective"],
    ],
    /** Full-bleed band inside the section, 768px and up. */
    photo: {
      src: "/photos/home-perspective-band-g.jpg",
      srcBw: "/photos/home-perspective-band-bw.jpg",
      alt: "Dr. Joy in a white blazer, looking away and smiling",
      treatment: "bw",
      direction: "Candid, full-bleed: white blazer against a warm wall, looking out of the frame. A pause in the story, not another headshot.",
      focus: "50% 32%",
      original: "JVH-123",
    } satisfies PhotoSlot,
    /** The same band on phones: a 4:5 crop. */
    photoTall: {
      src: "/photos/home-perspective-band-tall-g.jpg",
      srcBw: "/photos/home-perspective-band-tall-bw.jpg",
      alt: "Dr. Joy in a white blazer, looking away and smiling",
      treatment: "bw",
      direction: "4:5 crop of the band for phones.",
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
    /** The room behind the quote: dimmed and in monochrome, so the words stay first. */
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
