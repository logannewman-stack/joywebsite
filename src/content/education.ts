import type { PhotoSlot } from "./site";

/** One P3 event with its own registration landing page (Hazel creates one per event). */
export type FeaturedEvent = {
  name: string;
  /** As shown on the page, e.g. "April 17–18, 2027". */
  date: string;
  /**
   * The event's last day, as YYYY-MM-DD. After that day ends (US Eastern
   * time) the event and its Register button come down by themselves and the
   * interest list takes their place. No redeploy is needed.
   */
  endsOn: string;
  /** First day, as YYYY-MM-DD (optional, for search engines). */
  startsOn?: string;
  location: string;
  details: string;
  registrationUrl: string; // Hazel-managed landing page
  /** The event's own photograph. Leave it out to use the section photograph. */
  photo?: PhotoSlot;
};

type Attendee = {
  quote: string;
  /** Name and credentials together, e.g. "Jane Doe, RDH". */
  name: string;
  role?: string;
  /** Approved short attendee video: a YouTube or Vimeo link. Shown when set (with captions on). */
  videoUrl?: string;
  /** "portrait" for a vertical phone video. */
  videoShape?: "landscape" | "portrait";
  /** Optional still for the video before it plays. */
  videoPoster?: PhotoSlot;
  permission: "pending" | "granted";
};

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
      src: "/photos/education-room.jpg",
      alt: "Dr. Joy teaching a P3 workshop, participants at their tables",
      treatment: "color",
      direction: "Color photograph of an actual P3 workshop: instruments, coaching, participants. Keep the room in frame.",
      focus: "50% 18%",
      focusMobile: "50% 30%",
      original: "54707956526",
    } satisfies PhotoSlot,
    detail: {
      src: "/photos/education-hands.jpg",
      alt: "Dr. Joy guiding a participant’s instrument grip on a dental model",
      treatment: "color",
      direction: "Close-up of hands and instruments during practice.",
      focus: "50% 50%",
      original: "IMG_2698",
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
    photo: {
      src: "/photos/education-annual.jpg",
      alt: "Dr. Joy demonstrating a technique while participants work with their instrument kits",
      treatment: "color",
      direction: "The whole room at work: participants with instruments and kits on the tables.",
      focus: "45% 6%",
      original: "54707145282",
    } satisfies PhotoSlot,
  },

  /** Full-width photograph between the P3 family and the attendee voice. */
  interlude: {
    src: "/photos/education-band.jpg",
    alt: "A participant smiling, an instrument in hand, at a P3 workshop table",
    treatment: "color",
    direction: "Participants practicing at their tables, instruments in hand.",
    focus: "50% 50%",
    focusMobile: "47% 50%",
    original: "54708309585",
  } satisfies PhotoSlot,

  /** Featured attendee testimonial or approved short video. null = not yet supplied. */
  attendee: {
    quote:
      "I truly enjoyed P3, Dr. Joy! You provided a unique opportunity to get additional hands-on training that isn’t always offered with an instrumentation CE. The content of the program was great, and everything was touched upon. I look forward to taking another course of yours soon.",
    name: "Hailey Marie Ebue, RDH",
    permission: "pending",
  } as null | Attendee,

  events: {
    heading: "P3 Events",
    /** Shown with the interest list, and with a featured event that has no photograph of its own. */
    photo: {
      src: "/photos/education-session.jpg",
      alt: "Dr. Joy teaching a P3 session, seen from the participants’ tables",
      treatment: "color",
      direction: "A P3 session from a participant’s seat.",
      focus: "50% 40%",
      focusMobile: "50% 22%",
      original: "54708180264",
    } satisfies PhotoSlot,
    /**
     * The current or next P3 event. Set to null when its landing page is not
     * live: the page then shows the interest-list fallback instead of a dead
     * link. A featured event also falls back by itself once `endsOn` has passed.
     */
    featured: null as null | FeaturedEvent,
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

const DAY = 86_400_000;

/** When a featured event's listing comes down: the end of its last day, US Eastern (UTC−5). */
export function eventEndsAt(ev: Pick<FeaturedEvent, "endsOn">): number {
  return /^\d{4}-\d{2}-\d{2}$/.test(ev.endsOn) ? Date.parse(`${ev.endsOn}T00:00:00-05:00`) + DAY : NaN;
}

/**
 * The featured event while it is current, otherwise null (show the interest
 * list). Call it when rendering in the browser, e.g. in the inquiry panel.
 */
export function currentEvent(now: number = Date.now()): FeaturedEvent | null {
  const ev = education.events.featured;
  return ev && now < eventEndsAt(ev) ? ev : null;
}

// Build guard: an event without a readable end date would never come down.
if (education.events.featured && Number.isNaN(eventEndsAt(education.events.featured))) {
  throw new Error("education.events.featured.endsOn must be the event's last day as YYYY-MM-DD.");
}
