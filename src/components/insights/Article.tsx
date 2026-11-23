import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { OriginalArticle } from "@/content/insights";
import { Label } from "@/components/ui/Links";
import { Reveal } from "@/components/ui/Reveal";
import { InView } from "@/components/motion/InView";
import { WordLight, WordRise } from "@/components/motion/Text";

/**
 * An original article by Dr. Joy, set for long reading: the title at display
 * scale, an excerpt as the standfirst, and a 66-character measure. Pull quotes
 * break out of the column; subheadings stay in it.
 *
 * Motion stays out of the way of reading: the title rises once on load, the
 * rule above the text draws, subheadings rise as they are reached, and a pull
 * quote brightens as it is read. Paragraphs never move.
 */
export function Article({ article, section }: { article: OriginalArticle; section: string }) {
  return (
    <article className="bg-paper pt-[4.75rem]">
      <header className="mx-auto max-w-[90rem] px-5 pt-12 md:px-10 md:pt-20">
        <Link href="/insights" className="group label inline-flex min-h-11 items-center gap-2 text-stone transition-colors duration-(--duration-hover) hover:text-ink">
          <ArrowLeft className="size-3.5 transition-transform duration-(--duration-ui) ease-expo group-hover:-translate-x-1" aria-hidden />
          <span className="link-draw pb-0.5">Insights</span>
        </Link>
        <div className="mt-10 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-10">
            <Label>{section}</Label>
            <h1 className="display mt-8 max-w-[16ch] text-[clamp(2.8rem,6vw,6.4rem)] leading-[0.94]">
              <WordRise immediate>{article.title}</WordRise>
            </h1>
          </div>
          <Reveal immediate delay={0.3} className="lg:col-span-7 lg:col-start-4">
            {article.date && <p className="label text-stone tabular-nums">{article.date}</p>}
            <p className="mt-6 font-serif text-[clamp(1.45rem,2.1vw,1.9rem)] leading-snug text-ink/80 italic">{article.excerpt}</p>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-[90rem] px-5 pt-16 pb-24 md:px-10 md:pt-20 md:pb-32 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-7 lg:col-start-4">
            <InView delay={0.35}>
              <span aria-hidden className="rule-draw block h-px bg-gold-deep" />
            </InView>
            <div className="article-body pt-10">
              {(article.body ?? []).map((block, i) =>
                typeof block === "string" ? (
                  <p key={i} className="mt-6 max-w-[66ch] text-[1.1875rem] leading-[1.7] first:mt-0">
                    {block}
                  </p>
                ) : "heading" in block ? (
                  <h2 key={i} className="display mt-16 text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.05]">
                    <WordRise>{block.heading}</WordRise>
                  </h2>
                ) : (
                  <InView key={i} as="blockquote" className="relative my-16 lg:-ml-[16%] lg:w-[125%]">
                    <p className="display relative text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.08] italic">
                      <span aria-hidden className="text-gold-deep md:absolute md:top-0 md:-left-[0.5em]">
                        “
                      </span>
                      <WordLight from={0.16} to={0.46} dim={0.5}>
                        {block.quote}
                      </WordLight>
                    </p>
                  </InView>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
