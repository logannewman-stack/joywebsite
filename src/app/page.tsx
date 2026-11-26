import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { Perspective, STORY_LENGTH } from "@/components/home/Perspective";
import { Pathways } from "@/components/home/Pathways";
import { Finale } from "@/components/home/Finale";
import { InView } from "@/components/motion/InView";
import { Scene, SceneCount, SceneLine } from "@/components/motion/Scene";
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

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export default function Home() {
  const { work, pathways, testimonial } = home;

  return (
    <>
      {/*
        The opening and the story, joined. From 1024px (landscape) the opening holds, one screen
        tall, while the story slides up over it. The wrapper is a scene only for its progress:
        the engine writes --p on the stage's dim and cue (data-scene-vars in Hero.tsx), and
        home.css ("Opening") uses it. --hold-n is the story's length in screens, so the dim can
        be timed to the first screen of scrolling.
      */}
      <div data-scene="lg" className="hero-hold relative" style={{ "--hold-n": STORY_LENGTH } as Vars}>
        {/* Where the stage holds, this marker scrolls in its place and keeps the header's dark variant in step. */}
        <div aria-hidden data-header="dark" className="pointer-events-none absolute inset-x-0 top-0 hidden h-[100svh] lg:landscape:block" />
        <Hero />
        {/* A perspective shaped by every side of dentistry: the photograph opens to the whole screen and the story plays over it, one statement at a time. */}
        <Perspective />
      </div>

      {/*
        Explore My Work: the four pathways. From 1024px a pinned scene: the heading and a counter
        at the head of the stage, the four cards travelling sideways under them, a thin progress
        line at the foot. Counted in four steps (the counter). Below 1024px: cards in a grid.
      */}
      <section id="work" className="relative z-10 bg-paper" aria-labelledby="work-heading">
        {/* It slides up over the story's dark stage (home.css, "The story"): this keeps the header light as it passes under. */}
        <div aria-hidden data-header="light" className="pointer-events-none absolute inset-0" />
        <Scene as="div" from="lg" length={3} steps={pathways.length} className="work" pinClassName="work-stage py-20 md:py-28">
          <div className="mx-auto flex w-full max-w-(--wrap) items-end justify-between gap-6 px-5 md:px-10">
            <InView>
              <h2 id="work-heading" className="display t-h1">
                <WordRise>{work.heading}</WordRise>
              </h2>
            </InView>
            <p aria-hidden className="label hidden pb-2 text-stone pinned:block">
              <SceneCount total={pathways.length} />
            </p>
          </div>
          {/* data-scene-vars: the engine writes the scene's progress on the track's frame and the meter only. */}
          <div data-scene-vars="" suppressHydrationWarning className="work-run mt-10 md:mt-14">
            <Pathways />
          </div>
          <div aria-hidden data-scene-vars="" suppressHydrationWarning className="work-meter mx-auto hidden w-full max-w-(--wrap) px-5 md:px-10 pinned:block">
            <SceneLine className="text-ink" />
          </div>
        </Scene>
      </section>

      {/* What Others Are Saying: the quote lights up over a room on its feet. Black: the header switches over it. */}
      <Quote {...testimonial} tone="dark" />

      {/* Let's start a conversation: the closing. */}
      <Finale />
    </>
  );
}
