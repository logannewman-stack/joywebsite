import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { insights } from "@/content/insights";
import { site } from "@/content/site";
import { Article } from "@/components/insights/Article";
import { StayConnected } from "@/components/insights/StayConnected";
import { NextPage } from "@/components/layout/NextPage";

/** Original articles published on this site (those with a slug and a body). */
function onSite() {
  return insights.original.articles.filter((a) => a.slug && a.body && a.body.length > 0);
}

/** Placeholder param: Cache Components needs one at build time; it renders a 404. */
const NONE = "__none__";

export function generateStaticParams() {
  const slugs = onSite().map((a) => ({ slug: a.slug as string }));
  return slugs.length > 0 ? slugs : [{ slug: NONE }];
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = onSite().find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    // A page-level openGraph replaces the layout's, so the site name is repeated here.
    openGraph: { type: "article", title: article.title, description: article.excerpt, siteName: site.name },
  };
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = onSite().find((a) => a.slug === slug);
  if (!article) notFound();
  const { newsletter, original } = insights;
  return (
    <>
      <Article article={article} section={original.heading} />
      <StayConnected heading={newsletter.heading} name={newsletter.name} text={newsletter.text} cta={newsletter.cta} />
      {/* "Next: Insights", back to the index. NextPage names the page after the one given. */}
      <NextPage current="/industry-collaborations" />
    </>
  );
}
