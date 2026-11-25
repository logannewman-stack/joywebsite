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

/** The section's place in the opening index ("01", "02"). */
function Index({ n, tone = "light" }: { n: string; tone?: "light" | "dark" }) {
  return (
    <p aria-hidden className={`label tabular-nums ${tone === "dark" ? "text-ash" : "text-stone"}`}>
      {n}
    </p>
  );
}

export default function IndustryPage() {
  const { hero, partnerships, launch, collaborations, closing } = industry;
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

      {/* Sponsorships and KOL Partnerships: the offer and its button on the left, the stage photograph on the right, inside the page column */}
      <section id="partnerships" className="bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
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
          {/* A square frame on a 4:5 photograph, held to its top edge (the slot's focus): it ends above the lectern's water bottle. */}
          <ImageReveal className="mt-12 w-[min(100%,24rem)] lg:col-span-5 lg:col-start-8 lg:mt-0 lg:w-auto">
            <Parallax className="aspect-square w-full" amount={5}>
              <Photo slot={partnerships.photo} className="h-full w-full" sizes="(max-width: 1023px) min(100vw - 40px, 384px), (max-width: 1440px) 36vw, 32vw" />
            </Parallax>
          </ImageReveal>
        </div>
      </section>

      {/*
        Clinical Launch Strategy: the page's black section. The heading on
        top; under it the photograph on the left and, on the right, the lead
        (its words brighten as it crosses the screen, see LeadLight) and the
        two paragraphs under thin lines, then the action. On phones the lead
        comes before the photograph.
      */}
      <section id="clinical-launch" data-header="dark" className="grain grain-light bg-ink text-white">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">
          <Index n="02" tone="dark" />
          <h2 className="display t-h1 mt-5 md:mt-6">
            <WordRise>{launch.heading}</WordRise>
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-y-10 md:mt-14 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-10">
            <p className="display t-h2 lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LeadLight text={launch.lead} accent="how it fits the care they deliver." />
            </p>

            <ImageReveal className="w-[min(100%,24rem)] lg:col-span-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-auto">
              <Parallax className="aspect-[4/5] w-full" amount={5}>
                <Photo
                  slot={launch.photo}
                  tone="dark"
                  className="h-full w-full"
                  sizes="(max-width: 1023px) min(100vw - 40px, 384px), (max-width: 1440px) 29vw, 26vw"
                />
              </Parallax>
            </ImageReveal>

            <InView className="lg:col-span-7 lg:col-start-6 lg:row-start-2">
              {launch.paragraphs.map((p, i) => (
                <div key={i} className="rise border-t border-line-dark py-6" style={{ "--d": `${i * 0.06}s` } as Vars}>
                  <p className="t-body max-w-[34rem]">{p}</p>
                </div>
              ))}
              <div className="rise border-t border-line-dark pt-8" style={{ "--d": "0.12s" } as Vars}>
                {/* The longest pill: below 360px it tightens, and wraps only if text spacing is enlarged. */}
                <InquiryButton type="clinical_launch" tone="dark" className="max-[359px]:gap-2 max-[359px]:px-4 max-[359px]:text-[0.875rem] max-[359px]:whitespace-normal">
                  {launch.cta}
                </InquiryButton>
              </div>
            </InView>
          </div>
        </div>
      </section>

      <Collaborations heading={collaborations.heading} logos={collaborations.logos} />

      {/* Let's Discuss Your Project: the heading on the left, the invitation and its button on the right. The picker offers only the manufacturer topics. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <h2 className="display t-h1 lg:col-span-6">
            <WordRise>{closing.heading}</WordRise>
          </h2>
          <InView className="mt-6 md:mt-8 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <p className="rise t-lead max-w-[33rem]">{closing.text}</p>
            <div className="rise mt-8" style={{ "--d": "0.1s" } as Vars}>
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
