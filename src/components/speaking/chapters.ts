import { speaking } from "@/content/speaking";

/**
 * The page's four chapters: the approved headings, in page order. Used by the
 * "On this page" list in the opening and by the chapter bar.
 */
export const chapters = [
  { href: "#topics", label: speaking.clinical.heading },
  { href: "#teams", label: speaking.teams.heading },
  { href: "#keynotes", label: speaking.keynotes.heading },
  { href: "#p3", label: speaking.p3.heading },
] as const;
