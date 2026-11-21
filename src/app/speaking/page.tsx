import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import { speaking } from "@/content/speaking";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, ButtonLink, Label, focusRing } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { Quote } from "@/components/ui/Quote";
import { typeset } from "@/components/ui/Typeset";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";
import { CourseIndex } from "@/components/speaking/CourseIndex";
import { DetailsLink } from "@/components/speaking/DetailsLink";
import { PlannerResources } from "@/components/speaking/PlannerResources";
import { RoomBand } from "@/components/speaking/RoomBand";
import { SpokenAt, showSpokenAt } from "@/components/speaking/SpokenAt";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Speaking",
  // Approved sentence, short enough not to be cut off in search results.
  description: speaking.hero.paragraphs[1],
};

/** "Caregiver. Strategist. Owner." sets one sentence per line; other titles wrap naturally. */
function stackedTitle(title: string) {
  const parts = title.split(/(?<=\.)\s+/);
  if (parts.length < 2) return typeset(title);
  // The trailing space keeps the sentences apart in the text content.
  return parts.map((p) => (
    <span key={p} className="block">
      {typeset(p)}{" "}
    </span>
  ));
}

export default function SpeakingPage() {
  const { hero, clinical, teams, keynotes, p3, testimonial, planning } = speaking;
  const contents = [
    { href: "#topics", label: clinical.heading },
    { href: "#teams", label: teams.heading },
    { href: "#keynotes", label: keynotes.heading },
    { href: "#p3", label: p3.heading },
  ];
  // Quote renders in review mode, or at launch once permission is granted.
  const quoteShown = testimonial.permission === "granted" || site.showPlaceholders;
  const proof = showSpokenAt() || quoteShown;

  return (
    <>
      {/* Opening: the headline, then Dr. Joy on stage at full height */}
      <section className="bg-paper pt-[76px]">
        <div className="mx-auto grid max-w-[1440px] px-5 md:px-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="pt-12 md:pt-16 lg:col-span-6 lg:row-start-1 lg:pt-14 xl:col-span-7">
            <Label index="02">Speaking</Label>
            <h1 className="display mt-7 text-[clamp(2.6rem,13.2vw,5.25rem)] leading-[0.92] md:text-[clamp(4.5rem,10vw,6.5rem)] lg:text-[clamp(3.6rem,6.3vw,6.75rem)]">
              {/* Trailing spaces keep the words apart in the text content; they collapse visually. */}
              <LineReveal lines={["Presentations ", "grounded in ", <em key="c">clinical practice.</em>]} />
            </h1>
          </div>

          <div className="-mx-5 mt-10 md:mx-0 md:mt-12 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:-mr-10 lg:mt-0 xl:col-span-5 xl:col-start-8">
            <ImageReveal immediate delay={0.1}>
              <Photo
                slot={hero.photo}
                priority
                className="aspect-[4/5] w-full md:aspect-auto md:h-[min(70svh,44rem)] lg:aspect-[3/4] lg:h-auto lg:max-h-[calc(100svh-76px)] xl:aspect-[4/5]"
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) calc(100vw - 80px), (max-width: 1279px) 49vw, (max-width: 1440px) 41vw, 600px"
              />
            </ImageReveal>
          </div>

          <Reveal immediate delay={0.25} className="pt-10 pb-20 md:pt-12 md:pb-24 lg:col-span-6 lg:row-start-2 lg:self-end lg:pt-12 lg:pb-10">
            <div className="flex max-w-[36rem] flex-col gap-5">
              {hero.paragraphs.map((p, i) => (
                <p key={p} className={`leading-relaxed ${i === 0 ? "text-[18px] text-ink" : "text-[17px] text-stone"}`}>
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
            <nav aria-label="On this page" className="mt-12 lg:mt-14">
              <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
                {contents.map((c, i) => (
                  <li key={c.href} className={`border-b border-line ${i % 2 === 0 ? "sm:pr-6" : "sm:pl-6"}`}>
                    <a
                      href={c.href}
                      className={`group flex min-h-12 items-center justify-between gap-4 py-2.5 text-[14.5px] font-medium ${focusRing.light}`}
                    >
                      <span className="link-draw pb-0.5">{c.label}</span>
                      <ArrowDown className="size-4 shrink-0 text-stone transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-ink" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </section>

      {/* Featured Clinical Courses: an editorial index */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-5 pt-28 pb-24 md:px-10 md:pt-32 md:pb-32">
          <div id="topics" className="grid gap-6 lg:grid-cols-12 lg:gap-x-6">
            <Reveal className="lg:col-span-7">
              <h2 className="display text-[clamp(2.75rem,5.6vw,5.4rem)]">{clinical.heading}</h2>
            </Reveal>
            <Reveal delay={0.06} className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="max-w-[46ch] text-[17px] leading-relaxed text-stone">{clinical.intro}</p>
            </Reveal>
          </div>
          <CourseIndex courses={clinical.courses} className="mt-14 md:mt-20" />
        </div>
      </section>

      {/* A real room: stage and audience (and the speaker reel, once supplied) */}
      <RoomBand />

      {/* For Dental Teams & Organizations: a staggered spread on ivory */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 pt-28 pb-24 md:px-10 md:py-36">
          <div id="teams" className="max-w-[60rem]">
            <Reveal>
              <h2 className="display text-[clamp(2.75rem,5.6vw,5.4rem)]">{teams.heading}</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-stone">{teams.intro}</p>
            </Reveal>
          </div>
          <ol className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
            {teams.programs.map((p, i) => (
              <li key={p.title} className={i === 0 ? "lg:col-span-5" : "lg:col-span-6 lg:col-start-7 lg:mt-40"}>
                <Reveal className="border-t border-ink pt-7">
                  <span className="label text-stone tabular-nums" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-8 text-[clamp(2.75rem,5vw,5rem)] leading-[0.94]">{stackedTitle(p.title)}</h3>
                  <p className="mt-6 max-w-[30ch] font-serif text-[clamp(1.35rem,1.9vw,1.7rem)] leading-snug italic">{p.subtitle}</p>
                  <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-stone">{p.text}</p>
                  <DetailsLink pdf={p.pdf} title={p.title} className="mt-4" />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Keynote Presentations: the black chapter */}
      <section className="grain grain-light bg-ink text-white">
        <div className="mx-auto grid max-w-[1440px] px-5 pt-28 pb-24 md:px-10 md:py-36 lg:grid-cols-12 lg:gap-x-6">
          <div id="keynotes" className="lg:col-span-7 lg:row-start-1">
            <Reveal>
              <h2 className="display text-[clamp(2.4rem,3.6vw,3.6rem)]">{keynotes.heading}</h2>
            </Reveal>
          </div>
          <div className="-mx-5 mt-10 md:mx-0 md:mt-14 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-0">
            <ImageReveal className="lg:sticky lg:top-28">
              <Photo
                slot={keynotes.photo}
                tone="dark"
                className="aspect-[4/5] w-full md:max-w-[34rem] lg:max-w-none"
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 544px, (max-width: 1440px) 39vw, 560px"
              />
            </ImageReveal>
          </div>
          <div className="mt-6 lg:col-span-7 lg:row-start-2 lg:mt-12 lg:pr-10">
            {keynotes.items.map((k, i) => (
              <Reveal key={k.title}>
                <article className="border-t border-line-dark py-10 md:py-14">
                  <span className="label text-blush tabular-nums" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-6 text-[clamp(2.75rem,5.4vw,5.6rem)] leading-[0.95]">{typeset(k.title)}</h3>
                  <p className="mt-5 max-w-[34ch] font-serif text-[clamp(1.35rem,1.9vw,1.7rem)] leading-snug text-blush italic">{k.subtitle}</p>
                  <p className="mt-5 max-w-[48ch] text-[16.5px] leading-relaxed text-ash">{k.text}</p>
                  <DetailsLink pdf={k.pdf} title={k.title} label="Keynote Details" tone="dark" className="mt-4" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dr. Joy's P3: kept minimal */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pt-28 pb-24 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-x-6">
          <div id="p3" className="lg:col-span-4">
            <Reveal>
              <h2 className="display text-[clamp(2.75rem,4.6vw,4.6rem)]">{p3.heading}</h2>
            </Reveal>
          </div>
          <div className="grid border-t border-ink md:grid-cols-2 lg:col-span-8">
            <Reveal className="border-b border-line py-9 md:border-r md:pr-10">
              <h3 className="font-serif text-[clamp(1.75rem,2.4vw,2.1rem)] leading-tight">{p3.bring.title}</h3>
              <p className="mt-3 max-w-md text-[16.5px] leading-relaxed text-stone">{p3.bring.text}</p>
              <InquiryButton type="p3_conference" variant="text" className="mt-4 !min-h-11 !gap-2">
                {p3.bring.cta}
              </InquiryButton>
            </Reveal>
            <Reveal delay={0.06} className="border-b border-line py-9 md:pl-10">
              <h3 className="font-serif text-[clamp(1.75rem,2.4vw,2.1rem)] leading-tight">{p3.attend.title}</h3>
              <p className="mt-3 max-w-md text-[16.5px] leading-relaxed text-stone">{p3.attend.text}</p>
              <ArrowLink href={p3.attend.cta.href} className="mt-4">
                {p3.attend.cta.label}
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Proof, on ivory: where she has spoken, and what planners say */}
      <SpokenAt className={quoteShown ? "" : "pb-24 md:pb-36"} />
      <Quote {...testimonial} tone="light" />

      <PlannerResources ruled={!proof} />

      {/* Planning an Event?: the finale */}
      <section className="grain grain-light bg-ink text-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-28 md:px-10 md:py-40 lg:grid-cols-12 lg:gap-x-6">
          <Reveal className="lg:col-span-8">
            <h2 className="display text-[clamp(3.6rem,9.6vw,9.5rem)] leading-[0.88]">{planning.heading}</h2>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4 lg:self-end">
            <p className="max-w-[34ch] text-[17px] leading-relaxed text-ash">{planning.text}</p>
            <InquiryButton type="speaking" tone="dark" className="mt-8">
              {planning.cta}
            </InquiryButton>
          </Reveal>
        </div>
      </section>

      <NextPage current="/speaking" />
    </>
  );
}
