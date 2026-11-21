import type { PhotoSlot } from "./site";

/**
 * A piece of Dr. Joy's published work.
 *
 * `url` always points to the original at the publisher (never republished here).
 * `verified` turns true once Dr. Joy confirms the title, byline, date, URL and any
 * thumbnail permission. At launch (site.showPlaceholders = false) only verified
 * records with a URL appear; in review mode every record shows, with a tag.
 */
export type Publication = {
  title: string;
  /** The rest of the headline as the publisher printed it. */
  subtitle?: string;
  publication: string;
  date: string;
  url: string;
  verified: boolean;
  /** "book" = a contribution to a book, listed under Published Work, never as an article. */
  kind?: "article" | "book";
  /** False while `title` is only a working description, not the real headline. Never shown at launch. */
  titleConfirmed?: boolean;
  /** The single strongest piece, set as the feature at the top of the page. One record only. */
  feature?: boolean;
  /** For the review only (where the record was found, what to check). Never rendered. */
  note?: string;
};

/** One block of an original article: a paragraph, a subheading or a pull quote. */
export type ArticleBlock = string | { heading: string } | { quote: string };

/**
 * One of Dr. Joy's original articles. To publish it on this site, give it a
 * `slug` and its full `body`: it then lives at /insights/<slug> and `href`
 * should be that path. If it lives elsewhere (e.g. LinkedIn), leave out the
 * body and set `href` to the full URL; it opens in a new tab.
 */
export type OriginalArticle = {
  title: string;
  excerpt: string;
  href: string;
  date?: string;
  /** The single strongest piece, set as the feature at the top of the page. One article only. */
  feature?: boolean;
  slug?: string;
  body?: ArticleBlock[];
};

/** INSIGHTS: approved working structure. */
export const insights = {
  hero: {
    heading: "The conversation doesn’t end when the presentation does.",
    // A no-break space keeps "I am" together, so no line ends on a lone "I".
    text: "Published articles, clinical perspectives, and what I am seeing across the profession.",
    photo: {
      src: "/photos/insights-hero-142.jpg",
      srcBw: "/photos/insights-hero-142-bw.jpg",
      alt: "Dr. Joy in a black blazer, smiling with her eyes lowered",
      treatment: "bw",
      direction: "Quiet editorial imagery. Original photography preferred.",
      focus: "50% 40%",
      original: "JVH-142",
    } satisfies PhotoSlot,
  },

  /** A quiet editorial transition: the conversation after a session. */
  band: {
    src: "/photos/insights-conversation.jpg",
    alt: "Dr. Joy, in a white blazer, talking with attendees in their seats after a session",
    treatment: "color",
    direction: "Quiet editorial transition: Dr. Joy with attendees after a presentation.",
    // Wide crop keeps her face and the attendee's hand; the phone crop follows her.
    focus: "50% 8%",
    focusMobile: "78% 50%",
    original: "54708147463",
  } satisfies PhotoSlot,

  original: {
    heading: "From Dr. Joy",
    /** Two original articles. Empty = section hidden at launch. */
    articles: [] as OriginalArticle[],
    cta: "Read Article",
  },

  published: {
    heading: "Published Articles",
    intro: "My work in dental publications. Each links to the original.",
    /** Heading for book contributions (the brief's "Published Work" treatment). */
    booksHeading: "Published Work",
    /**
     * Candidate records from the working project history. Three were found online
     * on 21 Nov 2026 with Dr. Joy's byline (see `note`); Dr. Joy confirms each one
     * and sets `verified: true` before launch.
     */
    articles: [
      {
        title: "Perfectly Placed, Perfectly Sealed",
        subtitle: "10 best practices in dental sealant application",
        publication: "RDH Magazine",
        date: "March 2025",
        url: "https://www.rdhmag.com/patient-care/sealants/article/55260486/perfectly-placed-perfectly-sealed-10-best-practices-in-dental-sealant-application",
        verified: false,
        feature: true,
        note: "Found on rdhmag.com: byline Joy D. Void-Holmes, DHSc, BSDH, RDH; posted March 4, 2025; in the March 2025 print edition.",
      },
      {
        title: "Uniting through Diversity",
        publication: "Journal of Dental Hygiene",
        date: "April 2021",
        url: "https://jdh.adha.org/content/95/2/4",
        verified: false,
        note: "Found on jdh.adha.org: guest editorial by Joy D. Void-Holmes, Vol. 95, Issue 2, pp. 4–5.",
      },
      {
        title: "Silver Diamine Fluoride in Adult Dentistry",
        publication: "Hygienetown",
        date: "",
        url: "https://www.hygienetown.com/content/article/9830/silver-diamine-fluoride-in-adult-dentistry",
        verified: false,
        note: "The brief lists Dentaltown; the article was found on Hygienetown (Dentaltown's sister magazine for hygienists), byline Dr. Joy Void-Holmes. No issue date shown on the page.",
      },
      {
        title: "Crest + Oral-B article",
        publication: "dentalcare.com",
        date: "",
        url: "",
        verified: false,
        titleConfirmed: false,
        note: "Not found online. dentalcare.com has Dr. Joy's speaker profile but no article. Needs the real headline and URL.",
      },
      {
        title: "The Full Arch Edge",
        publication: "Book contribution",
        date: "",
        url: "",
        verified: false,
        kind: "book",
        note: "Not found online. Confirm the title, publisher and year.",
      },
      {
        title: "Raving Patients Supercharged",
        publication: "Book contribution",
        date: "",
        url: "",
        verified: false,
        kind: "book",
        note: "Not found online (only the earlier book Raving Patients by Dr. Len Tau). Confirm the title, publisher and year.",
      },
    ] as Publication[],
    cta: "Read Article",
  },

  newsletter: {
    heading: "Stay Connected",
    name: "From Dr. Joy",
    text: "A monthly email with clinical perspectives, upcoming education, and news from my work.",
    cta: "Subscribe",
  },
};
