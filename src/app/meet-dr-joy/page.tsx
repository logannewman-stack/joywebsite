import type { Metadata } from "next";
import Image from "next/image";
import { meet } from "@/content/meet";
import { site } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { Label } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { Credentials } from "@/components/meet/Credentials";
import { Question } from "@/components/meet/Question";
import { bindI } from "@/components/meet/text";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Meet Dr. Joy",
  description: meet.seo.description,
};

export default function MeetPage() {
  const { hero, operatory, interlude, credentials, guides } = meet;
  // At launch an empty slot renders nothing, so the story column takes its place.
  const hasLifePhoto = Boolean(guides.photo.src) || site.showPlaceholders;

  return (
    <>
      {/* Opening: the portrait owns the right half of the first screen, bleeding to the edge */}
      <section className="overflow-x-clip bg-paper pt-[4.75rem]">
        <div className="mx-auto max-w-[90rem] px-5 pb-24 md:px-10 md:pb-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="pt-10 md:pt-16 lg:col-span-6 lg:pt-14">
            <Reveal immediate>
              <Label index="01">Meet Dr. Joy</Label>
            </Reveal>
            <h1 className="display mt-7 text-[clamp(3.5rem,8vw,8.4rem)] leading-[0.9] md:mt-9">
              {/* Trailing spaces keep the text "My career has never followed a single lane." for search and copy-paste; they do not render. */}
              <LineReveal lines={["My career has ", "never followed ", <em key="lane">a single lane.</em>]} />
            </h1>
          </div>

          <div className="mt-10 md:mt-14 md:ml-auto md:w-2/3 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:mt-0 lg:bleed-right lg:ml-0 lg:w-auto">
            <ImageReveal immediate delay={0.1}>
              <Photo
                slot={hero.portrait}
                priority
                className="aspect-[4/5] w-full lg:aspect-auto lg:h-[min(calc(100svh-4.75rem),67.5rem)]"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(66vw - 53px), calc(50vw - 12px)"
              />
            </ImageReveal>
          </div>

          <div className="mt-12 flex max-w-[36rem] flex-col gap-6 md:mt-16 md:ml-[8%] lg:col-span-6 lg:col-start-1 lg:mt-10 lg:ml-0 lg:max-w-none lg:pr-6 xl:col-span-5 xl:col-start-2 xl:pr-0">
            {hero.paragraphs.map((p, i) =>
              i === 0 ? (
                <Reveal key={i} immediate delay={0.25}>
                  <p className="text-[1.25rem] leading-[1.55] text-ink md:text-[1.375rem] lg:text-[1.25rem] xl:text-[1.375rem]">{p}</p>
                </Reveal>
              ) : (
                <Reveal key={i} delay={(i - 1) * 0.06}>
                  <p className="text-[1.125rem] leading-relaxed text-ink">{p}</p>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Couplet: one turning sentence, with the operatory in the picture */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-10 md:py-32">
          <Reveal>
            <p className="display text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.98]">{bindI(hero.couplet[0])}</p>
          </Reveal>
          <div className="mt-6 grid gap-12 md:mt-10 md:grid-cols-12 md:items-end md:gap-x-6">
            <Reveal delay={0.08} className="pl-[12%] md:col-span-7 md:col-start-6 md:row-start-1 md:pl-0 lg:col-span-8 lg:col-start-5">
              <p className="display text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.98]">
                <em>{bindI(hero.couplet[1])}</em>
              </p>
            </Reveal>
            <ImageReveal className="w-4/5 md:col-span-5 md:col-start-1 md:row-start-1 md:w-auto lg:col-span-4">
              <Photo
                slot={operatory}
                className="aspect-[5/4] w-full"
                sizes="(max-width: 767px) calc(80vw - 32px), (max-width: 1023px) calc(42vw - 47px), (max-width: 1440px) calc(33vw - 43px), 30.3vw"
              />
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* Education, Leadership, and Service, opened by a full-bleed pause */}
      <section data-header="dark" className="grain grain-light bg-ink text-white">
        <ImageReveal>
          <Photo
            slot={interlude}
            tone="dark"
            className="aspect-square w-full md:aspect-[16/9] lg:aspect-[2/1]"
            sizes="(max-width: 767px) 150vw, 100vw"
          />
        </ImageReveal>
        <Credentials heading={credentials.heading} groups={credentials.groups} />
      </section>

      {/* What Guides My Work */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-28 md:px-10 md:pt-36 md:pb-40">
          <div className="max-w-[46rem]">
            <Reveal>
              <Label as="h2">{guides.heading}</Label>
            </Reveal>
            <div className="mt-8 flex flex-col gap-6 md:mt-10">
              {guides.before.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className="text-[1.3125rem] leading-[1.5] text-ink md:text-[1.5rem]">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-14 md:mt-20">
            <Question question={guides.question} answer={guides.answer} />
          </div>

          <div className="mt-24 md:mt-36 lg:grid lg:grid-cols-12 lg:gap-x-6">
            {hasLifePhoto && (
              <ImageReveal className="md:w-2/3 lg:col-span-5 lg:w-auto">
                <Photo
                  slot={guides.photo}
                  className="aspect-[4/5] w-full"
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(66vw - 53px), (max-width: 1440px) calc(42vw - 47px), 38.4vw"
                />
              </ImageReveal>
            )}
            <div
              className={
                hasLifePhoto
                  ? "mt-12 max-w-[36rem] md:mt-16 md:ml-[8%] lg:col-span-6 lg:col-start-7 lg:mt-0 lg:ml-0 lg:max-w-none lg:self-end"
                  : "max-w-[36rem] lg:col-span-6 lg:col-start-7 lg:max-w-none"
              }
            >
              <Reveal>
                <p className="text-[1.1875rem] leading-relaxed text-ink md:text-[1.25rem]">{guides.after[0]}</p>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="display mt-10 text-[clamp(2rem,3.1vw,2.9rem)] leading-[1.08]">{guides.after[1]}</p>
              </Reveal>
              {site.wordmark.onLight && (
                <Reveal delay={0.12}>
                  <Image
                    src={site.wordmark.onLight}
                    alt=""
                    width={site.wordmark.width}
                    height={site.wordmark.height}
                    unoptimized
                    className="mt-10 h-14 w-auto md:h-16"
                  />
                </Reveal>
              )}
              <Reveal delay={0.16} className="mt-14 border-t border-line pt-8">
                <InquiryButton>Start a Conversation</InquiryButton>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <NextPage current="/meet-dr-joy" />
    </>
  );
}
