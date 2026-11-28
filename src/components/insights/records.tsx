import { notes, site } from "@/content/site";
import type { OriginalArticle, Publication } from "@/content/insights";

/**
 * Whether a publication record appears on the page. Review mode shows every
 * record found, so Dr. Joy can confirm it; one that only stands in for a record
 * not yet found (no real headline) shows only with review notes on. At launch a
 * record needs Dr. Joy's confirmation, its real headline and, for articles, a
 * link to the original.
 */
export function isShown(p: Publication) {
  if (site.showPlaceholders) return notes || p.titleConfirmed !== false;
  return p.verified && p.titleConfirmed !== false && (p.kind === "book" || Boolean(p.url));
}

/** Where an original article's Read Article goes: its page here when it has a body, else its own href. */
export function articleHref(a: OriginalArticle) {
  return a.slug && a.body && a.body.length > 0 ? `/insights/${a.slug}` : a.href;
}

/** Review-mode marker for a record Dr. Joy has not confirmed yet. Renders nothing at launch. */
export function ConfirmTag({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  if (!notes) return null;
  return (
    <span
      className={`label inline-block rounded-full border px-2 py-0.5 !text-[0.59375rem] whitespace-nowrap ${
        tone === "dark" ? "border-white/30 text-white/70" : "border-ink/25 text-stone"
      } ${className}`}
    >
      To confirm
    </span>
  );
}
