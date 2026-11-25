import Image from "next/image";
import { site } from "@/content/site";

/**
 * The Dr. Joy script wordmark. Uses the supplied artwork when its path is set
 * in content/site.ts. Until then, a plain typographic stand-in holds the
 * space. The stand-in is deliberately not a logo design.
 *
 * The header mark is above the fold, so it loads eagerly by default (without
 * a preload, which would be sent for every copy on the page). Pass
 * loading="lazy" for copies further down, such as the footer.
 */
export function Wordmark({
  tone = "light",
  className = "",
  loading = "eager",
}: {
  tone?: "light" | "dark";
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const src = tone === "dark" ? site.wordmark.onDark : site.wordmark.onLight;
  if (src) {
    return (
      <Image
        src={src}
        alt={site.name}
        width={site.wordmark.width}
        height={site.wordmark.height}
        loading={loading}
        unoptimized
        className={`h-[2.75rem] w-auto md:h-[3.25rem] ${className}`}
      />
    );
  }
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 whitespace-nowrap ${tone === "dark" ? "text-white" : "text-ink"} ${className}`}
      data-wordmark-placeholder
      title="Wordmark placeholder: replace with the Dr. Joy script wordmark"
    >
      <span className="display text-[1.5rem] leading-none">Dr. Joy</span>
      <span className="label !text-[0.625rem] !tracking-[0.22em]">RDH</span>
    </span>
  );
}
