import Image from "next/image";
import { site } from "@/content/site";
import { speaking } from "@/content/speaking";
import { InView } from "@/components/motion/InView";
import { Marquee } from "@/components/motion/Marquee";

/** Shown at launch only once the list is confirmed (or cleared logos exist). */
export function showSpokenAt() {
  const { logos, verified } = speaking.spokenAt;
  return logos.length > 0 || verified || site.showPlaceholders;
}

/** The venues in `count` rows of near-equal length, keeping their order. */
function rows<T>(items: T[], count: number): T[][] {
  const size = Math.ceil(items.length / count);
  return Array.from({ length: count }, (_, i) => items.slice(i * size, (i + 1) * size)).filter((r) => r.length > 0);
}

/**
 * Where I've Spoken. Until conference logos are cleared, the venues are set
 * as type only: a wall of names rather than a logo wall. Review mode tags the
 * list as unconfirmed.
 *
 * From tablet width the names travel in three rows of display serif, in
 * opposite directions, only as the visitor scrolls (Marquee; nothing moves on
 * its own), with a blush mark between names. That wall is decoration: the
 * real list sits beside it for assistive technology, and is what phones and
 * print show, one venue per line, so every name can be read whole. Without
 * JavaScript or with reduced motion the wall is a still, wrapped run of names.
 */
export function SpokenAt({ className = "" }: { className?: string }) {
  if (!showSpokenAt()) return null;
  const { heading, logos, verified, venues } = speaking.spokenAt;
  return (
    <section className={`grain overflow-x-clip bg-ivory pt-24 pb-24 md:pt-36 md:pb-36 ${className}`}>
      <InView className="mx-auto max-w-[90rem] px-5 md:px-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <h2 className="label text-stone">{heading}</h2>
          {!verified && site.showPlaceholders && (
            <p className="label inline-block border border-ink/25 px-2 py-1 !text-[0.5625rem] leading-relaxed text-stone">
              From Testimonials.pdf (partial listing): confirm before launch
            </p>
          )}
        </div>
        <span aria-hidden className="rule-draw mt-5 block h-px bg-ink/25" />
      </InView>

      {logos.length > 0 ? (
        <div className="mx-auto mt-12 max-w-[90rem] px-5 md:px-10">
          <ul className="flex flex-wrap items-center gap-x-12 gap-y-10">
            {logos.map((l) => (
              <li key={l.name} className="relative h-10 w-32">
                <Image src={l.src} alt={l.name} fill sizes="(max-width: 1440px) 128px, 8.9vw" className="object-contain grayscale" />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {/* The real list. Phones and print: one venue per line on hairline rules. From md it is read by assistive technology only. */}
          <InView className="mx-auto max-w-[90rem] px-5 md:sr-only print:not-sr-only print:px-10">
            <ul className="stagger font-serif text-[1.25rem] leading-snug tracking-[-0.005em] sm:columns-2 sm:gap-x-8 [--stagger:45ms]">
              {venues.map((v) => (
                <li key={v} className="break-inside-avoid border-b border-line py-2.5">
                  {v}
                </li>
              ))}
            </ul>
          </InView>

          {/* The wall of names (decorative copy of the list above). */}
          <div aria-hidden className="sp-wall mt-12 hidden md:block lg:mt-16 print:!hidden">
            {rows(venues, 3).map((row, r) => (
              <Marquee key={r} reverse={r % 2 === 1} travel={7} className="sp-wall-row">
                {row.map((v) => (
                  <span key={v} className="sp-wall-name">
                    {v}
                    <span className="sp-wall-mark" />
                  </span>
                ))}
              </Marquee>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
