import Image from "next/image";
import { site } from "@/content/site";
import { speaking } from "@/content/speaking";
import { Reveal } from "@/components/ui/Reveal";

/** Shown at launch only once the list is confirmed (or cleared logos exist). */
export function showSpokenAt() {
  const { logos, verified } = speaking.spokenAt;
  return logos.length > 0 || verified || site.showPlaceholders;
}

/**
 * Where I've Spoken. Until conference logos are cleared, the venues are set
 * as one run of serif type, a credits roll rather than a logo wall. Review
 * mode tags the list as unconfirmed.
 */
export function SpokenAt({ className = "" }: { className?: string }) {
  if (!showSpokenAt()) return null;
  const { heading, logos, verified, venues } = speaking.spokenAt;
  return (
    <section className={`grain bg-ivory ${className}`}>
      <div className="mx-auto grid max-w-[90rem] gap-8 px-5 pt-24 md:px-10 md:pt-36 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-3">
          <h2 className="label text-stone">{heading}</h2>
          {!verified && site.showPlaceholders && (
            <p className="label mt-3 inline-block border border-ink/25 px-2 py-1 !text-[0.5625rem] leading-relaxed text-stone">
              From Testimonials.pdf (partial listing): confirm before launch
            </p>
          )}
        </div>
        <Reveal className="lg:col-span-9">
          {logos.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-10">
              {logos.map((l) => (
                <li key={l.name} className="relative h-10 w-32">
                  <Image src={l.src} alt={l.name} fill sizes="(max-width: 1440px) 128px, 8.9vw" className="object-contain grayscale" />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="font-serif text-[clamp(1.4rem,2.3vw,2.07rem)] leading-[1.32] tracking-[-0.005em] [text-wrap:pretty] max-sm:border-t max-sm:border-line max-sm:text-[1.25rem] max-sm:leading-snug">
              {venues.map((v, i) => (
                // Phones: one venue per line on hairline rules, so every name
                // reads whole. From sm up each name stays on one line with its
                // separator; the space after it is where lines may break.
                <li key={v} className="max-sm:border-b max-sm:border-line max-sm:py-2.5 sm:inline">
                  <span className="sm:whitespace-nowrap">
                    {v}
                    {i < venues.length - 1 && (
                      <span aria-hidden className="relative -top-[0.32em] ml-[0.4em] text-[0.42em] text-blush-deep max-sm:hidden">
                        ●
                      </span>
                    )}
                  </span>{" "}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
