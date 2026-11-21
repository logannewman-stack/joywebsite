import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { insights } from "@/content/insights";
import { site } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, Label, ReviewSlot } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/inquiry/InquiryForm";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Insights",
  description: insights.hero.text,
};

export default function InsightsPage() {
  const { hero, original, published, newsletter } = insights;
  const confirmed = published.articles.filter((a) => a.url);
  const shownPublished = site.showPlaceholders ? published.articles : confirmed;

  return (
    <>
      {/* Opening: quiet */}
      <section className="bg-paper pt-[76px]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-12 pb-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:pt-20 md:pb-32">
          <div className="md:col-span-8">
            <Label index="05">Insights</Label>
            <h1 className="display mt-8 text-[clamp(3rem,6.8vw,7.4rem)] leading-[0.92]">
              <LineReveal lines={["The conversation doesn’t", "end when the", <em key="a">presentation does.</em>]} delay={0.1} />
            </h1>
            <Reveal delay={0.45} className="mt-10 max-w-md">
              <p className="text-[19px] leading-relaxed text-stone">{hero.text}</p>
            </Reveal>
          </div>
          <div className="md:col-span-3 md:col-start-10 md:self-end">
            <ImageReveal delay={0.25}>
              <Photo slot={hero.photo} priority className="aspect-[3/4] w-full" sizes="25vw" />
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* From Dr. Joy: original articles */}
      {(original.articles.length > 0 || site.showPlaceholders) && (
        <section className="bg-ivory">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
            <Reveal>
              <h2 className="display text-[clamp(2.6rem,5vw,4.8rem)]">{original.heading}</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {original.articles.length > 0
                ? original.articles.map((a, i) => (
                    <Reveal key={a.href} delay={i * 0.08}>
                      <article className="flex h-full flex-col bg-paper p-8 md:p-12">
                        {a.date && <p className="label text-stone">{a.date}</p>}
                        <h3 className="display mt-6 text-[clamp(2rem,3.2vw,3rem)] leading-[1.02]">{a.title}</h3>
                        <p className="mt-5 flex-1 text-[16.5px] leading-relaxed text-stone">{a.excerpt}</p>
                        <ArrowLink href={a.href} className="mt-6">
                          {original.cta}
                        </ArrowLink>
                      </article>
                    </Reveal>
                  ))
                : [0, 1].map((i) => (
                    <ReviewSlot key={i} className="min-h-72">
                      Original article {i + 1}: title, summary or excerpt, and link
                    </ReviewSlot>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Published Articles */}
      {shownPublished.length > 0 && (
        <section className="bg-paper">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-32">
            <Reveal className="md:col-span-4">
              <h2 className="display text-[clamp(2.6rem,4.6vw,4.4rem)]">{published.heading}</h2>
              <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-stone">{published.intro}</p>
            </Reveal>
            <ul className="border-t border-ink md:col-span-7 md:col-start-6">
              {shownPublished.map((a, i) => {
                const inner = (
                  <>
                    <span className="label w-8 shrink-0 pt-1.5 text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="block font-serif text-[24px] leading-tight md:text-[28px]">{a.title}</span>
                      <span className="mt-1.5 block text-[14.5px] text-stone">
                        {a.publication}
                        {a.date && ` · ${a.date}`}
                      </span>
                    </span>
                    {a.url ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 pt-1.5 text-[14px] font-medium">
                        {published.cta} <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                      </span>
                    ) : (
                      <span className="label shrink-0 rounded-full border border-ink/20 px-2 py-1 !text-[9px] text-stone">To confirm</span>
                    )}
                  </>
                );
                return (
                  <li key={a.title} className="border-b border-line">
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 py-6 transition-colors hover:bg-ivory md:gap-6">
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 py-6 md:gap-6">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Stay Connected */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-32">
          <Reveal className="md:col-span-6">
            <p className="label text-stone">{newsletter.heading}</p>
            <h2 className="display mt-6 text-[clamp(3rem,7vw,7rem)] leading-[0.92]">{newsletter.name}</h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="text-[18px] leading-relaxed text-stone">{newsletter.text}</p>
            <div className="mt-8">
              <NewsletterForm cta={newsletter.cta} />
            </div>
          </Reveal>
        </div>
      </section>

      <NextPage current="/insights" />
    </>
  );
}
