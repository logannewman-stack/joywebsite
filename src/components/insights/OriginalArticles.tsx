import { ArrowLink, ReviewSlot } from "@/components/ui/Links";
import { Reveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";

type Original = { title: string; excerpt: string; href: string; date?: string };

/** Two pieces, set asymmetrically: the lead wide on the margin, the second narrower and lower. */
const geometry = [
  { box: "lg:col-span-7", title: "text-[clamp(2.4rem,4vw,3.8rem)]", slot: "min-h-56 lg:min-h-[24rem]" },
  { box: "lg:col-span-4 lg:col-start-9 lg:mt-40", title: "text-[clamp(2rem,2.8vw,2.6rem)]", slot: "min-h-44 lg:min-h-72" },
];

/**
 * From Dr. Joy: her original writing. Hidden at launch until the articles
 * exist; in review mode the slots hold the real composition.
 */
export function OriginalArticles({ heading, cta, articles }: { heading: string; cta: string; articles: Original[] }) {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-28 lg:pt-36 lg:pb-32">
        <Reveal>
          <h2 className="display text-[clamp(2.6rem,5vw,4.8rem)]">{heading}</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-y-14 md:mt-16 lg:grid-cols-12 lg:gap-x-6">
          {articles.length > 0
            ? articles.slice(0, 2).map((a, i) => (
                <Reveal key={a.href} delay={i * 0.08} className={geometry[i].box}>
                  <article className="border-t border-ink pt-8">
                    {a.date && <p className="label text-stone tabular-nums">{a.date}</p>}
                    <h3 className={`display mt-6 leading-[1] ${geometry[i].title}`}>{typeset(a.title)}</h3>
                    <p className="mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-stone">{a.excerpt}</p>
                    <ArrowLink href={a.href} className="mt-6">
                      {cta}
                    </ArrowLink>
                  </article>
                </Reveal>
              ))
            : geometry.map((g, i) => (
                <div key={i} className={g.box}>
                  <ReviewSlot className={g.slot}>Original article {i + 1}: title, summary or excerpt, and link</ReviewSlot>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
