// TEMPORARY layout check only. Deleted before hand-off.
import type { OriginalArticle } from "@/content/insights";

const para =
  "Placeholder paragraph for a layout check. It runs to about the length of a real paragraph in a clinical article, so the measure, the line height and the space between paragraphs can be judged at reading size on a desktop screen and on a phone.";

export const MOCK: OriginalArticle[] = [
  {
    title: "Placeholder title for a featured original article",
    excerpt: "Placeholder excerpt: two sentences that say what the article covers. It is long enough to wrap onto a second and third line.",
    href: "/insights/mock-one",
    date: "November 2026",
    feature: true,
    slug: "mock-one",
    body: [para, para, { heading: "A placeholder subheading inside the article" }, para, { quote: "A placeholder pull quote, one sentence long, set as a heading line inside the column." }, para, para],
  },
  {
    title: "Second placeholder article title",
    excerpt: "Placeholder excerpt: two sentences that say what the article covers. It is long enough to wrap onto a second line.",
    href: "https://example.com/a",
    date: "October 2026",
  },
  {
    title: "Third placeholder title, a little longer than the second one",
    excerpt: "Placeholder excerpt for the third piece, which lives elsewhere and opens in a new tab.",
    href: "https://example.com/b",
  },
];
