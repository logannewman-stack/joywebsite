import type { Metadata } from "next";
import { industry } from "@/content/industry";
import { Photo } from "@/components/ui/Photo";
import { Label } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";
import { PathIndex } from "@/components/industry/PathIndex";
import { Collaborations } from "@/components/industry/Collaborations";
import { keepCompounds } from "@/components/industry/keepCompounds";

export const metadata: Metadata = {
  title: "Industry Collaborations",
  description: industry.hero.text,
};

/** Splits a short display heading so its last two words share a line. */
function lastTwo(heading: string): [string, string] {
  const words = heading.split(" ");
  return [words.slice(0, -2).join(" "), words.slice(-2).join(" ")];
}

export default function IndustryPage() {
  const { hero, partnerships, launch, collaborations, closing } = industry;
  const [closingA, closingB] = lastTwo(closing.heading);
  return (
    <>
      {/* Opening: headline first on phones, then the portrait, then the two ways in */}
      <section className="bg-paper pt-[4.75rem]">
        <div className="mx-auto grid grid-cols-1 max-w-[90rem] gap-y-12 px-5 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-8 lg:pb-32">
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <Label index="04">Industry Collaborations</Label>
            <h1 className="display mt-8 text-[clamp(2.6rem,13vw,4.4rem)] leading-[0.92] md:text-[clamp(2.6rem,7.4vw,6.4rem)] lg:text-[clamp(2.6rem,5.1vw,4.59rem)]">
              <LineReveal lines={["Education and ", "clinical strategy ", <em key="a">for dental </em>, <em key="b">manufacturers.</em>]} />
            </h1>
          </div>
          <div className="md:w-[62%] lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-auto">
            <ImageReveal immediate delay={0.1}>
              <Photo
                slot={hero.photo}
                priority
                className="aspect-[4/5] w-full"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 62vw, (max-width: 1440px) 42vw, 38.9vw"
              />
            </ImageReveal>
          </div>
          <Reveal immediate delay={0.25} className="md:ml-auto md:w-[62%] lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:ml-0 lg:w-auto">
            <p className="text-[1.1875rem] leading-relaxed">{keepCompounds(hero.text)}</p>
            <PathIndex
              className="mt-6"
              items={[
                { label: partnerships.heading, href: "#partnerships" },
                { label: launch.heading, href: "#clinical-launch" },
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* Sponsorships and KOL Partnerships: the large portrait moment */}
      <section id="partnerships" className="overflow-x-clip bg-ivory">
        <div className="mx-auto grid grid-cols-1 max-w-[90rem] gap-y-14 px-5 py-24 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-x-6 lg:py-36">
          {/* Heading at the top of the column, the offer and its button at the foot */}
          <div className="flex flex-col lg:col-span-5 lg:justify-between lg:pb-2">
            <Reveal>
              <h2 className="display max-w-[12ch] text-[clamp(2.6rem,4.6vw,4.14rem)] leading-[0.95]">{partnerships.heading}</h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-7 lg:mt-12">
              <p className="max-w-[34rem] text-[1.09375rem] leading-relaxed text-stone">{keepCompounds(partnerships.text)}</p>
              <InquiryButton type="partnership" className="mt-10">
                {partnerships.cta}
              </InquiryButton>
            </Reveal>
          </div>
          <ImageReveal className="md:ml-auto md:w-[70%] lg:col-span-6 lg:col-start-7 lg:ml-0 lg:w-auto lg:bleed-right">
            <Photo
              slot={partnerships.photo}
              className="aspect-[4/5] w-full"
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 70vw, (max-width: 1440px) 50vw, calc(50vw - 12px)"
            />
          </ImageReveal>
        </div>
      </section>

      {/* Clinical Launch Strategy: heading, then the lead as the page's big statement */}
      <section id="clinical-launch" data-header="dark" className="grain grain-light bg-ink text-white">
        <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-28 lg:py-36">
          <Reveal>
            <h2 className="display max-w-[12ch] text-[clamp(2.6rem,4.6vw,4.14rem)] leading-[0.95]">{launch.heading}</h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-14 md:mt-20 lg:pl-[8.333%]">
            <p className="display max-w-[21ch] text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02]">
              <em className="text-blush">{launch.lead}</em>
            </p>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-y-12 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
            <ImageReveal className="w-[78%] md:w-[48%] lg:col-span-4 lg:w-auto">
              <Photo
                slot={launch.photo}
                tone="dark"
                className="aspect-[4/5] w-full"
                sizes="(max-width: 767px) 78vw, (max-width: 1023px) 48vw, (max-width: 1440px) 34vw, 30.6vw"
              />
            </ImageReveal>
            <div className="flex flex-col gap-6 md:ml-auto md:w-[78%] lg:col-span-5 lg:col-start-7 lg:ml-0 lg:w-auto lg:self-end">
              {launch.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className="max-w-[34rem] text-[1.09375rem] leading-relaxed text-white/85">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.12} className="mt-4">
                {/* The longest pill: below 360px it tightens, and wraps only if text spacing is enlarged. */}
                <InquiryButton type="clinical_launch" tone="dark" className="max-[359px]:gap-2 max-[359px]:px-4 max-[359px]:text-[0.875rem] max-[359px]:whitespace-normal">
                  {launch.cta}
                </InquiryButton>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Collaborations heading={collaborations.heading} logos={collaborations.logos} />

      {/* Let's Discuss Your Project: the picker offers only the manufacturer topics */}
      <section className="bg-paper">
        <div className="mx-auto grid grid-cols-1 max-w-[90rem] gap-y-10 px-5 py-24 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-x-6 lg:py-36">
          <Reveal className="lg:col-span-7">
            <h2 className="display text-[clamp(2.8rem,5.8vw,5.22rem)] leading-[0.92]">
              <span className="block">{closingA} </span>
              <em className="block">{closingB}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="md:ml-auto md:w-[62%] lg:col-span-4 lg:col-start-9 lg:ml-0 lg:w-auto lg:self-end">
            <p className="text-[1.09375rem] leading-relaxed text-stone">{closing.text}</p>
            <InquiryButton choices={["partnership", "clinical_launch", "general"]} intro={closing.text} className="mt-8">
              {closing.cta}
            </InquiryButton>
          </Reveal>
        </div>
      </section>

      <NextPage current="/industry-collaborations" />
    </>
  );
}
