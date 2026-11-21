import type { CSSProperties } from "react";
import { ArrowLink, ReviewSlot } from "@/components/ui/Links";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { typeset } from "@/components/ui/Typeset";
import type { OriginalArticle } from "@/content/insights";
import { articleHref } from "./records";

type Vars = CSSProperties & Record<`--${string}`, string>;

/** Two pieces, set asymmetrically: the lead wide on the margin, the second narrower and lower. */
const geometry = [
  { box: "lg:col-span-7", title: "text-[clamp(2.4rem,4vw,3.8rem)]", slot: "min-h-56 lg:min-h-[22rem]" },
  { box: "lg:col-span-4 lg:col-start-9 lg:mt-40", title: "text-[clamp(2rem,2.8vw,2.6rem)]", slot: "min-h-44 lg:min-h-64" },
];

/**
 * From Dr. Joy: her original writing. Hidden at launch until the articles
 * exist; in review mode the slots hold the real composition. Each piece is
 * one object: its rule draws in, and on hover or focus an ink rule draws over
 * it, the title leans in and the arrow travels. The whole piece is the link.
 */
export function OriginalArticles({ heading, cta, articles }: { heading: string; cta: string; articles: OriginalArticle[] }) {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-28 lg:pt-36 lg:pb-32">
        <h2 className="display text-[clamp(2.6rem,5vw,4.8rem)]">
          <WordRise>{heading}</WordRise>
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-y-14 md:mt-16 lg:grid-cols-12 lg:gap-x-6">
          {(articles.length > 0 ? articles.slice(0, 2) : geometry).map((entry, i) => {
            const a = articles.length > 0 ? (entry as OriginalArticle) : null;
            const g = geometry[i];
            return (
              <InView key={i} as={a ? "article" : "div"} className={`relative pt-8 ${a ? "group" : ""} ${g.box}`}>
                <span aria-hidden className="rule-draw absolute inset-x-0 top-0 h-px bg-gold-deep" />
                {a && <span aria-hidden className="rule-over rule-over-top" />}
                <div className="rise" style={{ "--d": "0.12s" } as Vars}>
                  <p className="label flex items-center gap-3 text-stone tabular-nums">
                    <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                    {a?.date && (
                      <>
                        <span aria-hidden className="h-px w-8 bg-gold-deep" />
                        {a.date}
                      </>
                    )}
                  </p>
                  {a ? (
                    <>
                      <h3 className={`lean display mt-6 leading-[1] ${g.title}`}>{typeset(a.title)}</h3>
                      <p className="mt-5 max-w-[52ch] text-[1.03125rem] leading-relaxed text-stone">{a.excerpt}</p>
                      <ArrowLink href={articleHref(a)} className="mt-6 after:absolute after:inset-0">
                        {cta}
                      </ArrowLink>
                    </>
                  ) : (
                    <ReviewSlot className={`mt-6 ${g.slot}`}>Original article {i + 1}: title, summary or excerpt, and link</ReviewSlot>
                  )}
                </div>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
