import Image from "next/image";
import { site } from "@/content/site";

/**
 * The Dr. Joy script wordmark. Uses the supplied artwork when its path is set
 * in content/site.ts. Until then, a plain typographic stand-in holds the
 * space. The stand-in is deliberately not a logo design.
 */
export function Wordmark({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const src = tone === "dark" ? site.wordmark.onDark : site.wordmark.onLight;
  if (src) {
    return (
      <Image
        src={src}
        alt={site.name}
        width={site.wordmark.width}
        height={site.wordmark.height}
        priority
        unoptimized
        className={`h-[44px] w-auto md:h-[52px] ${className}`}
      />
    );
  }
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 whitespace-nowrap ${tone === "dark" ? "text-white" : "text-ink"} ${className}`}
      data-wordmark-placeholder
      title="Wordmark placeholder: replace with the Dr. Joy script wordmark"
    >
      <span className="font-serif text-[27px] leading-none italic">Dr. Joy</span>
      <span className="label !text-[10px] !tracking-[0.22em]">RDH</span>
    </span>
  );
}
