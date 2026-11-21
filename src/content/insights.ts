import type { PhotoSlot } from "./site";

/** INSIGHTS: approved working structure. */
export const insights = {
  hero: {
    heading: "The conversation doesn’t end when the presentation does.",
    text: "Published articles, clinical perspectives, and what I am seeing across the profession.",
    photo: {
      src: "/photos/insights-hero.jpg",
      srcBw: "/photos/insights-hero-bw.jpg",
      alt: "Dr. Joy in a reflective moment",
      treatment: "bw",
      direction: "Quiet editorial imagery. Original photography preferred.",
      focus: "50% 35%",
      original: "JVH-133",
    } satisfies PhotoSlot,
  },

  original: {
    heading: "From Dr. Joy",
    /** Two original articles. Empty = section hidden at launch. */
    articles: [] as { title: string; excerpt: string; href: string; date?: string }[],
    cta: "Read Article",
  },

  published: {
    heading: "Published Articles",
    intro: "My work in dental publications. Each links to the original.",
    /**
     * Candidate records from the working project history. NOT verified.
     * An item only links once `url` is confirmed; unconfirmed items show only
     * in review mode.
     */
    articles: [
      { title: "Perfectly Placed, Perfectly Sealed", publication: "RDH Magazine", date: "March 2025", url: "" },
      { title: "Uniting through Diversity", publication: "Journal of Dental Hygiene", date: "April 2021", url: "" },
      { title: "Silver Diamine Fluoride in Adult Dentistry", publication: "Dentaltown", date: "", url: "" },
      { title: "Crest + Oral-B article", publication: "dentalcare.com", date: "", url: "" },
      { title: "Contribution to The Full Arch Edge", publication: "Book contribution", date: "", url: "" },
      { title: "Contribution to Raving Patients Supercharged", publication: "Book contribution", date: "", url: "" },
    ],
    cta: "Read Article",
  },

  newsletter: {
    heading: "Stay Connected",
    name: "From Dr. Joy",
    text: "A monthly email with clinical perspectives, upcoming education, and news from my work.",
    cta: "Subscribe",
  },
};
