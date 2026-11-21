import type { Metadata } from "next";
import Image from "next/image";
import { FileText } from "lucide-react";
import { speaking } from "@/content/speaking";
import { links, site } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, ButtonLink, Label, ReviewSlot } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { Quote } from "@/components/ui/Quote";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Speaking",
  description: speaking.hero.paragraphs[0],
};

/** Course-detail PDF link. Hidden until an approved PDF exists. */
function DetailsLink({ pdf, label = "Course Details" }: { pdf: string | null; label?: string }) {
  if (!pdf) return null;
  return (
    <a href={pdf} target="_blank" rel="noopener noreferrer" className="group mt-4 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium">
      <FileText className="size-4" aria-hidden />
      <span className="link-draw">{label}</span>
      <span className="sr-only"> (PDF, opens in a new tab)</span>
    </a>
  );
}

export default function SpeakingPage() {
  const { hero, clinical, teams, keynotes, p3, spokenAt, testimonial, resources, planning } = speaking;
  return (
    <>
      {/* Opening */}
      <section className="bg-paper pt-[76px]">
        <div className="mx-auto max-w-[1440px] px-5 pt-12 md:px-10 md:pt-20">
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-8">
              <Label index="02">Speaking</Label>
              <h1 className="display mt-8 text-[clamp(3.2rem,7.4vw,8rem)] leading-[0.9]">
                <LineReveal lines={["Presentations grounded", <em key="a">in clinical practice.</em>]} delay={0.1} />
              </h1>
            </div>
            <Reveal delay={0.4} className="flex flex-col gap-5 md:col-span-4 md:self-end">
              {hero.paragraphs.map((p) => (
                <p key={p} className="text-[17px] leading-relaxed text-stone">
                  {p}
                </p>
              ))}
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                <ButtonLink href={hero.primary.href}>{hero.primary.label}</ButtonLink>
                <InquiryButton type="speaking" variant="text">
                  {hero.secondary.label}
                </InquiryButton>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-[1440px] md:mt-20 md:px-10">
          <ImageReveal delay={0.2}>
            <Photo slot={hero.photo} priority className="aspect-[4/3] w-full md:aspect-[21/9]" sizes="100vw" />
          </ImageReveal>
        </div>
      </section>

      {/* Featured Clinical Courses */}
      <section id="topics" className="scroll-mt-20 bg-paper">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid gap-8 md:grid-cols-12 md:gap-x-6">
            <Reveal className="md:col-span-6">
              <Label index="A">Clinical</Label>
              <h2 className="display mt-6 text-[clamp(2.6rem,5vw,4.8rem)]">{clinical.heading}</h2>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="text-[17px] leading-relaxed text-stone">{clinical.intro}</p>
            </Reveal>
          </div>

          <ol className="mt-16 grid gap-px border-t border-ink bg-line md:grid-cols-2 lg:grid-cols-3">
            {clinical.courses.map((c, i) => (
              <li key={c.title} className="bg-paper">
                <Reveal delay={(i % 3) * 0.06} className="flex h-full flex-col p-6 md:p-8">
                  <span className="label text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-10 text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.02]">{c.title}</h3>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-stone">{c.text}</p>
                  <DetailsLink pdf={c.pdf} />
                </Reveal>
              </li>
            ))}
            {/* Closing tile fills the grid and routes to the inquiry */}
            <li className="bg-ivory lg:col-span-2">
              <div className="flex h-full flex-col justify-between gap-8 p-6 md:p-8">
                <p className="label text-stone">{planning.heading}</p>
                <div>
                  <InquiryButton type="speaking">{planning.cta}</InquiryButton>
                </div>
              </div>
            </li>
          </ol>
          <div className="h-px bg-line" />
        </div>
      </section>

      {/* For Dental Teams & Organizations */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
          <div className="grid gap-8 md:grid-cols-12 md:gap-x-6">
            <Reveal className="md:col-span-6">
              <Label index="B">Teams</Label>
              <h2 className="display mt-6 text-[clamp(2.6rem,5vw,4.8rem)]">{teams.heading}</h2>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="text-[17px] leading-relaxed text-stone">{teams.intro}</p>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {teams.programs.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <article className="flex h-full flex-col bg-paper p-8 md:p-12">
                  <h3 className="display text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1]">{p.title}</h3>
                  <p className="mt-4 font-serif text-[21px] leading-snug italic">{p.subtitle}</p>
                  <p className="mt-8 border-t border-line pt-6 text-[16px] leading-relaxed text-stone">{p.text}</p>
                  <DetailsLink pdf={p.pdf} label="Program Details" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Keynote Presentations */}
      <section className="grain grain-light bg-ink text-white">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-36">
          <div className="md:col-span-4">
            <Reveal>
              <Label index="C" className="text-ash">
                Keynotes
              </Label>
              <h2 className="display mt-6 text-[clamp(2.6rem,4.6vw,4.4rem)]">{keynotes.heading}</h2>
            </Reveal>
            <ImageReveal className="mt-12 hidden md:block">
              <Photo slot={keynotes.photo} tone="dark" className="aspect-[4/5] w-full" sizes="30vw" />
            </ImageReveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            {keynotes.items.map((k, i) => (
              <Reveal key={k.title} delay={i * 0.1}>
                <article className={`py-12 ${i === 0 ? "border-t border-line-dark" : ""} border-b border-line-dark`}>
                  <span className="label text-blush tabular-nums">Keynote {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-6 text-[clamp(2.6rem,5.2vw,5rem)] leading-[0.95]">{k.title}</h3>
                  <p className="mt-5 font-serif text-[22px] leading-snug text-blush italic">{k.subtitle}</p>
                  <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-ash">{k.text}</p>
                  {k.pdf && (
                    <a href={k.pdf} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium">
                      <FileText className="size-4" aria-hidden />
                      <span className="link-draw">Keynote Details</span>
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dr. Joy's P3: kept minimal */}
      <section id="p3" className="scroll-mt-20 bg-paper">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
          <Reveal>
            <h2 className="display text-[clamp(2.6rem,5vw,4.8rem)]">{p3.heading}</h2>
          </Reveal>
          <div className="mt-12 grid border-t border-ink md:grid-cols-2">
            <Reveal className="border-b border-line py-10 md:border-r md:pr-10">
              <h3 className="font-serif text-[30px] leading-tight">{p3.bring.title}</h3>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-stone">{p3.bring.text}</p>
              <InquiryButton type="p3_conference" variant="text" className="mt-4">
                {p3.bring.cta}
              </InquiryButton>
            </Reveal>
            <Reveal delay={0.08} className="border-b border-line py-10 md:pl-10">
              <h3 className="font-serif text-[30px] leading-tight">{p3.attend.title}</h3>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-stone">{p3.attend.text}</p>
              <ArrowLink href={p3.attend.cta.href} className="mt-4">
                {p3.attend.cta.label}
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Where I've Spoken */}
      {(spokenAt.logos.length > 0 || spokenAt.verified || site.showPlaceholders) && (
        <section className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32">
            {spokenAt.logos.length > 0 ? (
              <>
                <h2 className="label text-stone">{spokenAt.heading}</h2>
                <ul className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
                  {spokenAt.logos.map((l) => (
                    <li key={l.name} className="relative h-12">
                      <Image src={l.src} alt={l.name} fill sizes="160px" className="object-contain grayscale" />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink pt-6">
                  <h2 className="label">{spokenAt.heading}</h2>
                  {!spokenAt.verified && site.showPlaceholders && (
                    <p className="label !text-[9.5px] text-stone">From Testimonials.pdf (partial listing) · confirm before launch</p>
                  )}
                </div>
                <ul className="mt-8 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
                  {spokenAt.venues.map((v) => (
                    <li key={v} className="break-inside-avoid border-b border-line py-3 font-serif text-[21px] leading-snug">
                      {v}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      )}

      <Quote {...testimonial} />

      {/* Resources + Planning */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-24 md:grid-cols-2 md:px-10 md:py-32">
          <Reveal className="flex h-full flex-col justify-between gap-10 bg-ivory p-8 md:p-12">
            <div>
              <h2 className="display text-[clamp(2.2rem,3.8vw,3.6rem)]">{resources.heading}</h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-stone">{resources.text}</p>
            </div>
            <div>
              {links.speakerResources ? (
                <ButtonLink href={links.speakerResources}>{resources.cta}</ButtonLink>
              ) : (
                <ReviewSlot className="!min-h-0 !py-4">{resources.cta}: speaker packet link pending</ReviewSlot>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.08} className="grain grain-light flex h-full flex-col justify-between gap-10 bg-ink p-8 text-white md:p-12">
            <div>
              <h2 className="display text-[clamp(2.2rem,3.8vw,3.6rem)]">{planning.heading}</h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ash">{planning.text}</p>
            </div>
            <div>
              <InquiryButton type="speaking" tone="dark">
                {planning.cta}
              </InquiryButton>
            </div>
          </Reveal>
        </div>
      </section>

      <NextPage current="/speaking" />
    </>
  );
}
