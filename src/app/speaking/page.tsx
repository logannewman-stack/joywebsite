import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { speaking } from "@/content/speaking";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, ButtonLink, Label, focusRing } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { Quote } from "@/components/ui/Quote";
import { InView, Magnetic } from "@/components/motion/InView";
import { LineRise, WordRise } from "@/components/motion/Text";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";
import { ChapterRail } from "@/components/speaking/ChapterRail";
import { CourseIndex } from "@/components/speaking/CourseIndex";
import { DetailsLink } from "@/components/speaking/DetailsLink";
import { PlannerResources } from "@/components/speaking/PlannerResources";
import { RoomBand } from "@/components/speaking/RoomBand";
import { SpokenAt, showSpokenAt } from "@/components/speaking/SpokenAt";
import { chapters } from "@/components/speaking/chapters";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Speaking",
  // Approved sentence, short enough not to be cut off in search results.
  description: speaking.hero.paragraphs[1],
};

/** Delay for an entrance inside an InView (sets --d, in seconds). */
const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** "Caregiver. Strategist. Owner." sets one sentence per line; other titles wrap naturally. Words or lines rise when seen. */
function ProgramTitle({ title }: { title: string }) {
  const parts = title.split(/(?<=\.)\s+/);
  if (parts.length < 2) return <WordRise>{title}</WordRise>;
  return <LineRise lines={parts} />;
}

