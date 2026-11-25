import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { industry } from "@/content/industry";
import { Photo } from "@/components/ui/Photo";
import { Label } from "@/components/ui/Links";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";
import { InView, Magnetic } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { Scene, SceneLine, SceneStep } from "@/components/motion/Scene";
import { Hl, LineRise, WordRise } from "@/components/motion/Text";
import { PathIndex } from "@/components/industry/PathIndex";
import { Collaborations } from "@/components/industry/Collaborations";
import { LeadLight } from "@/components/industry/LeadLight";
import { keepCompounds } from "@/components/industry/keepCompounds";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const metadata: Metadata = {
  title: "Industry Collaborations",
  description: industry.hero.text,
};

/** Splits a short heading so its last two words take a line of their own. */
function lastTwo(heading: string): [string, string] {
  const words = heading.split(" ");
  return [words.slice(0, -2).join(" "), words.slice(-2).join(" ")];
}

/** The section's place in the opening index ("01", "02"); it rises in when it is seen. */
function Index({ n, tone = "light" }: { n: string; tone?: "light" | "dark" }) {
  return (
    <InView className="rise">
      <p aria-hidden className={`label tabular-nums ${tone === "dark" ? "text-ash" : "text-stone"}`}>
        {n}
      </p>
    </InView>
  );
}

