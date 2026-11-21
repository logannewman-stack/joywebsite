import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { education } from "@/content/education";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, ButtonLink, Label, ReviewSlot } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { Quote } from "@/components/ui/Quote";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Hands-On Education",
  description: education.hero.paragraphs[0],
};

export default function EducationPage() {
  const { hero, family, attendee, events, routes } = education;
  const ev = events.featured;
  return (
    <>
      {/* Opening */}
      <section className="bg-paper pt-[76px]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-12 pb-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:pt-20 md:pb-32">
          <div className="md:col-span-6">
            <Label index="03">Hands-On Education</Label>
            <h1 className="display mt-8 text-[clamp(3.2rem,7vw,7.6rem)] leading-[0.9]">
              <LineReveal lines={["Skill-building", "with instruments", <em key="a">in hand.</em>]} delay={0.1} />
            </h1>
            <Reveal delay={0.45} className="mt-10 flex max-w-md flex-col gap-5">
              {hero.paragraphs.map((p, i) => (
                <p key={p} className={`leading-relaxed ${i === 0 ? "text-[19px]" : "text-[17px] text-stone"}`}>
                  {p}
                </p>
              ))}
              <div className="mt-2">
                <ButtonLink href={hero.cta.href}>{hero.cta.label}</ButtonLink>
              </div>
            </Reveal>
          </div>
          <div className="relative md:col-span-6">
            <ImageReveal delay={0.2}>
              <Photo slot={hero.photo} priority className="aspect-[4/5] w-full md:ml-auto md:w-[86%]" sizes="(max-width: 768px) 100vw, 45vw" />
            </ImageReveal>
            <ImageReveal delay={0.45} className="relative -mt-24 w-[52%] border-[6px] border-paper md:absolute md:bottom-[-3rem] md:left-0 md:mt-0 md:w-[42%]">
              <Photo slot={hero.detail} className="aspect-square w-full" sizes="25vw" />
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* Dr. Joy's P3 */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
          <Reveal>
            <h2 className="display text-[clamp(2.8rem,6vw,6rem)]">{family.heading}</h2>
          </Reveal>
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2">
            {family.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} className="bg-ivory">
                <article className={`flex h-full flex-col py-10 ${i === 0 ? "md:pr-10" : "md:pl-10"}`}>
                  <span className="label text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-8 text-[clamp(2.2rem,3.6vw,3.4rem)]">{item.title}</h3>
                  <p className="mt-5 max-w-md text-[17px] leading-relaxed text-stone">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Attendee voice */}
      {attendee ? (
        <Quote heading="From a P3 participant" quote={attendee.quote} name={attendee.name} role={attendee.role} permission={attendee.permission} tone="light" />
      ) : (
        <section className="bg-ivory">
          <div className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
            <ReviewSlot>Featured attendee testimonial or approved short video (permission required)</ReviewSlot>
          </div>
        </section>
      )}

      {/* P3 Events */}
      <section id="events" className="grain grain-light scroll-mt-20 bg-ink text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
          <Reveal>
            <Label className="text-ash">{events.heading}</Label>
          </Reveal>
          {ev ? (
            <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-x-6">
              <ImageReveal className="md:col-span-6">
                <Photo slot={ev.photo} tone="dark" className="aspect-[4/3] w-full" sizes="50vw" />
              </ImageReveal>
              <Reveal delay={0.1} className="md:col-span-5 md:col-start-8 md:self-center">
                <h2 className="display text-[clamp(2.6rem,5vw,4.8rem)]">{ev.name}</h2>
                <p className="mt-5 text-[18px] text-blush">
                  {ev.date} · {ev.location}
                </p>
                <p className="mt-6 text-[16.5px] leading-relaxed text-ash">{ev.details}</p>
                <a
                  href={ev.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-[15px] font-medium text-ink hover:bg-ivory"
                >
                  {events.cta}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </a>
              </Reveal>
            </div>
          ) : (
            <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-x-6">
              <Reveal className="md:col-span-7">
                <h2 className="display text-[clamp(2.4rem,4.8vw,4.6rem)]">{events.fallback.heading}</h2>
              </Reveal>
              <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
                <p className="text-[17px] leading-relaxed text-ash">{events.fallback.text}</p>
                <InquiryButton type="p3_interest" tone="dark" className="mt-8">
                  {events.fallback.cta}
                </InquiryButton>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* Routing */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-line md:grid-cols-2">
          {routes.map((r, i) => (
            <Reveal key={r.heading} delay={i * 0.08} className="bg-paper">
              <div className="flex h-full flex-col px-5 py-16 md:px-10 md:py-24">
                <h2 className="display text-[clamp(2.2rem,3.8vw,3.6rem)]">{r.heading}</h2>
                <p className="mt-4 text-[17px] text-stone">{r.text}</p>
                <ArrowLink href={r.cta.href} className="mt-6">
                  {r.cta.label}
                </ArrowLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <NextPage current="/hands-on-education" />
    </>
  );
}
