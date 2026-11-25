import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { education } from "@/content/education";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, ButtonLink, Label } from "@/components/ui/Links";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { NextPage } from "@/components/layout/NextPage";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { LineRise, WordRise, highlight } from "@/components/motion/Text";
import { AttendeeVoice } from "@/components/education/AttendeeVoice";
import { Filmstrip } from "@/components/education/Filmstrip";
import { P3Events } from "@/components/education/P3Events";

export const metadata: Metadata = {
  title: "Hands-On Education",
  description: education.hero.paragraphs[0],
};

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export default function EducationPage() {
  const { hero, family, routes } = education;
  return (
    <>
      {/* Opening: the words on the left, the room on the right, about a third of the screen wide.
          The whole opening fits in one desktop screen. On phones it is one column, the words first. */}
      <section className="bg-paper pt-(--header-height)">
        <div className="mx-auto max-w-(--wrap) px-5 pt-12 pb-20 md:grid md:grid-cols-12 md:items-center md:gap-x-6 md:px-10 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
          <div className="md:col-span-7">
            <Reveal immediate>
              <Label index="03">Hands-On Education</Label>
            </Reveal>
            <h1 className="display t-hero mt-6 md:mt-7">
              <LineRise immediate lines={["Skill-building", "with instruments", "in hand."]} />
            </h1>
            <Reveal immediate delay={0.25} className="mt-8 max-w-[33rem] md:mt-10">
              {/* The marker behind "instruments and products in hand" draws once the words have arrived. */}
              <InView className="flex flex-col gap-5">
                {hero.paragraphs.map((p, i) => (
                  <p key={p} className={i === 0 ? "t-lead text-ink" : "t-body text-ink"} style={{ "--rise-delay": "0.7s" } as Vars}>
                    {i === 1 ? highlight(p, ["instruments and products in hand"], "light") : p}
                  </p>
                ))}
                <div className="pt-3">
                  <ButtonLink href={hero.cta.href}>{hero.cta.label}</ButtonLink>
                </div>
              </InView>
            </Reveal>
          </div>

          <div className="mt-12 w-[min(100%,24rem)] md:col-span-5 md:col-start-8 md:mt-0 md:w-auto">
            <Parallax amount={5} className="aspect-square w-full md:aspect-[4/5]">
              <Photo
                slot={hero.photo}
                priority
                className="edu-settle h-full w-full"
                sizes="(max-width: 767px) min(100vw - 40px, 384px), (max-width: 1440px) 37vw, 32vw"
              />
            </Parallax>
          </div>
        </div>
      </section>

      {/* Dr. Joy's P3: the family name and its two event types, each under a thin line, beside the room at work.
          On phones the photograph sits between the name and the two entries. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:grid md:grid-cols-12 md:grid-rows-[1fr_auto_auto_1fr] md:gap-x-6 md:px-10 md:py-28">
          <InView className="md:col-span-6 md:col-start-7 md:row-start-2">
            <h2 className="display t-h1">
              <WordRise>{family.heading}</WordRise>
            </h2>
          </InView>
          <ImageReveal className="mt-8 w-[min(100%,24rem)] md:col-span-5 md:col-start-1 md:row-span-4 md:row-start-1 md:mt-0 md:w-auto md:self-center">
            <Parallax amount={5} className="aspect-square w-full">
              <Photo slot={family.photo} className="h-full w-full" sizes="(max-width: 767px) min(100vw - 40px, 384px), (max-width: 1440px) 37vw, 32vw" />
            </Parallax>
          </ImageReveal>
          <InView className="stagger mt-10 md:col-span-6 md:col-start-7 md:row-start-3">
            {family.items.map((item) => (
              <article key={item.title} className="border-t border-line py-6 last:pb-0">
                <h3 className="display t-h3">{item.title}</h3>
                <p className="t-body mt-2 max-w-[33rem] text-stone">{item.text}</p>
              </article>
            ))}
          </InView>
        </div>
      </section>

      {/* The workshop itself: a row of small prints. */}
      <Filmstrip />

      <AttendeeVoice />

      <P3Events />

      {/* Other routes: a compact index, so they read as wayfinding, not as the page's offer.
          Each row is one object: its link covers it, and hover or focus leans its heading. */}
      <section className="bg-paper">
        <ul className="mx-auto max-w-(--wrap) px-5 py-10 md:px-10 md:py-14">
          {routes.map((r, i) => (
            <InView as="li" key={r.heading} delay={i * 0.1} className="edu-route border-t border-line first:border-t-0">
              <div className="grid gap-3 py-10 md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-12">
                <h2 className="display t-h2 md:col-span-6">
                  <span className="edu-route-lean">
                    <WordRise delay={i * 0.1}>{r.heading}</WordRise>
                  </span>
                </h2>
                <p className="edu-route-text rise t-body text-balance text-stone md:col-span-6 lg:col-span-4">{r.text}</p>
                <div className="rise md:col-span-6 md:col-start-7 lg:col-span-2 lg:col-start-auto lg:justify-self-end">
                  <ArrowLink href={r.cta.href} className="edu-route-link whitespace-nowrap">
                    {r.cta.label}
                  </ArrowLink>
                </div>
              </div>
            </InView>
          ))}
        </ul>
      </section>

      <NextPage current="/hands-on-education" />
    </>
  );
}
