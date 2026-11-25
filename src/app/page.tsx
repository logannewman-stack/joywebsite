import type { Metadata, Viewport } from "next";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { Perspective } from "@/components/home/Perspective";
import { Pathways } from "@/components/home/Pathways";
import { Finale } from "@/components/home/Finale";
import { WordRise } from "@/components/motion/Text";
import { Quote } from "@/components/ui/Quote";

// Approved copy only: the headline for the title, and the line that names the work for the description.
const title = `${site.name} | ${home.hero.heading}`;
const description = home.perspective.paragraphs[2];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
};

/** Mobile browser chrome matches the opening screen, which is black. */
export const viewport: Viewport = {
  themeColor: "#0b0b0b",
};

export default function Home() {
  const { work, testimonial } = home;

  return (
    <>
      {/* The opening: the headline and her photograph, one screen on a desktop. */}
      <Hero />

      {/* A perspective shaped by every side of dentistry: the story beside one photograph. */}
      <Perspective />

      {/* Explore My Work: the four pathways, side by side. */}
      <section id="work" className="bg-paper" aria-labelledby="work-heading">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">
          <h2 id="work-heading" className="display t-h1">
            <WordRise>{work.heading}</WordRise>
          </h2>
          <Pathways />
        </div>
      </section>

      {/* What Others Are Saying. Black: the header switches over it. */}
      <Quote {...testimonial} tone="dark" />

      {/* Let's start a conversation: the closing. */}
      <Finale />
    </>
  );
}
