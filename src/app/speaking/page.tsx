import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { speaking } from "@/content/speaking";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, ButtonLink, Label, focusRing } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { Quote } from "@/components/ui/Quote";
import { InView, Magnetic } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { Hl, LineRise, WordRise } from "@/components/motion/Text";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";
import { ChapterRail } from "@/components/speaking/ChapterRail";
import { CourseIndex } from "@/components/speaking/CourseIndex";
import { DetailsLink } from "@/components/speaking/DetailsLink";
import { PlannerResources } from "@/components/speaking/PlannerResources";
import { RoomBand } from "@/components/speaking/RoomBand";
import { SpokenAt } from "@/components/speaking/SpokenAt";
import { chapters } from "@/components/speaking/chapters";

export const metadata: Metadata = {
  title: "Speaking",
  // Approved sentence, short enough not to be cut off in search results.
  description: speaking.hero.paragraphs[1],
};

/** Delay for an entrance inside an InView (sets --d, in seconds). */
const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** A thin line that draws itself from the left along the top of its row or group, once the InView around it is seen. */
function Rule({ tone = "light" }: { tone?: "light" | "dark" }) {
  return <span aria-hidden className={`rule-draw absolute inset-x-0 top-0 block h-px ${tone === "dark" ? "bg-line-dark" : "bg-line"}`} />;
}

/** A chapter's opening: its heading on the left, its introduction on the right, on one baseline. */
function ChapterHead({ id, heading, intro }: { id: string; heading: string; intro: string }) {
  return (
    <div id={id} className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
      <h2 className="display t-h1 lg:col-span-7">
        <WordRise>{heading}</WordRise>
      </h2>
      <InView className="mt-5 lg:col-span-5 lg:col-start-8 lg:mt-0">
        <p className="rise t-lead max-w-[33rem]" style={d(0.15)}>
          {intro}
        </p>
      </InView>
    </div>
  );
}

/** "Caregiver. Strategist. Owner." sets one sentence per line; other titles wrap naturally. Words or lines rise when seen. */
function ProgramTitle({ title, delay }: { title: string; delay: number }) {
  const parts = title.split(/(?<=\.)\s+/);
  if (parts.length < 2) return <WordRise delay={delay}>{title}</WordRise>;
  return <LineRise lines={parts} delay={delay} />;
}

