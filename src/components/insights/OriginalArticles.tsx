import type { CSSProperties } from "react";
import { ArrowLink, ReviewSlot } from "@/components/ui/Links";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { typeset } from "@/components/ui/Typeset";
import type { OriginalArticle } from "@/content/insights";
import { articleHref } from "./records";

type Vars = CSSProperties & Record<`--${string}`, string>;

/** Two pieces side by side from lg, four columns each: the second stands lower, so it arrives after the first. */
const offset = ["", "lg:mt-24"];

/**
 * From Dr. Joy: her original writing. Hidden at launch until the articles
 * exist; in review mode two labelled slots hold their place. The heading
 * holds the left of the page column, as in the published index below it; the
 * two pieces share the right two thirds, each under a thin line with its
 * date, title, excerpt and the way in (one under the other below lg).
 *
 * Each piece arrives on its own as it is reached: its line draws from the
 * left and the piece rises. A piece is one object: on hover or focus a soft
 * wash rises behind it, the title leans in and the arrow travels. The whole
 * piece is the link.
 */
export function OriginalArticles({ heading, cta, articles }: { heading: string; cta: string; articles: OriginalArticle[] }) {
  const shown = articles.slice(0, 2);
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <h2 className="display t-h1 lg:col-span-4">
          <WordRise>{heading}</WordRise>
        </h2>
        <div className="mt-10 grid max-w-[38rem] grid-cols-1 gap-y-8 md:mt-12 lg:col-span-8 lg:col-start-5 lg:mt-2 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-x-6">
          {shown.length > 0
            ? shown.map((a, i) => (
                <InView key={a.title} as="article" className={`group relative py-7 ${offset[i]}`}>
                  <span aria-hidden className="rule-draw absolute inset-x-0 top-0 block h-px bg-line" />
                  <span aria-hidden className="rule-over" />
                  <div className="rise" style={{ "--d": "0.12s" } as Vars}>
                    {a.date && <p className="label text-stone tabular-nums">{a.date}</p>}
                    <h3 className={`lean display t-h2 ${a.date ? "mt-4" : ""}`}>{typeset(a.title)}</h3>
                    <p className="t-body mt-4 text-stone">{a.excerpt}</p>
                    <ArrowLink href={articleHref(a)} className="mt-4 after:absolute after:inset-0">
                      {cta}
                    </ArrowLink>
                  </div>
                </InView>
              ))
            : offset.map((drop, i) => (
                <InView key={i} className={`rise ${drop}`}>
                  <ReviewSlot className="min-h-40">Original article {i + 1}: title, summary or excerpt, and link</ReviewSlot>
                </InView>
              ))}
        </div>
      </div>
    </section>
  );
}
