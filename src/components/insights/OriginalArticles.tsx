import type { CSSProperties } from "react";
import { ArrowLink, ReviewSlot } from "@/components/ui/Links";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { typeset } from "@/components/ui/Typeset";
import type { OriginalArticle } from "@/content/insights";
import { articleHref } from "./records";

type Vars = CSSProperties & Record<`--${string}`, string>;

/**
 * From Dr. Joy: her original writing. Hidden at launch until the articles
 * exist; in review mode two labelled slots hold their place. It is set like
 * the published index below it: the heading on the left of the page column,
 * the pieces on the right two thirds, each between thin lines with its date,
 * title, excerpt and the way in. A piece is one object: on hover or focus a
 * soft wash rises behind it, the title leans in and the arrow travels. The
 * whole piece is the link.
 */
export function OriginalArticles({ heading, cta, articles }: { heading: string; cta: string; articles: OriginalArticle[] }) {
  const shown = articles.slice(0, 2);
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <h2 className="display t-h1 lg:col-span-4">
          <WordRise>{heading}</WordRise>
        </h2>
        <div className="mt-10 md:mt-12 lg:col-span-8 lg:col-start-5 lg:mt-2">
          {shown.length > 0
            ? shown.map((a, i) => (
                <InView key={a.title} as="article" className="group relative border-t border-line py-7 last:border-b md:py-9">
                  <span aria-hidden className="rule-over" />
                  <div className="rise" style={{ "--d": `${i * 0.08}s` } as Vars}>
                    {a.date && <p className="label text-stone tabular-nums">{a.date}</p>}
                    <h3 className={`lean display t-h2 max-w-[38rem] ${a.date ? "mt-4" : ""}`}>{typeset(a.title)}</h3>
                    <p className="t-body mt-4 max-w-[38rem] text-stone">{a.excerpt}</p>
                    <ArrowLink href={articleHref(a)} className="mt-4 after:absolute after:inset-0">
                      {cta}
                    </ArrowLink>
                  </div>
                </InView>
              ))
            : [1, 2].map((n) => (
                <ReviewSlot key={n} className={n > 1 ? "mt-6 min-h-40" : "min-h-40"}>
                  Original article {n}: title, summary or excerpt, and link
                </ReviewSlot>
              ))}
        </div>
      </div>
    </section>
  );
}
