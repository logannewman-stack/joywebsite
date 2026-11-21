import type { Metadata } from "next";
import { education } from "@/content/education";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, ButtonLink, Label } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";
import { NextPage } from "@/components/layout/NextPage";
import { AttendeeVoice } from "@/components/education/AttendeeVoice";
import { P3Events } from "@/components/education/P3Events";

export const metadata: Metadata = {
  title: "Hands-On Education",
  description: education.hero.paragraphs[0],
};

/** Sets a trailing "P3" in italic, on its own line from lg up (a two-line masthead). */
function markP3(text: string) {
  const m = text.match(/^(.*\S)\s+(P3)$/);
  if (!m) return text;
  return (
    <>
      <span className="lg:block">{m[1]}</span> <em className="lg:block">{m[2]}</em>
    </>
  );
}

export default function EducationPage() {
  const { hero, family, interlude, routes } = education;
  return (
    <>
      {/* Opening. Phones: headline, photographs, then the words. Desktop: words left, collage right. */}
      <section className="bg-paper pt-[76px]">
        <div className="mx-auto grid max-w-[1440px] px-5 pt-10 pb-20 md:px-10 md:pt-16 md:pb-28 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:pt-14 lg:pb-40">
          <div className="lg:col-span-6">
            <Label index="03">Hands-On Education</Label>
            {/* typeset() keeps "Skill-building" on one line; it always fits, but under a
                reader's own wide text spacing it may break at its hyphen instead of overflowing. */}
            <h1 className="display mt-8 text-[clamp(3rem,14vw,4.6rem)] leading-[0.9] lg:text-[clamp(4rem,7vw,7.6rem)] [&_.whitespace-nowrap]:whitespace-normal">
              <LineReveal lines={[typeset("Skill-building"), "with instruments", <em key="a">in hand.</em>]} />
            </h1>
          </div>

          <div className="relative mt-10 md:mt-14 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-start">
            <ImageReveal immediate delay={0.1}>
              <Photo
                slot={hero.photo}
                priority
                className="aspect-square w-full md:aspect-[4/3] lg:ml-auto lg:aspect-[4/5] lg:w-[86%]"
                sizes="(min-width: 1440px) 720px, (min-width: 1024px) 50vw, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
              />
            </ImageReveal>
            <ImageReveal
              immediate
              delay={0.2}
              className="relative -mt-16 ml-auto w-[46%] border-[6px] border-paper md:-mt-28 md:w-[36%] lg:absolute lg:bottom-[-3.5rem] lg:left-0 lg:mt-0 lg:ml-0 lg:w-[42%]"
            >
              <Photo slot={hero.detail} priority className="aspect-square w-full" sizes="(min-width: 1440px) 280px, (min-width: 1024px) 20vw, (min-width: 768px) 34vw, 46vw" />
            </ImageReveal>
          </div>

          <Reveal immediate delay={0.25} className="mt-12 flex max-w-md flex-col gap-5 md:mt-14 lg:col-span-5 lg:row-start-2 lg:mt-9">
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
      </section>

      {/* Dr. Joy's P3: the room at work beside the family name, set as a masthead, and its two event types. */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-16">
          <Reveal className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <h2 className="display text-[clamp(3.6rem,19vw,6.4rem)] leading-[0.88] lg:text-[clamp(4.6rem,8.4vw,7.6rem)]">{markP3(family.heading)}</h2>
          </Reveal>
          <ImageReveal className="lg:col-span-6 lg:row-span-2 lg:row-start-1">
            <Photo
              slot={family.photo}
              className="aspect-[4/5] w-full md:aspect-[4/3] lg:aspect-[4/5]"
              sizes="(min-width: 1440px) 670px, (min-width: 1024px) 46vw, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
            />
          </ImageReveal>
          <div className="grid gap-12 md:grid-cols-2 md:gap-x-6 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:grid-cols-1 lg:gap-0 lg:self-end">
            {family.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className={i > 0 ? "lg:mt-11 lg:border-t lg:border-ink/15 lg:pt-11" : ""}>
                <article>
                  <h3 className={`display text-[clamp(2.2rem,3.4vw,3.4rem)] ${i === 0 ? "lg:text-[clamp(2.6rem,4.4vw,4.4rem)]" : ""}`}>
                    {typeset(item.title)}
                  </h3>
                  <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-stone">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Photo beat: participants at work, edge to edge. */}
      <ImageReveal>
        <Photo
          slot={interlude}
          className="aspect-[4/3] w-full md:aspect-[16/9] lg:aspect-[21/9]"
          sizes="(min-width: 1024px) 100vw, (min-width: 768px) 130vw, 165vw"
        />
      </ImageReveal>

      <AttendeeVoice />

      <P3Events />

      {/* Other routes: a compact index, so they read as wayfinding, not as the page's offer. */}
      <section className="bg-paper">
        <ul className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          {routes.map((r, i) => (
            <li key={r.heading} className="border-t border-line">
              <Reveal delay={i * 0.06} className="grid gap-3 py-9 md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-11">
                <h2 className="display text-[clamp(2rem,3vw,2.8rem)] md:col-span-6 xl:col-span-5">{typeset(r.heading)}</h2>
                <p className="text-[16.5px] leading-relaxed text-stone md:col-span-6 xl:col-span-4">{r.text}</p>
                <div className="md:col-span-12 md:col-start-7 xl:col-span-3 xl:col-start-auto xl:justify-self-end">
                  <ArrowLink href={r.cta.href}>{r.cta.label}</ArrowLink>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <NextPage current="/hands-on-education" />
    </>
  );
}
