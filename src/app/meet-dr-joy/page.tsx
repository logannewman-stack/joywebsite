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
        <div className="mx-auto max-w-(--wrap) px-5 md:px-10 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="pt-12 md:pt-16 lg:col-span-7 lg:pt-20 lg:pb-24">
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

          <div className="mx-auto mt-12 w-[min(100%,24rem)] md:mt-16 lg:col-span-5 lg:col-start-8 lg:mx-0 lg:mt-0 lg:w-auto">
            {/* 1122 x 1402: the frame has the cut-out's own proportions, so nothing is cropped and its foot meets the section edge. */}
            <Photo
              slot={hero.portrait}
              priority
              className="meet-settle aspect-[1122/1402] w-full"
              sizes="(max-width: 1023px) min(100vw - 40px, 384px), (max-width: 1440px) 36vw, 30vw"
            />
          </div>
        </div>
      </section>

      {/* The couplet: the operatory close-up beside the two lines */}
      <Couplet lines={hero.couplet} photo={operatory} />

      {/*
        A wide pause before the credentials: the staircase, the width of the
        page column, drifting a little in its frame. It runs on from the
        couplet (no line between them).
      */}
      <section className="no-rule bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 pb-20 md:px-10 md:pb-28">
          <ImageReveal>
            <Parallax amount={4} className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[12/5]">
              <Photo slot={interlude} className="h-full w-full" sizes="(max-width: 1440px) calc(100vw - 40px), 79vw" />
            </Parallax>
          </ImageReveal>
        </div>
      </section>

      <Credentials heading={credentials.heading} groups={credentials.groups} />

      {/* What Guides My Work: the lead-in, the question and its answer, in one column beside the label */}
      <section className="bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 pt-20 pb-20 md:px-10 md:pt-28 md:pb-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <InView className="lg:col-span-4">
            <Label as="h2" className="rise text-stone">
              {guides.heading}
            </Label>
          </InView>
          <div className="mt-8 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <InView className="stagger flex max-w-[40rem] flex-col gap-5">
              {guides.before.map((p, i) => (
                <p key={i} className="t-lead text-ink">
                  {p}
                </p>
              ))}
            </InView>
            <Question question={guides.question} answer={guides.answer} />
          </div>
        </div>
      </section>

      {/* The sign-off: the story's last lines, her signature, and the way to reach her */}
      <section className="meet-signoff bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
          {hasLifePhoto && (
            <ImageReveal className="w-[min(100%,22rem)] lg:col-span-4 lg:w-auto">
              <Parallax amount={5} className="aspect-[4/5] w-full">
                <Photo slot={guides.photo} className="h-full w-full" sizes="(max-width: 1023px) min(100vw - 40px, 352px), (max-width: 1440px) 30vw, 25vw" />
              </Parallax>
            </ImageReveal>
          )}
          <InView className={hasLifePhoto ? "mt-10 max-w-[38rem] lg:col-span-7 lg:col-start-6 lg:mt-0" : "max-w-[38rem] lg:col-span-7 lg:col-start-6"}>
            <p className="rise t-lead text-ink">{guides.after[0]}</p>
            <p className="rise display t-h2 mt-8" style={{ "--d": "0.08s" } as Vars}>
              {highlight(guides.after[1], ["more than 20 years later."], "light")}
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
