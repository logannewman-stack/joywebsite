import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { education } from "@/content/education";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, ButtonLink, Label } from "@/components/ui/Links";
import { Reveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";
import { NextPage } from "@/components/layout/NextPage";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { LineRise, WordRise, highlight } from "@/components/motion/Text";
import { AttendeeVoice, attendeeVoiceShown } from "@/components/education/AttendeeVoice";
import { Filmstrip } from "@/components/education/Filmstrip";
import { P3Events } from "@/components/education/P3Events";

export const metadata: Metadata = {
  title: "Hands-On Education",
  description: education.hero.paragraphs[0],
};

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The family name as a masthead: its words rise one after another, and a
 * trailing "P3" is set in italic, on its own line from lg up.
 */
function Masthead({ text }: { text: string }) {
  const m = text.match(/^(.*\S)\s+(P3)$/);
  if (!m) return <WordRise>{text}</WordRise>;
  return (
    <>
      <span className="lg:block">
        <WordRise>{m[1]}</WordRise>
      </span>{" "}
      <em className="lg:block">
        <WordRise start={m[1].split(" ").length}>{m[2]}</WordRise>
      </em>
    </>
  );
}

export default function EducationPage() {
  const { hero, family, routes } = education;
  return (
    <>
      {/* Opening. Phones: headline, photographs, then the words. Desktop: words left, collage right.
          The two photographs sit at two depths: the room drifts inside its frame, the inset floats over it. */}
      <section className="edu-open bg-paper pt-[4.75rem]">
        <div className="edu-open-grid mx-auto grid max-w-(--wrap) px-5 pt-10 pb-20 md:px-10 md:pt-16 md:pb-28 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:pt-14 lg:pb-48">
          <div className="lg:col-span-6">
            <Label index="03">Hands-On Education</Label>
            {/* typeset() keeps "Skill-building" on one line; it always fits, but under a
                reader's own wide text spacing it may break at its hyphen instead of overflowing. */}
            <h1 className="display mt-8 text-[clamp(3rem,14vw,4.6rem)] leading-[0.9] lg:text-[clamp(4rem,7vw,6.3rem)] [&_.whitespace-nowrap]:whitespace-normal">
              <LineRise immediate lines={[typeset("Skill-building"), "with instruments", <em key="a">in hand.</em>]} />
            </h1>
          </div>

          <div className="relative mt-10 md:mt-14 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-start">
            {/* From lg the room photo is never taller than the screen allows, so the whole collage, inset included, opens in view. */}
            <Parallax amount={12} className="edu-open-room aspect-square w-full md:aspect-[4/3] lg:ml-auto lg:aspect-[4/5] lg:w-[86%]">
              <Photo
                slot={hero.photo}
                priority
                className="edu-settle h-full w-full"
                sizes="(min-width: 1441px) 50vw, (min-width: 1024px) 50vw, (min-width: 768px) calc(115vw - 5rem), calc(115vw - 2.5rem)"
              />
            </Parallax>
            <div
              data-view=""
              className="edu-float relative z-10 -mt-16 ml-auto w-[46%] md:-mt-28 md:w-[36%] lg:absolute lg:bottom-[-3.5rem] lg:left-0 lg:mt-0 lg:ml-0 lg:w-[42%]"
            >
              <div>
                <div className="edu-arrive edu-paper p-[0.375rem]">
                  <Parallax amount={5} className="aspect-square w-full">
                    <Photo
                      slot={hero.detail}
                      priority
                      className="h-full w-full"
                      sizes="(min-width: 1441px) 21vw, (min-width: 1024px) 22vw, (min-width: 768px) 36vw, 50vw"
                    />
                  </Parallax>
                </div>
              </div>
            </div>
          </div>

          <Reveal immediate delay={0.25} className="edu-open-words mt-12 max-w-md md:mt-14 lg:col-span-5 lg:row-start-2 lg:mt-9">
            {/* The marker under "in hand" draws once the words have arrived. */}
            <InView className="flex flex-col gap-5">
              {hero.paragraphs.map((p, i) => (
                <p
                  key={p}
                  className={`leading-relaxed ${i === 0 ? "text-[1.1875rem]" : "text-[1.0625rem] text-stone [&_.hl-light]:text-ink"}`}
                  style={{ "--rise-delay": "0.7s" } as Vars}
                >
                  {i === 1 ? highlight(p, ["instruments and products in hand"], "light") : p}
                </p>
              ))}
              <div className="mt-2">
                <ButtonLink href={hero.cta.href}>{hero.cta.label}</ButtonLink>
              </div>
            </InView>
          </Reveal>
        </div>
      </section>

      {/* Dr. Joy's P3: the family name as a masthead beside the room at work, and its two event types.
          From lg the photograph rises over the edge of the white opening, so the two sections interlock. */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-(--wrap) gap-12 px-5 pt-24 pb-20 md:px-10 md:pt-32 md:pb-24 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-16 lg:pt-0 lg:pb-28">
          <InView className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:pt-32">
            <h2 className="display text-[clamp(3.6rem,19vw,6.4rem)] leading-[0.88] lg:text-[clamp(5.2rem,10.4vw,9.36rem)]">
              <Masthead text={family.heading} />
            </h2>
          </InView>
          {/* From lg the photograph is as tall as the words beside it, so both end on one line (never squarer than 4:5). */}
          <InView className="edu-family-photo relative lg:col-span-6 lg:row-span-2 lg:row-start-1 lg:-mt-24">
            <Parallax amount={10} className="aspect-[4/5] w-full md:aspect-[4/3] lg:aspect-[4/5]">
              <Photo
                slot={family.photo}
                className="settle h-full w-full"
                sizes="(min-width: 1441px) 54vw, (min-width: 1024px) 53vw, (min-width: 768px) calc(115vw - 5rem), calc(115vw - 2.5rem)"
              />
            </Parallax>
          </InView>
          <InView className="grid gap-12 md:grid-cols-2 md:gap-x-6 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:grid-cols-1 lg:gap-10 lg:self-end">
            {family.items.map((item, i) => (
              <article key={item.title} style={{ "--d": `${i * 0.14}s` } as Vars}>
                <h3 className={`display mt-7 text-[clamp(2.2rem,3.4vw,3.06rem)] ${i === 0 ? "lg:text-[clamp(2.6rem,4.4vw,3.96rem)]" : ""}`}>
                  <WordRise delay={0.1 + i * 0.14}>{item.title}</WordRise>
                </h3>
                <p className="rise mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-stone">{item.text}</p>
              </article>
            ))}
          </InView>
        </div>
      </section>

      {/* The workshop itself: a row of prints that slides sideways. */}
      <Filmstrip />

      <AttendeeVoice />

      {/* From lg the session photograph carries across the edge into black, when a white section leads into it. */}
      <P3Events lift={attendeeVoiceShown()} />

      {/* Other routes: a compact index, so they read as wayfinding, not as the page's offer.
          Each row is one object: its link covers it. Its gold rule draws on entry; hover or focus inks it over. */}
      <section className="bg-paper">
        <ul className="mx-auto max-w-(--wrap) px-5 py-16 md:px-10 md:py-24">
          {routes.map((r, i) => (
            <InView as="li" key={r.heading} delay={i * 0.1} className="edu-route">
              <span aria-hidden className="edu-route-ink" />
              <div className="grid gap-3 py-9 md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-11">
                <h2 className="display text-[clamp(2rem,3vw,2.7rem)] md:col-span-6 xl:col-span-5">
                  <span className="edu-route-lean">
                    <WordRise delay={i * 0.1}>{r.heading}</WordRise>
                  </span>
                </h2>
                <p className="edu-route-text rise text-[1.03125rem] leading-relaxed text-stone md:col-span-6 xl:col-span-4">{r.text}</p>
                <div className="rise md:col-span-12 md:col-start-7 xl:col-span-3 xl:col-start-auto xl:justify-self-end">
                  <ArrowLink href={r.cta.href} className="edu-route-link">
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
