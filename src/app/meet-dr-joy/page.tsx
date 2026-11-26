import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { meet } from "@/content/meet";
import { notes, site } from "@/content/site";
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
  const hasLifePhoto = Boolean(guides.photo.src) || notes;

  return (
    <>
      {/*
        Opening: the story on the left, her portrait on the right with its
        background removed, straight on the white page. The portrait is about a
        third of the screen wide and stands on the bottom edge of the section,
        so the line under the section is its floor. The story takes ink as it
        is read.
      */}
      <section className="bg-paper pt-(--header-height)">
        <div className="mx-auto max-w-(--wrap) px-5 md:grid md:grid-cols-12 md:items-end md:gap-x-6 md:px-10">
          <div className="pt-12 md:col-span-7 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
            <Reveal immediate>
              <Label index="01">Meet Dr. Joy</Label>
            </Reveal>
            <h1 className="display t-hero mt-6 md:mt-7">
              {/* Trailing spaces keep the text "My career has never followed a single lane." for search and copy-paste; they do not render. */}
              <LineReveal lines={["My career has ", "never followed ", "a single lane."]} />
            </h1>
            <StoryLight
              paragraphs={hero.paragraphs}
              className="mt-8 flex max-w-[33rem] flex-col gap-5 md:mt-10"
              paragraphClassName={(i) => (i === 0 ? "t-lead text-ink" : "t-body text-ink")}
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

          <div className="mx-auto mt-12 w-[min(100%,24rem)] md:col-span-5 md:col-start-8 md:mx-0 md:mt-0 md:w-auto">
            {/* 1122 x 1402: the frame has the cut-out's own proportions, so nothing is cropped and its foot meets the section edge. */}
            <Photo
              slot={hero.portrait}
              priority
              className="meet-settle aspect-[1122/1402] w-full"
              sizes="(max-width: 767px) min(100vw - 40px, 384px), (max-width: 1440px) 36vw, 30vw"
            />
          </div>
        </div>
      </section>

      {/* The couplet: the operatory close-up beside the two lines */}
      <Couplet lines={hero.couplet} photo={operatory} />

      {/*
        The staircase: a wide pause before the credentials, the width of the page
        column. From 1024px it is a held stage: the photograph opens from a
        slight inset as it arrives, then holds in the middle of the screen while
        the black chapter slides up over it, pushing in a little and dimming
        behind (a plain sticky stage; meet.css, "Staircase and credentials"). On
        smaller screens it drifts in its frame. It runs on from the couplet (no
        line between them).
      */}
      <section data-scene="lg" data-view="" className="meet-stairs no-rule bg-paper">
        <div data-scene-pin>
          <div className="mx-auto w-full max-w-(--wrap) px-5 pb-20 md:px-10 md:pb-28">
            <ImageReveal>
              <div className="meet-stairs-band relative overflow-hidden">
                <Parallax amount={4} className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[12/5]">
                  <Photo slot={interlude} className="meet-stairs-photo h-full w-full" sizes="(max-width: 1440px) calc(100vw - 40px), 79vw" />
                </Parallax>
                <div aria-hidden className="meet-stairs-dim pointer-events-none absolute inset-0 bg-ink opacity-0" />
              </div>
            </ImageReveal>
          </div>
        </div>
      </section>

      <Credentials heading={credentials.heading} groups={credentials.groups} />

      {/* What Guides My Work: the lead-in, then the question and its answer, held on a pinned stage */}
      <Question label={guides.heading} before={guides.before} question={guides.question} answer={guides.answer} />

      {/* The sign-off: the story's last lines, her signature, and the way to reach her */}
      <section className="meet-signoff bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 pt-20 pb-24 md:grid md:grid-cols-12 md:items-center md:gap-x-6 md:px-10 md:pt-28 md:pb-32">
          {hasLifePhoto && (
            <ImageReveal className="w-[min(100%,22rem)] md:col-span-5 md:w-auto lg:col-span-4">
              <Parallax amount={5} className="aspect-[4/5] w-full">
                <Photo slot={guides.photo} className="h-full w-full" sizes="(max-width: 767px) min(100vw - 40px, 352px), (max-width: 1023px) 38vw, (max-width: 1440px) 30vw, 25vw" />
              </Parallax>
            </ImageReveal>
          )}
          <InView className={hasLifePhoto ? "mt-10 max-w-[38rem] md:col-span-6 md:col-start-7 md:mt-0 lg:col-span-7 lg:col-start-6" : "max-w-[38rem] md:col-span-6 md:col-start-7 lg:col-span-7 lg:col-start-6"}>
            <p className="rise t-lead text-ink">{guides.after[0]}</p>
            <p className="rise display t-h2 mt-8" style={{ "--d": "0.08s" } as Vars}>
              {highlight(guides.after[1], ["more than 20 years later."])}
            </p>
            {site.wordmark.onLight && (
              <Image
                src={site.wordmark.onLight}
                alt=""
                width={site.wordmark.width}
                height={site.wordmark.height}
                unoptimized
                className="wipe mt-8 h-14 w-auto md:mt-10 md:h-[4.5rem]"
                style={{ "--d": "0.5s" } as Vars}
              />
            )}
            <div className="rise pt-7" style={{ "--d": "0.7s" } as Vars}>
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