export default function IndustryPage() {
  const { hero, partnerships, launch, collaborations, closing } = industry;
  const [closingA, closingB] = lastTwo(closing.heading);
  return (
    <>
      {/*
        Opening: the headline, the offer and the two ways in on the right; her
        portrait on the left with its background removed, straight on the white
        page. The portrait is five columns wide and stands on the bottom edge of
        the section, so the line under the section is its floor. On phones the
        words come first and the portrait follows, centred.
      */}
      <section className="bg-paper pt-(--header-height)">
        <div className="mx-auto max-w-(--wrap) px-5 md:px-10 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="pt-12 md:pt-16 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:pt-20 lg:pb-24">
            <Reveal immediate>
              <Label index="04">Industry Collaborations</Label>
            </Reveal>
            {/* Four hand-set lines. */}
            <h1 className="display t-hero mt-6 md:mt-7">
              <LineRise
                immediate
                lines={[
                  "Education and",
                  "clinical strategy",
                  "for dental",
                  // The page's pink marker: it draws behind the word the page is for.
                  <InView as="span" key="for">
                    <Hl tone="light">manufacturers.</Hl>
                  </InView>,
                ]}
              />
            </h1>
            <Reveal immediate delay={0.25} className="mt-8 md:mt-10">
              <p className="t-lead max-w-[33rem]">{keepCompounds(hero.text)}</p>
            </Reveal>
            <PathIndex
              className="mt-8"
              items={[
                { label: partnerships.heading, href: "#partnerships" },
                { label: launch.heading, href: "#clinical-launch" },
              ]}
            />
          </div>
          <div className="mx-auto mt-12 w-[min(100%,22rem)] md:mt-16 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mt-0 lg:w-auto">
            {/* 1303 x 1809: the frame has the cut-out's own proportions, so nothing is cropped and its foot meets the section edge. */}
            <Photo
              slot={hero.photo}
              priority
              className="open-settle aspect-[1303/1809] w-full"
              sizes="(max-width: 1023px) min(100vw - 40px, 352px), (max-width: 1440px) 36vw, 30vw"
            />
          </div>
        </div>
      </section>

      {/*
        Sponsorships and KOL Partnerships: the offer and its button on the left,
        the stage photograph on the right, inside the page column. The
        photograph hangs past the section's bottom edge into the black chapter
        below (.partner-photo in industry.css); the section sits above that
        chapter, so the photograph crosses the change of colour.
      */}
      <section id="partnerships" className="relative z-10 bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
          <div className="lg:col-span-6">
            <Index n="01" />
            <h2 className="display t-h1 mt-5 md:mt-6">
              <WordRise>{partnerships.heading}</WordRise>
            </h2>
            <InView className="mt-6 md:mt-7">
              <p className="rise t-lead max-w-[33rem]">{keepCompounds(partnerships.text)}</p>
              <div className="rise mt-8" style={{ "--d": "0.1s" } as Vars}>
                <InquiryButton type="partnership">{partnerships.cta}</InquiryButton>
              </div>
            </InView>
          </div>
          <ImageReveal className="partner-photo mt-12 w-[min(100%,24rem)] lg:col-span-5 lg:col-start-8 lg:mt-0 lg:w-auto">
            <Parallax className="aspect-[4/5] w-full" amount={4}>
              <Photo
                slot={partnerships.photo}
                className="h-full w-full"
                // The frame shows the photograph at 1.3x (see .partner-photo), so it asks for a wider file than its box.
                sizes="(max-width: 1023px) min(130vw - 52px, 500px), 42vw"
              />
            </Parallax>
          </ImageReveal>
        </div>
      </section>

      {/*
        Clinical Launch Strategy: the page's black chapter.

        From 1024px it is a pinned scene in three beats. The stage holds the
        chapter line on top, the photograph on the left and one cell on the
        right: there the lead lights up word by word while the photograph
        comes up to full light and drifts, the finished sentence is held, then
        the two paragraphs and the action take its place; a thin line at the
        foot shows how far the scene has run. The lead is step 0 and keeps the
        stage for the second beat (industry.css); the details are step 2.

        Below 1024px, without JavaScript, with reduced motion and in print it
        is a plain section in reading order: the heading, the lead (its words
        brighten as it crosses the screen), the photograph, the paragraphs
        under thin lines, the action.
      */}
      <Scene id="clinical-launch" from="lg" steps={3} length={2.5} dark className="launch grain grain-light bg-ink text-white">
        <div className="launch-stage mx-auto max-w-(--wrap) px-5 pt-34 pb-20 md:px-10 md:pt-40 md:pb-28 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-x-6 lg:pt-44">
          <header className="launch-head lg:col-span-12">
            <Index n="02" tone="dark" />
            <h2 className="display t-h1 mt-5 md:mt-6 pinned:mt-0 pinned:t-h3">
              <WordRise>{launch.heading}</WordRise>
            </h2>
          </header>

          <SceneStep index={0} className="launch-step mt-10 md:mt-14 lg:col-span-7 lg:col-start-6 lg:row-start-2">
            <p className="display t-h2 pinned:t-h1">
              <LeadLight text={launch.lead} accent="how it fits the care they deliver." />
            </p>
          </SceneStep>

          {/* data-scene-vars: the engine writes the scene's progress (--p) here, on the lead and on the foot line only. */}
          <div
            data-scene-vars=""
            suppressHydrationWarning
            className="launch-photo mt-10 w-[min(100%,24rem)] md:mt-14 lg:col-span-4 lg:col-start-1 lg:row-span-2 lg:row-start-2 lg:w-auto"
          >
            <ImageReveal>
              <Parallax className="aspect-[4/5] w-full" amount={5}>
                <Photo
                  slot={launch.photo}
                  tone="dark"
                  className="h-full w-full"
                  sizes="(max-width: 1023px) min(100vw - 40px, 384px), (max-width: 1440px) 34vw, 30vw"
                />
              </Parallax>
            </ImageReveal>
          </div>

          {/* The action is inside the last step: keyboard focus brings that step up (engine.ts), and the stage only pins while its paragraphs, this one included, fit one screen. */}
          <SceneStep index={2} className="launch-step launch-details mt-10 lg:col-span-7 lg:col-start-6 lg:row-start-3">
            <InView>
              {launch.paragraphs.map((p, i) => (
                <div key={i} className="launch-item rise relative py-6" style={{ "--k": i, "--d": `${i * 0.06}s` } as Vars}>
                  <span aria-hidden className="rule-draw absolute inset-x-0 top-0 block h-px bg-line-dark" />
                  <p className="t-body max-w-[34rem]">{p}</p>
                </div>
              ))}
              <p className="launch-item rise relative pt-8" style={{ "--k": launch.paragraphs.length, "--d": "0.12s" } as Vars}>
                <span aria-hidden className="rule-draw absolute inset-x-0 top-0 block h-px bg-line-dark" />
                {/* The longest pill: below 360px it tightens, and wraps only if text spacing is enlarged. */}
                <InquiryButton type="clinical_launch" tone="dark" className="max-[359px]:gap-2 max-[359px]:px-4 max-[359px]:text-[0.875rem] max-[359px]:whitespace-normal">
                  {launch.cta}
                </InquiryButton>
              </p>
            </InView>
          </SceneStep>

          {/* How far through the scene: only while it is pinned. */}
          <div aria-hidden data-scene-vars="" suppressHydrationWarning className="launch-foot hidden pinned:block">
            <SceneLine className="text-white" />
          </div>
        </div>
      </Scene>

      <Collaborations heading={collaborations.heading} logos={collaborations.logos} />

      {/*
        Let's Discuss Your Project: the heading on the left in two hand-set
        lines, the invitation and its button on the right. As the heading comes
        up the screen its lines close in from opposite sides (.closing-title in
        industry.css) while their words rise. The picker offers only the
        manufacturer topics.
      */}
      <section className="overflow-x-clip bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
          {/* The scroll engine writes --v on the heading before React hydrates. */}
          <h2 data-view="" suppressHydrationWarning className="closing-title display t-h1 lg:col-span-6">
            <span className="closing-line-a block">
              <WordRise>{closingA}</WordRise>{" "}
            </span>
            <span className="closing-line-b block pl-[1.5em]">
              <WordRise start={2}>{closingB}</WordRise>
            </span>
          </h2>
          <InView className="mt-6 md:mt-8 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <p className="rise t-lead max-w-[33rem]" style={{ "--d": "0.15s" } as Vars}>
              {closing.text}
            </p>
            <div className="rise mt-8" style={{ "--d": "0.25s" } as Vars}>
              <Magnetic strength={0.18}>
                <InquiryButton choices={["partnership", "clinical_launch", "general"]} intro={closing.text}>
                  {closing.cta}
                </InquiryButton>
              </Magnetic>
            </div>
          </InView>
        </div>
      </section>

      <NextPage current="/industry-collaborations" />
    </>
  );
}
