import type { Metadata } from "next";
import { insights } from "@/content/insights";
import { site } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { Label } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { NextPage } from "@/components/layout/NextPage";
import { Feature, type FeatureItem } from "@/components/insights/Feature";
import { OriginalArticles } from "@/components/insights/OriginalArticles";
import { PublishedList } from "@/components/insights/PublishedList";
import { StayConnected } from "@/components/insights/StayConnected";
import { articleHref, isShown } from "@/components/insights/records";

export const metadata: Metadata = {
  title: "Insights",
  // Approved copy: the headline and the intro (143 characters).
  description: `${insights.hero.heading} ${insights.hero.text.replace(/\u00a0/g, " ")}`,
};

export default function InsightsPage() {
  const { hero, band, original, published, newsletter } = insights;

  // The single strongest piece leads the page; it is not repeated in the lists below.
  const originals = original.articles;
  const records = published.articles.filter(isShown);
  const featuredOriginal = originals.find((a) => a.feature);
  const featuredRecord = featuredOriginal ? undefined : records.find((a) => a.feature && a.kind !== "book" && a.url);
  const feature: FeatureItem | null = featuredOriginal
    ? {
        title: featuredOriginal.title,
        date: featuredOriginal.date,
        excerpt: featuredOriginal.excerpt,
        href: articleHref(featuredOriginal),
        external: /^https?:/.test(articleHref(featuredOriginal)),
        verified: true,
      }
    : featuredRecord
      ? {
          title: featuredRecord.title,
          subtitle: featuredRecord.subtitle,
          publication: featuredRecord.publication,
          date: featuredRecord.date,
          href: featuredRecord.url,
          external: true,
          verified: featuredRecord.verified,
        }
      : null;
  const listedOriginals = originals.filter((a) => a !== featuredOriginal);
  const articles = records.filter((a) => a.kind !== "book" && a !== featuredRecord);
  const books = records.filter((a) => a.kind === "book");
  const showOriginals = listedOriginals.length > 0 || (site.showPlaceholders && originals.length === 0);
  const showPublished = articles.length > 0 || books.length > 0;

  return (
    <>
      {/* Opening: the headline, and a large, quiet portrait */}
      <section className="overflow-x-clip bg-paper pt-[76px]">
        <div className="mx-auto grid grid-cols-1 max-w-[1440px] gap-y-12 px-5 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28 lg:grid-cols-12 lg:gap-x-6 lg:pb-32">
          <div className="lg:col-span-7 lg:pt-6">
            <Label index="05">Insights</Label>
            <h1 className="display mt-8 text-[clamp(2.4rem,12.4vw,4.4rem)] leading-[0.92] md:text-[clamp(3rem,9vw,6rem)] lg:text-[clamp(3rem,6.6vw,5.94rem)]">
              <LineReveal lines={["The conversation ", "doesn’t end when the ", <em key="a">presentation does.</em>]} />
            </h1>
            <Reveal immediate delay={0.25} className="mt-10 max-w-md md:mt-12">
              <p className="text-[19px] leading-relaxed text-stone">{hero.text}</p>
            </Reveal>
          </div>
          <div className="md:ml-auto md:w-[62%] lg:col-span-5 lg:col-start-8 lg:ml-0 lg:w-auto lg:bleed-right">
            <ImageReveal immediate delay={0.1}>
              <Photo
                slot={hero.photo}
                priority
                className="aspect-[4/5] w-full"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 62vw, (max-width: 1440px) 42vw, calc(50vw - 127px)"
              />
            </ImageReveal>
          </div>
        </div>
      </section>

      {feature && <Feature item={feature} cta={original.cta} />}

      {/* A quiet transition: the conversation after a session */}
      <ImageReveal>
        <Photo
          slot={band}
          className="aspect-[4/5] w-full sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]"
          // A 3:2 photo in a taller box is cropped at the sides, so phones need a wider file.
          sizes="(max-width: 639px) 188vw, (max-width: 767px) 113vw, 100vw"
        />
      </ImageReveal>

      {showOriginals && <OriginalArticles heading={original.heading} cta={original.cta} articles={listedOriginals} />}

      {showPublished && (
        <PublishedList
          heading={published.heading}
          intro={published.intro}
          booksHeading={published.booksHeading}
          cta={published.cta}
          articles={articles}
          books={books}
          rule={showOriginals}
        />
      )}

      <StayConnected heading={newsletter.heading} name={newsletter.name} text={newsletter.text} cta={newsletter.cta} />

      <NextPage current="/insights" />
    </>
  );
}
