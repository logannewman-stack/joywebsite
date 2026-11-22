import { useId, type CSSProperties } from "react";
import Link from "next/link";
import { InView, Magnetic } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { ArrowCircle } from "@/components/industry/ArrowCircle";
import { ConfirmTag } from "./records";

type Vars = CSSProperties & Record<`--${string}`, string>;

/** Headline sizes: phone, tablet and the two-column spread (the spread's line is 8 of 12 columns). */
const scale = {
  short: "text-[clamp(2.4rem,13vw,5rem)] md:text-[clamp(4.5rem,10.4vw,6.5rem)] lg:text-[clamp(5rem,9.2vw,8.5rem)]",
  long: "text-[clamp(2.2rem,9vw,3.6rem)] md:text-[clamp(3.2rem,6.6vw,4.4rem)] lg:text-[clamp(3.4rem,5.4vw,5.2rem)]",
};

export type FeatureItem = {
  title: string;
  subtitle?: string;
  publication?: string;
  date?: string;
  excerpt?: string;
  href: string;
  /** Opens the original at the publisher in a new tab. */
  external: boolean;
  verified: boolean;
};

/**
 * The single strongest article, set as the page's cover story: a white sheet
 * on ivory with the publication as its masthead, the headline at cover scale
 * and one way in. The whole sheet is the link (its hit area is stretched over
 * the card) and answers as one object on hover and focus: an ink rule draws
 * over the gold one under the masthead, the headline leans in, and the arrow
 * circle (a gold ring at rest) fills, leans toward the pointer and sends its
 * arrow out. Type only: no cover art
 * is invented for the publisher.
 *
 * `heading` and `intro` are the approved heading and line of the feature's own
 * section. The page passes them when the feature is the only piece of its kind
 * (so that section's list is not on the page): the cover story then stands
 * under its section heading, and its headline steps down to an h3.
 */
export function Feature({ item, cta, heading, intro }: { item: FeatureItem; cta: string; heading?: string; intro?: string }) {
  const id = useId();
  const Title = heading ? "h3" : "h2";
  // A long headline steps down a size so it still reads as one cover line group.
  const long = item.title.length > 40;
  const linkClass =
    "rise mt-10 inline-flex items-center gap-5 text-[1.0625rem] font-medium after:absolute after:inset-0 focus-visible:outline-none md:mt-0 md:gap-6 lg:mt-12 lg:self-end";
  const linkStyle = { "--d": "0.2s" } as Vars;
  const linkInner = (
    <>
      <span className="link-draw pb-0.5">{cta}</span>
      <Magnetic strength={0.28} className="relative z-10">
        <ArrowCircle direction={item.external ? "up-right" : "right"} className="size-16 md:size-20 lg:size-24" iconClassName="size-6 lg:size-7" />
      </Magnetic>
    </>
  );
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-10 md:py-28 lg:py-32">
        {heading && (
          <div className="mb-12 md:mb-16 lg:mb-20">
            <h2 className="display text-[clamp(2.6rem,4.6vw,4.4rem)]">
              <WordRise>{heading}</WordRise>
            </h2>
            {intro && (
              <InView>
                <p className="rise mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-stone" style={{ "--d": "0.12s" } as Vars}>
                  {intro}
                </p>
              </InView>
            )}
          </div>
        )}
        <article className="cover group relative bg-paper px-6 pt-7 pb-8 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-ink md:px-12 md:pt-10 md:pb-12 lg:px-16 lg:pt-12 lg:pb-16">
          {/* Masthead: the publication, the issue date, and in review the confirm tag */}
          <InView as="header" className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-6 md:pb-8">
            {/* One of her own pieces has no publication: its date leads the masthead instead. */}
            {item.publication && <p className="rise font-serif text-[clamp(1.6rem,2.3vw,2.25rem)] leading-tight italic">{item.publication}</p>}
            <div className="rise flex flex-wrap items-center gap-3" style={{ "--d": "0.08s" } as Vars}>
              {item.date && <p className="label text-stone tabular-nums">{item.date}</p>}
              {!item.verified && <ConfirmTag />}
            </div>
            <span aria-hidden className="rule-draw absolute inset-x-0 bottom-0 h-px bg-gold-deep" />
            <span aria-hidden className="rule-over" />
          </InView>

          {/* The headline at cover scale; from lg the standfirst and the way in stand beside it like a spread */}
          <div className="mt-10 md:mt-14 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-6">
            <Title id={`${id}-title`} className={`cover-title display leading-[0.92] lg:col-span-8 ${long ? scale.long : scale.short}`}>
              <WordRise>{item.title}</WordRise>
            </Title>

            <InView className="mt-6 md:mt-10 md:flex md:items-end md:justify-between md:gap-10 lg:col-span-4 lg:mt-0 lg:flex-col lg:items-stretch lg:pt-3">
              <div>
                {item.subtitle && (
                  <p className="rise max-w-[34ch] font-serif text-[clamp(1.35rem,1.9vw,1.8rem)] leading-snug text-stone italic">{item.subtitle}</p>
                )}
                {item.excerpt && (
                  <p className="rise mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-stone" style={{ "--d": "0.08s" } as Vars}>
                    {item.excerpt}
                  </p>
                )}
              </div>
              {/* The link is named by the headline and its own label: "… Read Article". */}
              {item.external ? (
                <a
                  id={`${id}-link`}
                  aria-labelledby={`${id}-title ${id}-link`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  style={linkStyle}
                >
                  {linkInner}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link id={`${id}-link`} aria-labelledby={`${id}-title ${id}-link`} href={item.href} className={linkClass} style={linkStyle}>
                  {linkInner}
                </Link>
              )}
            </InView>
          </div>
        </article>
      </div>
    </section>
  );
}
