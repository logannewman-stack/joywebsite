import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { meet } from "@/content/meet";
import { site } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { Label } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { InView, Magnetic } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { highlight } from "@/components/motion/Text";
import { Couplet } from "@/components/meet/Couplet";
import { Credentials } from "@/components/meet/Credentials";
import { Question } from "@/components/meet/Question";
import { StoryLight } from "@/components/meet/StoryLight";
import { bindI } from "@/components/meet/text";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Meet Dr. Joy",
  description: meet.seo.description,
};

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export default function MeetPage() {
  const { hero, operatory, interlude, credentials, guides } = meet;
  // At launch an empty slot renders nothing, so the story column takes its place.
  const hasLifePhoto = Boolean(guides.photo.src) || site.showPlaceholders;

  return (
    <>
      {/*
        Opening: the portrait owns the right half of the first screen, bleeds to
        the edge and hangs over the ivory section below. It is in place from the
        first paint (it is the largest paint), settles from slightly large and
        drifts as the page moves. The story takes ink as it is read.
      */}
      <section className="overflow-x-clip bg-paper pt-[4.75rem]">
        <div className="mx-auto max-w-[90rem] px-5 pb-24 md:px-10 md:pb-32 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pb-0">
          <div className="pt-10 md:pt-16 lg:col-span-6 lg:pt-14">
            <Reveal immediate>
              <Label index="01">Meet Dr. Joy</Label>
            </Reveal>
            <h1 className="display mt-7 text-[clamp(3.5rem,8vw,8.4rem)] leading-[0.9] md:mt-9">
              {/* Trailing spaces keep the text "My career has never followed a single lane." for search and copy-paste; they do not render. */}
              <LineReveal lines={["My career has ", "never followed ", <em key="lane">a single lane.</em>]} />
            </h1>
          </div>

          <div className="relative z-10 mt-10 md:mt-14 md:ml-auto md:w-2/3 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:mt-0 lg:-mb-16 lg:bleed-right lg:ml-0 lg:min-h-[min(calc(100svh-4.75rem),67.5rem)] lg:w-auto">
            <Parallax amount={3} className="aspect-[4/5] w-full lg:aspect-auto lg:h-full">
              {/* On desktop the frame is as tall as the story beside it, so the photo is fitted by height: about 900px wide up to 1440, then in proportion. */}
              <Photo
                slot={hero.portrait}
                priority
                className="meet-settle h-full w-full"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(66vw - 53px), (max-width: 1440px) 900px, 62vw"
              />
            </Parallax>
          </div>

          <StoryLight
            paragraphs={hero.paragraphs}
            className="mt-12 flex max-w-[36rem] flex-col gap-6 md:mt-16 md:ml-[8%] lg:col-span-6 lg:col-start-1 lg:mt-10 lg:ml-0 lg:max-w-none lg:pr-6 lg:pb-20 xl:col-span-5 xl:col-start-2 xl:pr-0"
            paragraphClassName={(i) =>
              i === 0
                ? "text-[1.25rem] leading-[1.55] text-ink md:text-[1.375rem] lg:text-[1.25rem] xl:text-[1.375rem]"
                : "text-[1.125rem] leading-relaxed text-ink"
            }
            wrap={(p, i) =>
              i === 0 ? (
                <Reveal immediate delay={0.25}>
                  {p}
                </Reveal>
              ) : (
                <Reveal delay={(i - 1) * 0.06}>{p}</Reveal>
              )
            }
          />
        </div>
      </section>

      {/* The couplet: two lines glide in from opposite sides, the operatory between them */}
      <Couplet lines={hero.couplet} photo={operatory} />

      {/*
        Staircase interlude. On desktop the photograph opens to the full screen
        and holds (a plain sticky stage) while the black chapter slides over it;
        on smaller screens it drifts in its frame. Either way its foot fades into
        the black of Education, Leadership, and Service.
      */}
      <section data-scene="lg" data-view="" data-header="dark" className="meet-stairs bg-ivory">
        <div data-scene-pin className="relative">
          <Parallax amount={4} className="aspect-square w-full md:aspect-[16/9] lg:aspect-[2/1] pinned:aspect-auto pinned:h-full">
            <Photo slot={interlude} tone="dark" className="meet-stairs-photo h-full w-full" sizes="(max-width: 767px) 160vw, 106vw" />
          </Parallax>
          <div aria-hidden className="meet-stairs-dim pointer-events-none absolute inset-0 bg-ink opacity-0" />
        </div>
      </section>
      <Credentials heading={credentials.heading} groups={credentials.groups} />

      {/* What Guides My Work: the lead-in, on the same margin-and-column grid as the chapter above */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[90rem] px-5 pt-24 md:px-10 md:pt-36 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <InView className="lg:col-span-4">
            <Label as="h2" className="rise">
              {guides.heading}
            </Label>
          </InView>
          <InView className="stagger mt-8 flex max-w-[46rem] flex-col gap-6 md:mt-10 lg:col-span-7 lg:col-start-5 lg:mt-0 lg:max-w-none">
            {guides.before.map((p, i) =>
              // The last line before the stage is set as its cue, in the display italic.
              i === guides.before.length - 1 ? (
                <p key={i} className="display mt-2 text-[clamp(1.75rem,2.9vw,2.75rem)] leading-[1.08] md:mt-4">
                  <em>{bindI(p)}</em>
                </p>
              ) : (
                <p key={i} className="text-[1.3125rem] leading-[1.5] text-ink md:text-[1.5rem]">
                  {p}
                </p>
              ),
            )}
          </InView>
        </div>
      </section>

      {/* The question, held on a pinned stage, and its answer */}
      <Question question={guides.question} answer={guides.answer} />

      {/* The sign-off: the story's last lines, her signature, and the way to reach her */}
      <section className="meet-signoff bg-paper">
        <div className="mx-auto max-w-[90rem] px-5 pt-4 pb-28 md:px-10 md:pt-8 md:pb-40 lg:grid lg:grid-cols-12 lg:gap-x-6">
          {hasLifePhoto && (
            <ImageReveal className="md:w-2/3 lg:col-span-5 lg:w-auto">
              <Parallax amount={7} className="aspect-[4/5] w-full">
                <Photo
                  slot={guides.photo}
                  className="h-full w-full"
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(66vw - 53px), 44vw"
                />
              </Parallax>
            </ImageReveal>
          )}
          <InView
            className={
              hasLifePhoto
                ? "mt-12 max-w-[36rem] md:mt-16 md:ml-[8%] lg:col-span-6 lg:col-start-7 lg:mt-0 lg:ml-0 lg:max-w-none lg:self-end"
                : "max-w-[36rem] lg:col-span-6 lg:col-start-7 lg:max-w-none"
            }
          >
            <p className="rise text-[1.1875rem] leading-relaxed text-ink md:text-[1.25rem]">{guides.after[0]}</p>
            <p className="rise display mt-10 text-[clamp(2rem,3.3vw,3.1rem)] leading-[1.08]" style={{ "--d": "0.08s" } as Vars}>
              {highlight(guides.after[1], ["more than 20 years later."], "light")}
            </p>
            {site.wordmark.onLight && (
              <Image
                src={site.wordmark.onLight}
                alt=""
                width={site.wordmark.width}
                height={site.wordmark.height}
                unoptimized
                className="wipe mt-10 h-16 w-auto md:mt-12 md:h-[5.25rem]"
                style={{ "--d": "0.5s" } as Vars}
              />
            )}
            <div className="rise mt-14 border-t border-line pt-8" style={{ "--d": "0.6s" } as Vars}>
              <Magnetic strength={0.2}>
                <InquiryButton>Start a Conversation</InquiryButton>
              </Magnetic>
            </div>
          </InView>
        </div>
      </section>

      <NextPage current="/meet-dr-joy" />
    </>
  );
}
