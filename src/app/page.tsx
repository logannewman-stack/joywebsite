import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { heroes } from "@/components/home/Heroes";
import { Perspective, PERSPECTIVE_LENGTH } from "@/components/home/Perspective";
import { Pathways } from "@/components/home/Pathways";
import { Finale } from "@/components/home/Finale";
import { InView } from "@/components/motion/InView";
import { Scene } from "@/components/motion/Scene";
import { WordRise } from "@/components/motion/Text";
import { Quote } from "@/components/ui/Quote";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

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

/** Mobile browser chrome matches the opening screen (black for Direction B). */
export const viewport: Viewport = {
  themeColor: { a: "#ffffff", b: "#0b0b0b", c: "#f5f1e9" }[site.homeHero],
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  const Hero = heroes[site.homeHero];
  const { work, pathways, testimonial } = home;
  // The black stage (Direction B) holds while the story slides up over it.
  const hold = site.homeHero === "b";
  // Ivory brings warmth after a black or white opening; after C's ivory opening it switches to white.
  const perspectiveTone = site.homeHero === "c" ? "bg-paper" : "bg-ivory";
  const opening = (
    <>
      <Hero hold={hold} />
      {/* A perspective shaped by every side of dentistry: the story, pinned over one photograph. */}
      <Perspective tone={perspectiveTone} />
    </>
  );

  return (
    <>
      {hold ? (
        // A scene only for its progress: the engine writes --p on the stage's dim and cue (data-scene-vars
        // in Heroes.tsx), and home.css ("Opening") uses it to dim the held stage.
        <div data-scene="lg" className="hero-hold relative" style={{ "--hold-n": PERSPECTIVE_LENGTH } as Vars}>
          {/* Where the stage holds, this marker scrolls in its place and keeps the header's dark variant in step. */}
          <div aria-hidden data-header="dark" className="pointer-events-none absolute inset-x-0 top-0 hidden h-[100svh] lg:landscape:block" />
          {opening}
        </div>
      ) : (
        opening
      )}

      {/* Explore My Work: the four pathways. A sideways-scrolling sequence from 1024px; four rows on phones and a two-by-two grid on tablets. */}
      <section id="work" className="work-sheet relative z-10 bg-paper" aria-labelledby="work-heading">
        {/* Three and a half screens of scrolling while pinned, counted in fourteenths (the engine's steps): the stage
            settles for one, the row travels for eleven, and the last panel holds, whole, for two (half a screen)
            before the stage lets go. home.css ("Explore My Work") sets the timing. */}
        <Scene as="div" from="lg" length={4.5} steps={14} className="work" pinClassName="work-stage pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 lg:pb-40">
          <div className="work-head mx-auto max-w-[90rem] px-5 md:px-10">
            <InView>
              <span aria-hidden className="work-rule rule-draw mb-6 block h-px w-16 bg-gold-deep md:mb-8" />
              <h2 id="work-heading" className="work-title display text-[clamp(2.75rem,6.4vw,6.5rem)] leading-[0.92]">
                <WordRise>{work.heading}</WordRise>
              </h2>
            </InView>
            <p aria-hidden className="work-count label text-stone">
              <span className="roll-count tabular-nums text-ink">
                <span className="roll">
                  {pathways.map((p, i) => (
                    <span key={p.kicker}>{pad(i + 1)}</span>
                  ))}
                </span>
              </span>
              <span className="mx-2 opacity-50">/</span>
              <span className="tabular-nums">{pad(pathways.length)}</span>
            </p>
          </div>
          <div className="work-list mt-10 md:mt-14 lg:mt-20">
            <Pathways />
          </div>
          <div aria-hidden className="work-progress">
            <span className="work-progress-fill" />
            <span className="work-progress-dot" />
          </div>
        </Scene>
      </section>

      {/* What Others Are Saying: the quote lights up over a room on its feet. Black: the header switches over it. */}
      <Quote {...testimonial} tone="dark" className="home-quote" />

      {/* Let's start a conversation: the finale. */}
      <Finale />
    </>
  );
}
