import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { heroes } from "@/components/home/Heroes";
import { site } from "@/content/site";

/**
 * One opening-screen direction on its own, as Home would show it. Embedded in
 * the /directions review page (desktop and phone previews). Review only:
 * never indexed, and gone at launch.
 */
export const metadata: Metadata = {
  title: "Opening-screen preview",
  robots: { index: false, follow: false },
};

const keys = ["a", "b", "c"] as const;

export function generateStaticParams() {
  return keys.map((dir) => ({ dir }));
}

export default async function DirectionPreview({ params }: PageProps<"/directions/[dir]">) {
  if (!site.showPlaceholders) notFound();
  const { dir } = await params;
  const key = keys.find((k) => k === dir);
  if (!key) notFound();
  const Hero = heroes[key];
  return <Hero />;
}
