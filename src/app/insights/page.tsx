import type { Metadata } from "next";
import { insights } from "@/content/insights";
import { notes } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { Label } from "@/components/ui/Links";
import { Reveal } from "@/components/ui/Reveal";
import { NextPage } from "@/components/layout/NextPage";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { Hl, LineRise } from "@/components/motion/Text";
import { Band } from "@/components/insights/Band";
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
  const showOriginals = listedOriginals.length > 0 || (notes && originals.length === 0);
  const showPublished = articles.length > 0 || books.length > 0;
  // When the feature is the only piece of its kind, its section's list is not on the page.
  // The cover story then stands under that section's approved heading (and line), so the
  // approved copy stays on the page and the card is never unlabeled.
  const featureSection = featuredOriginal
    ? showOriginals
      ? null
      : { heading: original.heading }
    : featuredRecord && !showPublished
      ? { heading: published.heading, intro: published.intro }
      : null;

  return (
    <>
      {/*
        Opening: the label, the headline in four hand-set lines and the intro on the left; the portrait
        on the right, four of the twelve columns, inside the page column (under the text on phones).
        The lines rise on load, the pale pink marker draws behind the closing phrase (the page's one
        accent), and the portrait is there from the first paint, settles and drifts a little.
      */}
      <section className="bg-paper pt-(--header-height)">
        <div className="mx-auto max-w-(--wrap) px-5 pt-12 pb-20 md:grid md:grid-cols-12 md:items-start md:gap-x-6 md:px-10 md:pt-16 md:pb-28 lg:pt-20">
          <div className="md:col-span-8">
            <Reveal immediate>
              <Label index="05">Insights</Label>
            </Reveal>
            <h1 className="display t-hero mt-6 md:mt-7">
              <LineRise
                immediate
                lines={[
                  "The conversation",
                  "doesn’t end",
                  "when the",
                  <InView key="a" as="span">
                    <Hl tone="light">presentation does.</Hl>
                  </InView>,
                ]}
              />
            </h1>
            <Reveal immediate delay={0.3} className="mt-8 max-w-[30rem] md:mt-10">
              <p className="t-lead text-stone">{hero.text}</p>
            </Reveal>
          </div>
          <InView className="mt-12 w-[min(100%,24rem)] md:col-span-4 md:col-start-9 md:mt-0 md:w-auto">
            <Parallax className="aspect-[4/5] w-full" amount={5}>
              <Photo
                slot={hero.photo}
                priority
                className="settle h-full w-full"
                sizes="(max-width: 767px) min(100vw - 40px, 384px), (max-width: 1440px) 30vw, 26vw"
              />
            </Parallax>
          </InView>
        </div>
      </section>

      {feature && <Feature item={feature} cta={original.cta} {...featureSection} />}

      {showOriginals && <OriginalArticles heading={original.heading} cta={original.cta} articles={listedOriginals} />}

      {showPublished && (
        <PublishedList
          heading={published.heading}
          intro={published.intro}
          booksHeading={published.booksHeading}
          cta={published.cta}
          articles={articles}
          books={books}
        />
      )}

      {/* The conversation after a session: a wide photograph the width of the page column, before the black chapter */}
      <Band slot={band} />

      <StayConnected heading={newsletter.heading} name={newsletter.name} text={newsletter.text} cta={newsletter.cta} />

      <NextPage current="/insights" />
    </>
  );
}
