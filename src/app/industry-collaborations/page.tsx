import type { Metadata } from "next";
import Image from "next/image";
import { industry } from "@/content/industry";
import { site } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { Label, ReviewSlot } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Industry Collaborations",
  description: industry.hero.text,
};

export default function IndustryPage() {
  const { hero, partnerships, launch, collaborations, closing } = industry;
  return (
    <>
      {/* Opening */}
      <section className="bg-paper pt-[76px]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-12 pb-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:pt-20 md:pb-32">
          <div className="md:col-span-5 md:row-span-2">
            <ImageReveal immediate delay={0.2}>
              <Photo slot={hero.photo} priority className="aspect-[3/4] w-full" sizes="(max-width: 768px) 100vw, 40vw" />
            </ImageReveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Label index="04">Industry Collaborations</Label>
            <h1 className="display mt-8 text-[clamp(3rem,6.4vw,7rem)] leading-[0.92]">
              <LineReveal lines={["Education and", "clinical strategy", <em key="a">for dental manufacturers.</em>]} delay={0.1} />
            </h1>
          </div>
          <Reveal immediate delay={0.45} className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="text-[19px] leading-relaxed">{hero.text}</p>
          </Reveal>
        </div>
      </section>

      {/* Two distinct inquiry categories */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-32">
          <Reveal className="md:col-span-6">
            <span className="label text-stone">01</span>
            <h2 className="display mt-6 text-[clamp(2.6rem,4.8vw,4.6rem)]">{partnerships.heading}</h2>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-stone">{partnerships.text}</p>
            <InquiryButton type="partnership" className="mt-10">
              {partnerships.cta}
            </InquiryButton>
          </Reveal>
          <ImageReveal className="md:col-span-5 md:col-start-8">
            <Photo slot={partnerships.photo} className="aspect-[4/3] w-full" sizes="(max-width: 768px) 100vw, 40vw" />
          </ImageReveal>
        </div>
      </section>

      <section className="grain grain-light bg-ink text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid gap-12 md:grid-cols-12 md:gap-x-6">
            <Reveal className="md:col-span-5">
              <span className="label text-ash">02</span>
              <h2 className="display mt-6 text-[clamp(2.6rem,4.8vw,4.6rem)]">{launch.heading}</h2>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-7">
              <p className="display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.05]">
                <em className="text-blush">{launch.lead}</em>
              </p>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-x-6">
            <ImageReveal className="md:col-span-5">
              <Photo slot={launch.photo} tone="dark" className="aspect-[4/3] w-full" sizes="(max-width: 768px) 100vw, 40vw" />
            </ImageReveal>
            <div className="flex flex-col gap-6 md:col-span-6 md:col-start-7">
              {launch.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="text-[17.5px] leading-relaxed text-white/85">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.2} className="mt-4">
                <InquiryButton type="clinical_launch" tone="dark">
                  {launch.cta}
                </InquiryButton>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Industry Collaborations */}
      {(collaborations.logos.length > 0 || site.showPlaceholders) && (
        <section className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-5 pt-24 md:px-10 md:pt-32">
            {collaborations.logos.length > 0 ? (
              <>
                <h2 className="label text-stone">{collaborations.heading}</h2>
                <ul className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
                  {collaborations.logos.map((l) => (
                    <li key={l.name} className="relative h-12">
                      <Image src={l.src} alt={l.name} fill sizes="160px" className="object-contain grayscale" />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <ReviewSlot>{collaborations.heading}: approved manufacturer logos only (clearance required)</ReviewSlot>
            )}
          </div>
        </section>
      )}

      {/* Let's Discuss Your Project */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-36">
          <Reveal className="md:col-span-7">
            <h2 className="display text-[clamp(3rem,7vw,7.4rem)] leading-[0.92]">{closing.heading}</h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="text-[17px] leading-relaxed text-stone">{closing.text}</p>
            <InquiryButton className="mt-8">
              {closing.cta}
            </InquiryButton>
          </Reveal>
        </div>
      </section>

      <NextPage current="/industry-collaborations" />
    </>
  );
}
