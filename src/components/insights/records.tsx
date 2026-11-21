import { site } from "@/content/site";
import type { Publication } from "@/content/insights";

/**
 * Whether a publication record appears on the page. Review mode shows every
 * record (tagged). At launch a record needs Dr. Joy's confirmation, its real
 * headline and, for articles, a link to the original.
 */
export function isShown(p: Publication) {
  if (site.showPlaceholders) return true;
  return p.verified && p.titleConfirmed !== false && (p.kind === "book" || Boolean(p.url));
}

/** Review-mode marker for a record Dr. Joy has not confirmed yet. Renders nothing at launch. */
export function ConfirmTag({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  if (!site.showPlaceholders) return null;
  return (
    <span
      className={`label inline-block rounded-full border px-2 py-0.5 !text-[9.5px] whitespace-nowrap ${
        tone === "dark" ? "border-white/30 text-white/70" : "border-ink/25 text-stone"
      } ${className}`}
    >
      To confirm
    </span>
  );
}
