import { useId, type CSSProperties } from "react";
import Link from "next/link";
import { InView, Magnetic } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { ArrowCircle } from "@/components/industry/ArrowCircle";
import { ConfirmTag } from "./records";

type Vars = CSSProperties & Record<`--${string}`, string>;

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
 * The single strongest article, set apart as the page's feature: one block in
 * a thin frame, the width of the page column. The publication and the date
 * head it, the headline is set as a section heading, and the rest of the
 * headline and the way in stand beside it. Type only: no cover art is
 * invented for the publisher.
 *
 * It arrives in one sequence the first time it is seen: the frame draws in
 * from the left, the publication and the date rise, the headline rises word
 * by word, then the rest of the headline and the way in.
 *
 * The whole block is the link (its hit area is stretched over the frame) and
 * answers as one object on hover and focus: the frame darkens, a soft wash
 * rises inside it, the headline leans in, the link's underline draws, and
 * the arrow circle fills, leans toward the pointer and sends its arrow out.
 *
 * The block runs on from the opening (no line between them): the frame is
 * its own edge.
 *
 * `heading` and `intro` are the approved heading and line of the feature's own
 * section. The page passes them when the feature is the only piece of its kind
 * (so that section's list is not on the page): the feature then stands under
 * its section heading, and its headline steps down to an h3, one size smaller.
 *
 * The frame has no side padding of its own: its parts carry it, so from lg the
 * block is laid on the page's twelve columns and its right-hand part starts on
 * the same column as the opening portrait above it.
 */
export function Feature({ item, cta, heading, intro }: { item: FeatureItem; cta: string; heading?: string; intro?: string }) {
  const id = useId();
  const Title = heading ? "h3" : "h2";
  const linkClass = "rise mt-8 inline-flex items-center gap-4 text-[0.9375rem] font-medium after:absolute after:inset-0 focus-visible:outline-none";
  const linkStyle = { "--d": "0.46s" } as Vars;
  const linkInner = (
    <>
      <span className="link-draw pb-0.5">{cta}</span>
      {/* Above the link's stretched hit area, so the circle itself feels the pointer. */}
      <Magnetic strength={0.28} className="relative z-10">
        <ArrowCircle direction={item.external ? "up-right" : "right"} className="size-11" iconClassName="size-4" />
      </Magnetic>
    </>
  );
  return (
    <section className={`bg-paper ${heading ? "" : "no-rule"}`}>
      <div className={`mx-auto max-w-(--wrap) px-5 pb-20 md:px-10 md:pb-28 ${heading ? "pt-20 md:pt-28" : ""}`}>
        {heading && (
          <div className="mb-10 md:mb-14">
            <h2 className="display t-h1">
              <WordRise>{heading}</WordRise>
            </h2>
            {intro && (
              <InView>
                <p className="rise t-body mt-5 max-w-[22rem] text-stone" style={{ "--d": "0.12s" } as Vars}>
                  {intro}
                </p>
              </InView>
            )}
          </div>
        )}
        <InView
          as="article"
          className="cover group relative py-8 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-ink md:py-10 lg:py-12"
        >
          {/* The frame: the outer span draws it in, the inner one is the line and darkens with the block. */}
          <span aria-hidden className="wipe pointer-events-none absolute inset-0">
            <span className="absolute inset-0 border border-line transition-colors duration-(--duration-ui) group-hover:border-ink group-has-[a:focus-visible]:border-ink" />
          </span>
          <span aria-hidden className="rule-over" />

          {/* The publication, the issue date, and in review the confirm tag */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 md:px-10 lg:px-12">
            {/* One of her own pieces has no publication: its date stands alone. */}
            {item.publication && <p className="rise text-[0.9375rem] font-medium">{item.publication}</p>}
            {item.date && (
              <p className="rise label text-stone tabular-nums" style={{ "--d": "0.08s" } as Vars}>
                {item.date}
              </p>
            )}
            {!item.verified && <ConfirmTag className="ml-auto" />}
          </div>

          {/* The headline; from lg the rest of the headline and the way in stand beside it */}
          <div className="mt-6 md:mt-8 lg:grid lg:grid-cols-12 lg:gap-x-6">
            <Title id={`${id}-title`} className={`cover-title display px-6 md:px-10 lg:col-span-8 lg:pr-0 lg:pl-12 ${heading ? "t-h2" : "t-h1"}`}>
              <WordRise delay={0.14}>{item.title}</WordRise>
            </Title>

            <div className="mt-5 px-6 md:px-10 lg:col-span-4 lg:col-start-9 lg:mt-1 lg:pr-12 lg:pl-0">
              <div className="flex flex-col gap-3 text-stone">
                {item.subtitle && (
                  <p className="rise t-lead max-w-[24rem]" style={{ "--d": "0.3s" } as Vars}>
                    {item.subtitle}
                  </p>
                )}
                {item.excerpt && (
                  <p className="rise t-body max-w-[32rem]" style={{ "--d": "0.38s" } as Vars}>
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
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
