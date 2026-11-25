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
 * One print in the workshop filmstrip. Sizes are in the strip's own unit
 * (a hundredth of the screen height on desktop, a little over a hundredth of
 * the screen width on phones), so the row always fits its stage.
 */
export type Print = {
  photo: PhotoSlot;
  /** Width divided by height, e.g. 4 / 5 for an upright print. */
  ratio: number;
  /** Height of the photograph. The tallest print should stay near 60. */
  height: number;
  /** How far the print sits below the top of the row. Keep drop + height under 68. */
  drop: number;
  /** Space before the print. Negative tucks it over (or under) the print before it. */
  gap: number;
  /** Which print lies on top where two overlap: the higher number. */
  layer: number;
  /** Depth: negative slides a little faster than the row (nearer), positive slower. Nearer prints lie on top. */
  drift: number;
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
      src: "/photos/education-room-g.jpg",
      alt: "Dr. Joy teaching a P3 workshop, participants at their tables",
      treatment: "color",
      direction: "Color photograph of an actual P3 workshop: instruments, coaching, participants. Keep the room in frame.",
      focus: "50% 18%",
      focusMobile: "50% 30%",
      original: "54707956526",
    } satisfies PhotoSlot,
    detail: {
      src: "/photos/education-hands-g.jpg",
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
      src: "/photos/education-annual-v2-g.jpg",
      alt: "Dr. Joy demonstrating a technique while participants work with their instrument kits",
      treatment: "color",
      direction: "The whole room at work: participants with instruments and kits on the tables.",
      focus: "45% 6%",
      original: "54707145282",
    } satisfies PhotoSlot,
  },

  /**
   * The workshop as a row of prints, between the P3 family and the attendee
   * voice. On desktop the row slides sideways as the visitor scrolls; on
   * phones it is a strip to swipe. No photograph here repeats elsewhere on
   * the page. Add, remove or reorder prints freely: the layout follows.
   */
  filmstrip: [
    {
      photo: {
        src: "/photos/education-strip-smile-g.jpg",
        alt: "A participant smiling, a micro-applicator in hand, at a P3 workshop table",
        treatment: "color",
        direction: "A participant mid-practice, instrument in hand.",
        focus: "50% 40%",
        original: "54708309585",
      },
      ratio: 4 / 5,
      height: 62,
      drop: 4,
      gap: 0,
      layer: 2,
      drift: -1,
    },
    {
      photo: {
        src: "/photos/education-strip-room-g.jpg",
        alt: "Dr. Joy teaching at the front of the room, seen from the back row of a P3 workshop",
        treatment: "color",
        direction: "The whole room from the back row, Dr. Joy at the front.",
        focus: "24% 50%",
        original: "54707125282",
      },
      ratio: 12 / 5,
      height: 32,
      drop: 36,
      gap: -5,
      layer: 1,
      drift: 3,
    },
    {
      photo: {
        src: "/photos/education-strip-kit-g.jpg",
        alt: "A participant studying a product pouch from her kit",
        treatment: "color",
        direction: "A participant working through her kit.",
        focus: "35% 45%",
        original: "54707976721",
      },
      ratio: 99 / 65,
      height: 40,
      drop: 0,
      gap: -7,
      layer: 3,
      drift: -3,
    },
    {
      photo: {
        src: "/photos/education-strip-raised-v2-g.jpg",
        alt: "Participants raising their hands at their tables",
        treatment: "color",
        direction: "The room answering a question: hands up at the tables.",
        focus: "50% 40%",
        original: "54708309770",
      },
      // A tight detail of a wide frame: the file is 480 px wide, all the original holds, so this print stays small.
      ratio: 4 / 5,
      height: 38,
      drop: 30,
      gap: -5,
      layer: 4,
      drift: -6,
    },
    {
      photo: {
        src: "/photos/education-strip-practice-g.jpg",
        alt: "A participant practicing with a micro-applicator while another looks up and smiles",
        treatment: "color",
        direction: "Participants practicing at their tables.",
        focus: "50% 45%",
        original: "54707977396",
      },
      ratio: 5 / 4,
      height: 42,
      drop: 3,
      gap: 4,
      layer: 2,
      drift: 1,
    },
  ] satisfies Print[],

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
      src: "/photos/education-session-g.jpg",
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
  return ev && isListed(ev) && now < eventEndsAt(ev) ? ev : null;
}

/** A featured event is listed only once its registration page is live (an https address). */
export function isListed(ev: Pick<FeaturedEvent, "registrationUrl">): boolean {
  return /^https:\/\//.test(ev.registrationUrl);
}

// Build guard: an event without a readable end date would never come down.
if (education.events.featured && Number.isNaN(eventEndsAt(education.events.featured))) {
  throw new Error("education.events.featured.endsOn must be the event's last day as YYYY-MM-DD.");
}
// Build guard: keep featured null until its registration page is live.
if (education.events.featured && !isListed(education.events.featured)) {
  throw new Error("education.events.featured.registrationUrl must be the live https landing page; keep featured null until it is.");
}
