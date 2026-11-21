import type { PhotoSlot } from "./site";

/**
 * HANDS-ON EDUCATION: approved direction (operational copy pending final proof).
 * Note: never spell out the letters P3 on education pages.
 */
export const education = {
  hero: {
    heading: "Skill-building with instruments in hand.",
    paragraphs: [
      "I host P3 events for dental professionals who want to refine their clinical skills and put what they learn into practice.",
      "You work with instruments and products in hand, practicing techniques you can take back to the operatory.",
    ],
    cta: { label: "Explore P3 Events", href: "#events" },
    photo: {
      src: "/images/clinician-instruments.jpg",
      alt: "Clinician working with dental instruments",
      treatment: "color",
      direction: "Color photograph of an actual P3 workshop: instruments, coaching, participants. Keep the room in frame.",
      stock: true,
    } satisfies PhotoSlot,
    detail: {
      src: "/images/instrument-closeup.jpg",
      alt: "Close-up of instrumentation technique",
      treatment: "color",
      direction: "Close-up of hands and instruments during practice.",
      stock: true,
    } satisfies PhotoSlot,
  },

  family: {
    heading: "Dr. Joy’s P3",
    items: [
      {
        title: "P3 Annual Event",
        text: "My signature event, held once a year. The program changes every year and is built around hands-on clinical learning.",
      },
      {
        title: "P3 Special Events",
        text: "Additional programs I host during the year, including the P3 Certificate Course. Certificates are earned by demonstrated performance.",
      },
    ],
  },

  /** Featured attendee testimonial or approved short video. null = not yet supplied. */
  attendee: null as null | { quote: string; name: string; role?: string; videoUrl?: string },

  events: {
    heading: "P3 Events",
    /**
     * The current or next P3 event. Set to null when its landing page is not
     * live: the page then shows the interest-list fallback instead of a dead link.
     */
    featured: null as null | {
      name: string;
      date: string;
      location: string;
      details: string;
      registrationUrl: string; // Hazel-managed landing page
      photo: PhotoSlot;
    },
    cta: "View Event Details & Register",
    fallback: {
      heading: "Registration details for the next P3 event are not yet available.",
      text: "Join the P3 interest list to be notified when event details and registration are announced.",
      cta: "Join the P3 Interest List",
    },
  },

  routes: [
    {
      heading: "Planning a conference?",
      text: "P3 Interactive and P3 Mini are available to book.",
      cta: { label: "See Speaking", href: "/speaking#p3" },
    },
    {
      heading: "Training for your own team?",
      text: "Practice-specific P3 team training is offered through Instrumental.",
      cta: { label: "Visit Instrumental", href: "instrumental" },
      external: true,
    },
  ],
};
