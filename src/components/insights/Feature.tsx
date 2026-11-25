import { useId, type CSSProperties } from "react";
import Link from "next/link";
import { InView } from "@/components/motion/InView";
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
 * headline and the way in stand beside it. The whole block is the link (its
 * hit area is stretched over the frame) and answers as one object on hover
 * and focus: the frame darkens, the headline leans in and the arrow circle
 * fills and sends its arrow out. Type only: no cover art is invented for the
 * publisher.
 *
 * The block runs on from the opening (no line between them): the frame is
 * its own edge.
 *
 * `heading` and `intro` are the approved heading and line of the feature's own
 * section. The page passes them when the feature is the only piece of its kind
 * (so that section's list is not on the page): the feature then stands under
 * its section heading, and its headline steps down to an h3, one size smaller.
 */
export function Feature({ item, cta, heading, intro }: { item: FeatureItem; cta: string; heading?: string; intro?: string }) {
  const id = useId();
  const Title = heading ? "h3" : "h2";
  const linkClass = "mt-8 inline-flex items-center gap-4 text-[0.9375rem] font-medium after:absolute after:inset-0 focus-visible:outline-none";
  const linkInner = (
    <>
      <span className="link-draw pb-0.5">{cta}</span>
      <ArrowCircle direction={item.external ? "up-right" : "right"} className="size-11" iconClassName="size-4" />
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
        <InView className="rise">
          <article className="group relative border border-line px-6 py-8 transition-colors duration-(--duration-ui) hover:border-ink has-[a:focus-visible]:border-ink has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-ink md:px-10 md:py-10 lg:px-12 lg:py-12">
            {/* The publication, the issue date, and in review the confirm tag */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* One of her own pieces has no publication: its date stands alone. */}
              {item.publication && <p className="text-[0.9375rem] font-medium">{item.publication}</p>}
              {item.date && <p className="label text-stone tabular-nums">{item.date}</p>}
              {!item.verified && <ConfirmTag className="ml-auto" />}
            </div>

            {/* The headline; from lg the rest of the headline and the way in stand beside it */}
            <div className="mt-6 md:mt-8 lg:grid lg:grid-cols-12 lg:gap-x-6">
              <Title id={`${id}-title`} className={`lean display lg:col-span-7 ${heading ? "t-h2" : "t-h1"}`}>
                <WordRise>{item.title}</WordRise>
              </Title>

              <div className="mt-5 lg:col-span-4 lg:col-start-9 lg:mt-1">
                <div className="flex flex-col gap-3 text-stone">
                  {item.subtitle && <p className="t-lead max-w-[24rem]">{item.subtitle}</p>}
                  {item.excerpt && <p className="t-body max-w-[32rem]">{item.excerpt}</p>}
                </div>
                {/* The link is named by the headline and its own label: "… Read Article". */}
                {item.external ? (
                  <a id={`${id}-link`} aria-labelledby={`${id}-title ${id}-link`} href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {linkInner}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link id={`${id}-link`} aria-labelledby={`${id}-title ${id}-link`} href={item.href} className={linkClass}>
                    {linkInner}
                  </Link>
                )}
              </div>
            </div>
          </article>
        </InView>
      </div>
    </section>
  );
}
