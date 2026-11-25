import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { OriginalArticle } from "@/content/insights";
import { Label } from "@/components/ui/Links";
import { Reveal } from "@/components/ui/Reveal";
import { InView } from "@/components/motion/InView";
import { WordLight, WordRise } from "@/components/motion/Text";

/**
 * An original article by Dr. Joy, set for long reading: the title as the
 * page's heading, the excerpt as the standfirst in grey, and the text in one
 * column of about 38rem that starts on the same edge as the standfirst.
 * Subheadings and pull quotes stay in that column; a pull quote is a heading
 * line behind a thin black rule.
 *
 * Motion stays out of the way of reading: the title rises once on load,
 * subheadings rise as they are reached, and a pull quote takes ink as it is
 * read. Paragraphs never move.
 */
export function Article({ article, section }: { article: OriginalArticle; section: string }) {
  // A long title steps down one size, so it holds to three or four lines.
  const long = article.title.length > 48;
  return (
    <article className="bg-paper pt-(--header-height)">
      <header className="mx-auto max-w-(--wrap) px-5 pt-10 md:px-10 md:pt-14">
        <Link href="/insights" className="group label inline-flex min-h-11 items-center gap-2 text-stone transition-colors duration-(--duration-hover) hover:text-ink">
          <ArrowLeft className="size-3.5 transition-transform duration-(--duration-ui) ease-expo group-hover:-translate-x-1" aria-hidden />
          <span className="link-draw pb-0.5">Insights</span>
        </Link>
        <div className="mt-8 md:mt-10 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-9 lg:col-start-4">
            <Label>{section}</Label>
            <h1 className={`display mt-6 max-w-[16em] md:mt-7 ${long ? "t-h1" : "t-hero"}`}>
              <WordRise immediate>{article.title}</WordRise>
            </h1>
            <Reveal immediate delay={0.3} className="mt-8 max-w-[38rem] md:mt-10">
              <p className="t-lead text-stone">{article.excerpt}</p>
              {article.date && <p className="label mt-6 text-stone tabular-nums">{article.date}</p>}
            </Reveal>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-(--wrap) px-5 pt-10 pb-20 md:px-10 md:pt-12 md:pb-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="max-w-[38rem] border-t border-line pt-10 md:pt-12 lg:col-span-9 lg:col-start-4">
          {(article.body ?? []).map((block, i) =>
            typeof block === "string" ? (
              <p key={i} className="t-body mt-5 first:mt-0">
                {block}
              </p>
            ) : "heading" in block ? (
              <h2 key={i} className="display t-h2 mt-12 md:mt-14">
                <WordRise>{block.heading}</WordRise>
              </h2>
            ) : (
              <InView key={i} as="blockquote" className="my-10 border-l border-ink pl-6 md:my-12 md:pl-8">
                <p className="display t-h2">
                  <WordLight from={0.16} to={0.46} dim={0.5}>
                    {block.quote}
                  </WordLight>
                </p>
              </InView>
            ),
          )}
        </div>
      </div>
    </article>
  );
}