export default function SpeakingPage() {
  const { hero, clinical, teams, keynotes, p3, testimonial, planning } = speaking;
  // "Planning an Event?": the last word carries the page's one marker.
  const planningWords = planning.heading.split(" ");
  const planningLead = planningWords.slice(0, -1).join(" ");
  const planningLast = planningWords[planningWords.length - 1];

  return (
    // sp-page scopes this page's own rules in speaking.css.
    <div className="sp-page">
      {/*
        Opening: the headline and introduction on the left, Dr. Joy on stage on
        the right, inside the page column and as tall as the text beside it. On
        phones the photo sits between the headline and the introduction. The
        chapter list closes the opening as one row between two thin lines (its
        own, and the line that starts the next section).
      */}
      <section className="bg-paper pt-(--header-height)">
        <div className="mx-auto max-w-(--wrap) px-5 pt-12 md:px-10 md:pt-16 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-6 lg:pt-20">
          <div className="lg:col-span-7 lg:row-start-1">
            <Reveal immediate>
              <Label index="02">Speaking</Label>
            </Reveal>
            <h1 className="display t-hero mt-6 md:mt-7">
              {/* Trailing spaces keep the words apart in the text content; they collapse visually. */}
              <LineReveal lines={["Presentations ", "grounded in ", "clinical practice."]} />
            </h1>
          </div>

          {/* The stage photo: visible from first paint (it is the largest paint); it settles from slightly large, then drifts a little slower than the page. */}
          <div className="mt-10 w-[min(100%,24rem)] md:mt-12 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:w-auto">
            <Parallax amount={4} className="aspect-[4/5] w-full lg:aspect-auto lg:h-full lg:max-h-[42rem] lg:min-h-[30rem]">
              <Photo
                slot={hero.photo}
                priority
                className="sp-hero-settle h-full w-full"
                sizes="(max-width: 1023px) min(100vw - 40px, 384px), (max-width: 1440px) 36vw, 32vw"
              />
            </Parallax>
          </div>

          <Reveal immediate delay={0.25} className="mt-10 md:mt-12 lg:col-span-7 lg:row-start-2 lg:mt-10">
            <div className="flex max-w-[33rem] flex-col gap-5">
              {hero.paragraphs.map((p, i) => (
                <p key={p} className={i === 0 ? "t-lead text-ink" : "t-body text-ink"}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <ButtonLink href={hero.primary.href}>{hero.primary.label}</ButtonLink>
              <InquiryButton type="speaking" variant="text">
                {hero.secondary.label}
              </InquiryButton>
            </div>
          </Reveal>

          {/* The chapter list: the page's four chapters, under a line that draws itself. */}
          <Reveal immediate delay={0.35} className="mt-12 md:mt-14 lg:col-span-12 lg:row-start-3">
            <InView className="relative">
              <Rule />
              <nav aria-label="On this page" className="py-3">
                <ul className="grid sm:grid-cols-2 sm:gap-x-6 xl:grid-cols-4">
                  {chapters.map((c) => (
                    <li key={c.href}>
                      <a href={c.href} className={`group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium ${focusRing.light}`}>
                        <span className="link-draw pb-0.5">{c.label}</span>
                        {/* The shared arrow swap (chrome.css, .swap), travelling down. */}
                        <span className="swap size-4" style={{ "--sx": "0%", "--sy": "135%" } as CSSProperties} aria-hidden>
                          <ArrowDown className="size-full" />
                          <ArrowDown className="size-full" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </InView>
          </Reveal>
        </div>
      </section>

      {/*
        Featured Clinical Courses: the program, one ruled row per course, closed
        by a photograph of a real room (and the speaker reel, once supplied).
        sp-held: with motion on, on a desktop, the chapter runs on under the
        next one, which slides up over the held photograph (speaking.css,
        "Room band"); isolate keeps the chapter's rail under that section too.
      */}
      <section className="sp-held relative isolate bg-paper">
        <ChapterRail current={0} />
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">
          <ChapterHead id="topics" heading={clinical.heading} intro={clinical.intro} />
          <CourseIndex courses={clinical.courses} className="mt-12 md:mt-16" />
        </div>
        <RoomBand />
      </section>

      {/*
        For Dental Teams & Organizations: a staggered spread. The first program
        on the left, the second lower on the right, each under a line that
        draws itself; below the second, the keynote photo rises out of the
        black chapter. The section lies above the room band it slides over.
      */}
      <section className="no-rule relative z-[1] bg-paper">
        <ChapterRail current={1} />
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:pb-36">
          <ChapterHead id="teams" heading={teams.heading} intro={teams.intro} />
          <ol className="mt-12 grid gap-y-12 md:mt-16 lg:grid-cols-12 lg:gap-x-6">
            {teams.programs.map((p, i) => {
              // The second program enters a beat after the first when both are seen at once.
              const base = i * 0.12;
              return (
                <InView
                  as="li"
                  key={p.title}
                  delay={base}
                  className={`relative pt-7 lg:col-span-5 lg:pt-8 ${i === 0 ? "" : "lg:col-start-8 lg:mt-24"}`}
                >
                  <Rule />
                  <h3 className="display t-h2">
                    <ProgramTitle title={p.title} delay={base} />
                  </h3>
                  <p className="rise t-lead mt-4 max-w-[30rem] font-medium text-balance" style={d(base + 0.2)}>
                    {p.subtitle}
                  </p>
                  <p className="rise t-body mt-3 max-w-[30rem] text-stone" style={d(base + 0.28)}>
                    {p.text}
                  </p>
                  <div className="rise mt-3 flex flex-wrap items-center gap-x-7" style={d(base + 0.36)}>
                    <DetailsLink pdf={p.pdf} title={p.title} />
                    <InquiryButton program={p.title} variant="text">
                      Inquire<span className="sr-only"> about {p.title}</span>
                    </InquiryButton>
                  </div>
                </InView>
              );
            })}
          </ol>
        </div>
      </section>

      {/*
        Keynote Presentations: the black chapter. The two keynotes on the left;
        on the right the stage photo, which rises across the section's top edge
        out of the white above, then holds beside the keynotes as they pass
        and grows a little (speaking.css, "Keynotes").
      */}
      <section data-header="dark" className="grain grain-light relative bg-ink text-white">
        <ChapterRail current={2} tone="dark" />
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div id="keynotes" className="lg:col-span-6 lg:row-start-1">
            <h2 className="display t-h1">
              <WordRise>{keynotes.heading}</WordRise>
            </h2>
          </div>
          {/* Above the section's grain (z-1), so the part of the photo that rises into the white matches the rest. The scroll engine writes --v here before React hydrates. */}
          <div
            data-view
            className="relative z-[1] mt-10 w-[min(100%,24rem)] md:mt-12 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:-mt-48 lg:w-auto"
            suppressHydrationWarning
          >
            <ImageReveal className="lg:motion:sticky lg:top-28">
              {/* Short desktop screens: the held photo never runs past the fold (7rem above it, 1.5rem below). */}
              <div className="aspect-[4/5] w-full overflow-clip lg:max-h-[calc(100svh-8.5rem)]">
                <div className="sp-keynote-zoom h-full w-full">
                  <Photo
                    slot={keynotes.photo}
                    tone="dark"
                    className="h-full w-full"
                    sizes="(max-width: 1023px) min(100vw - 40px, 384px), (max-width: 1440px) 36vw, 32vw"
                  />
                </div>
              </div>
            </ImageReveal>
          </div>
          <div className="mt-10 lg:col-span-6 lg:row-start-2 lg:mt-16">
            {keynotes.items.map((k) => (
              <InView as="article" key={k.title} className="relative pt-7 pb-10 last:pb-0 lg:pt-9 lg:pb-14">
                <Rule tone="dark" />
                <h3 className="display t-h2">
                  <WordRise>{k.title}</WordRise>
                </h3>
                <p className="rise t-lead mt-4 max-w-[30rem] font-medium text-balance" style={d(0.2)}>
                  {k.subtitle}
                </p>
                <p className="rise t-body mt-3 max-w-[30rem] text-ash" style={d(0.28)}>
                  {k.text}
                </p>
                <div className="rise mt-3 flex flex-wrap items-center gap-x-7" style={d(0.36)}>
                  <DetailsLink pdf={k.pdf} title={k.title} label="Keynote Details" tone="dark" />
                  <InquiryButton program={k.title} variant="text" tone="dark">
                    Inquire<span className="sr-only"> about {k.title}</span>
                  </InquiryButton>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Dr. Joy's P3: the heading on the left, the two ways in on the right, each under a line that draws itself */}
      <section className="relative bg-paper">
        <ChapterRail current={3} />
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div id="p3" className="lg:col-span-4">
            <h2 className="display t-h1">
              <WordRise>{p3.heading}</WordRise>
            </h2>
          </div>
          <InView className="mt-10 grid gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:col-span-8 lg:mt-0">
            <div className="rise relative pt-6" style={d(0.1)}>
              <Rule />
              <h3 className="display t-h3">{p3.bring.title}</h3>
              <p className="t-body mt-3 max-w-[26rem] text-stone">{p3.bring.text}</p>
              <InquiryButton type="p3_conference" variant="text" className="mt-3">
                {p3.bring.cta}
              </InquiryButton>
            </div>
            <div className="rise relative pt-6" style={d(0.18)}>
              <Rule />
              <h3 className="display t-h3">{p3.attend.title}</h3>
              <p className="t-body mt-3 max-w-[26rem] text-stone">{p3.attend.text}</p>
              <ArrowLink href={p3.attend.cta.href} className="mt-3">
                {p3.attend.cta.label}
              </ArrowLink>
            </div>
          </InView>
        </div>
      </section>

      {/* Proof: where she has spoken (a wall of names that drifts with the scroll), then what planners say, over the room */}
      <SpokenAt />
      <Quote {...testimonial} tone="dark" />

      <PlannerResources />

      {/* Planning an Event?: the closing section. Its line grows to full size as it comes up the screen (--v on the block around it, written by the scroll engine before React hydrates). */}
      <section data-header="dark" className="grain grain-light bg-ink text-white">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div data-view className="lg:col-span-6" suppressHydrationWarning>
            <InView as="h2" className="sp-finale-line display t-h1">
              <WordRise>{planningLead}</WordRise>{" "}
              <Hl tone="dark">
                <WordRise start={planningWords.length - 1}>{planningLast}</WordRise>
              </Hl>
            </InView>
          </div>
          <InView className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <p className="rise t-lead max-w-[30rem]" style={d(0.15)}>
              {planning.text}
            </p>
            <div className="rise mt-8" style={d(0.25)}>
              <Magnetic strength={0.22} className="sp-finale-cta">
                <InquiryButton type="speaking" tone="dark">
                  {planning.cta}
                </InquiryButton>
              </Magnetic>
            </div>
          </InView>
        </div>
      </section>

      <NextPage current="/speaking" />
    </div>
  );
}