export default function SpeakingPage() {
  const { hero, clinical, teams, keynotes, p3, testimonial, planning } = speaking;
  // Quote renders in review mode, or at launch once permission is granted.
  const quoteShown = testimonial.permission === "granted" || site.showPlaceholders;
  const proof = showSpokenAt() || quoteShown;
  // "Planning an Event?": the last word is set in italic, as the opening headline's last line is.
  const planningWords = planning.heading.split(" ");
  const planningLead = planningWords.slice(0, -1).join(" ");
  const planningLast = planningWords[planningWords.length - 1];

  return (
    <>
      {/* Opening: the headline, then Dr. Joy on stage at full height */}
      <section className="sp-open overflow-x-clip bg-paper pt-[4.75rem]">
        <div className="mx-auto grid max-w-[90rem] px-5 md:px-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="sp-open-head pt-12 md:pt-16 lg:col-span-6 lg:row-start-1 xl:col-span-7">
            <Label index="02">Speaking</Label>
            <h1 className="sp-open-title display mt-7 text-[clamp(2.6rem,13.2vw,5.25rem)] leading-[0.92] md:text-[clamp(4.5rem,10vw,6.5rem)]">
              {/* Trailing spaces keep the words apart in the text content; they collapse visually. */}
              <LineReveal lines={["Presentations ", "grounded in ", <em key="c">clinical practice.</em>]} />
            </h1>
          </div>

          {/* The stage photo: visible from first paint (it is the LCP); it settles from slightly large, then drifts slower than the page. */}
          <div className="-mx-5 mt-10 md:mx-0 md:mt-12 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:bleed-right xl:col-span-5 xl:col-start-8">
            <div
              data-view
              className="sp-hero-photo relative aspect-[4/5] w-full overflow-clip md:aspect-auto md:h-[min(70svh,44rem)] lg:h-full lg:max-h-[calc(100svh-4.75rem)] lg:min-h-[30rem]"
            >
              <div className="sp-hero-drift absolute inset-0">
                <div className="sp-hero-settle h-full w-full">
                  <Photo
                    slot={hero.photo}
                    priority
                    className="h-full w-full"
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) calc(100vw - 80px), (max-width: 1279px) 49vw, (max-width: 1440px) 41vw, calc(50vw - 127px)"
                  />
                </div>
              </div>
            </div>
          </div>

          <Reveal immediate delay={0.25} className="sp-open-body pt-10 pb-20 md:pt-12 md:pb-24 lg:col-span-6 lg:row-start-2 lg:pb-10">
            <div className="flex max-w-[36rem] flex-col gap-5">
              {hero.paragraphs.map((p, i) => (
                <p key={p} className={`leading-relaxed ${i === 0 ? "text-[1.125rem] text-ink" : "text-[1.0625rem] text-stone"}`}>
                  {p}
                </p>
              ))}
            </div>
            <div className="sp-open-actions mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <ButtonLink href={hero.primary.href}>{hero.primary.label}</ButtonLink>
              <InquiryButton type="speaking" variant="text">
                {hero.secondary.label}
              </InquiryButton>
            </div>

            {/* The chapter list: the page's four chapters, on hairlines that draw on load. */}
            <nav aria-label="On this page" className="sp-toc relative mt-12">
              <ul className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2">
                {chapters.map((c, i) => (
                  <li key={c.href} className={i % 2 === 0 ? "sm:pr-6" : "sm:pl-6"}>
                    <a href={c.href} className={`group flex h-full min-h-[3.25rem] items-center justify-between gap-4 py-2.5 ${focusRing.light}`}>
                      <span className="font-serif text-[1.25rem] leading-[1.15] tracking-[-0.005em]">
                        <span className="link-draw pb-0.5">{c.label}</span>
                      </span>
                      <span className="sp-toc-arrow relative block size-4 shrink-0 overflow-hidden text-stone group-hover:text-ink" aria-hidden>
                        <ArrowDown className="absolute inset-0 size-4" />
                        <ArrowDown className="absolute inset-0 size-4 -translate-y-full" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              {/* Hairlines: five on phones (one list), three from sm (two columns). */}
              <span aria-hidden className="pointer-events-none absolute inset-0">
                {[0, 1, 2, 3, 4].map((n) => (
                  <span key={n} className="sp-toc-rule" style={{ "--i": n } as CSSProperties} />
                ))}
              </span>
            </nav>
          </Reveal>
        </div>
      </section>

      {/* Featured Clinical Courses: the program */}
      <section className="relative bg-paper">
        <ChapterRail current={0} />
        <div className="mx-auto max-w-[90rem] px-5 pt-28 pb-24 md:px-10 md:pt-36 md:pb-36">
          <div id="topics" className="grid gap-6 lg:grid-cols-12 lg:gap-x-6">
            <h2 className="display text-[clamp(2.75rem,5.6vw,5.04rem)] lg:col-span-7">
              <WordRise>{clinical.heading}</WordRise>
            </h2>
            <InView className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="rise max-w-[46ch] text-[1.0625rem] leading-relaxed text-stone" style={d(0.15)}>
                {clinical.intro}
              </p>
            </InView>
          </div>
          <CourseIndex courses={clinical.courses} className="mt-14 md:mt-20" />
        </div>
      </section>

      {/* A real room: stage and audience (and the speaker reel, once supplied) */}
      <RoomBand />

      {/* For Dental Teams & Organizations: a staggered spread on ivory */}
      <section className="relative bg-ivory">
        <ChapterRail current={1} />
        <div className="mx-auto max-w-[90rem] px-5 pt-28 pb-24 md:px-10 md:pt-36 md:pb-40">
          <div id="teams" className="max-w-[60rem]">
            <h2 className="display text-[clamp(2.75rem,5.6vw,5.04rem)]">
              <WordRise>{teams.heading}</WordRise>
            </h2>
            <InView>
              <p className="rise mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-stone" style={d(0.15)}>
                {teams.intro}
              </p>
            </InView>
          </div>
          <ol className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
            {teams.programs.map((p, i) => (
              <InView as="li" key={p.title} className={i === 0 ? "lg:col-span-5" : "lg:col-span-6 lg:col-start-7 lg:mt-40"}>
                <span aria-hidden className="rule-draw block h-px bg-ink" />
                <span className="label rise mt-7 block text-stone tabular-nums" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-8 text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.94]">
                  <ProgramTitle title={p.title} />
                </h3>
                <p className="rise mt-6 max-w-[30ch] font-serif text-[clamp(1.35rem,1.9vw,1.7rem)] leading-snug italic" style={d(0.2)}>
                  {p.subtitle}
                </p>
                <p className="rise mt-5 max-w-[46ch] text-[1.03125rem] leading-relaxed text-stone" style={d(0.28)}>
                  {p.text}
                </p>
                <div className="rise mt-4 flex flex-wrap items-center gap-x-7" style={d(0.36)}>
                  <DetailsLink pdf={p.pdf} title={p.title} />
                  <InquiryButton program={p.title} variant="text">
                    Inquire<span className="sr-only"> about {p.title}</span>
                  </InquiryButton>
                </div>
              </InView>
            ))}
          </ol>
        </div>
      </section>

      {/* Keynote Presentations: the black chapter. Its photo rises across the edge from the ivory above. */}
      <section data-header="dark" className="grain grain-light relative bg-ink text-white">
        <ChapterRail current={2} tone="dark" />
        <div className="mx-auto grid max-w-[90rem] px-5 pt-28 pb-24 md:px-10 md:pt-36 md:pb-36 lg:grid-cols-12 lg:gap-x-6">
          <div id="keynotes" className="lg:col-span-7 lg:row-start-1">
            <h2 className="display text-[clamp(2.4rem,3.6vw,3.24rem)]">
              <WordRise>{keynotes.heading}</WordRise>
            </h2>
          </div>
          {/* Above the section's grain (z-1), so the part of the photo that rises into the ivory matches the rest. */}
          <div data-view className="sp-keynote-col relative z-[1] -mx-5 mt-10 md:mx-0 md:mt-14 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:-mt-56">
            <ImageReveal className="lg:sticky lg:top-28">
              <div className="aspect-[4/5] w-full overflow-clip md:max-w-[34rem] lg:max-w-none">
                <div className="sp-keynote-zoom h-full w-full">
                  <Photo
                    slot={keynotes.photo}
                    tone="dark"
                    className="h-full w-full"
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 544px, (max-width: 1440px) 39vw, 38.9vw"
                  />
                </div>
              </div>
            </ImageReveal>
          </div>
          <div className="mt-6 lg:col-span-7 lg:row-start-2 lg:mt-14 lg:pr-10">
            {keynotes.items.map((k, i) => (
              <InView as="article" key={k.title} className="relative py-11 md:py-16">
                <span aria-hidden className="rule-draw absolute inset-x-0 top-0 block h-px bg-white/30" />
                <span className="label rise block text-blush tabular-nums" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-6 text-[clamp(2.9rem,6vw,5.4rem)] leading-[0.94]">
                  <WordRise>{k.title}</WordRise>
                </h3>
                <p className="rise mt-6 max-w-[34ch] font-serif text-[clamp(1.35rem,1.9vw,1.7rem)] leading-snug text-blush italic" style={d(0.25)}>
                  {k.subtitle}
                </p>
                <p className="rise mt-5 max-w-[48ch] text-[1.03125rem] leading-relaxed text-ash" style={d(0.33)}>
                  {k.text}
                </p>
                <div className="rise mt-4 flex flex-wrap items-center gap-x-7" style={d(0.41)}>
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

      {/* Dr. Joy's P3: kept minimal */}
      <section className="relative bg-paper">
        <ChapterRail current={3} />
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 pt-28 pb-24 md:px-10 md:py-36 lg:grid-cols-12 lg:gap-x-6">
          <div id="p3" className="lg:col-span-4">
            <h2 className="display text-[clamp(2.75rem,4.6vw,4.14rem)]">
              <WordRise>{p3.heading}</WordRise>
            </h2>
          </div>
          <InView className="relative grid md:grid-cols-2 lg:col-span-8">
            <span aria-hidden className="rule-draw absolute inset-x-0 top-0 block h-px bg-ink" />
            <div className="rise border-b border-line py-9 md:border-r md:pr-10" style={d(0.1)}>
              <h3 className="font-serif text-[clamp(1.75rem,2.4vw,2.1rem)] leading-tight">{p3.bring.title}</h3>
              <p className="mt-3 max-w-md text-[1.03125rem] leading-relaxed text-stone">{p3.bring.text}</p>
              <InquiryButton type="p3_conference" variant="text" className="mt-4">
                {p3.bring.cta}
              </InquiryButton>
            </div>
            <div className="rise border-b border-line py-9 md:pl-10" style={d(0.18)}>
              <h3 className="font-serif text-[clamp(1.75rem,2.4vw,2.1rem)] leading-tight">{p3.attend.title}</h3>
              <p className="mt-3 max-w-md text-[1.03125rem] leading-relaxed text-stone">{p3.attend.text}</p>
              <ArrowLink href={p3.attend.cta.href} className="mt-4">
                {p3.attend.cta.label}
              </ArrowLink>
            </div>
          </InView>
        </div>
      </section>

      {/* Proof: where she has spoken (a moving wall of names on ivory), then what planners say, over the room */}
      <SpokenAt />
      <Quote {...testimonial} tone="dark" />

      <PlannerResources ruled={!proof} />

      {/* Planning an Event?: the finale */}
      <section data-header="dark" className="grain grain-light overflow-clip bg-ink text-white">
        <div className="mx-auto max-w-[90rem] px-5 pt-28 pb-24 md:px-10 md:pt-40 md:pb-32">
          <div data-view className="sp-finale">
            <h2 className="sp-finale-line display text-[clamp(4rem,20vw,7.5rem)] leading-[0.86] md:text-[clamp(6rem,12.9vw,8.25rem)] lg:text-[clamp(8rem,14vw,12.6rem)]">
              <WordRise>{planningLead}</WordRise>{" "}
              <em className="text-blush">
                <WordRise start={planningWords.length - 1}>{planningLast}</WordRise>
              </em>
            </h2>
          </div>
          <InView className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-12 lg:items-center lg:gap-x-6">
            <span aria-hidden className="rule-draw block h-px bg-white/30 lg:col-span-12" />
            <p className="rise max-w-[34ch] text-[1.125rem] leading-relaxed text-ash lg:col-span-5" style={d(0.15)}>
              {planning.text}
            </p>
            <div className="rise lg:col-span-6 lg:col-start-7 lg:justify-self-end" style={d(0.25)}>
              <Magnetic strength={0.22} className="sp-finale-cta">
                <InquiryButton type="speaking" tone="dark" className="!min-h-14 !px-8 !text-[1rem]">
                  {planning.cta}
                </InquiryButton>
              </Magnetic>
            </div>
          </InView>
        </div>
      </section>

      <NextPage current="/speaking" />
    </>
  );
}
