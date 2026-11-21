import type { Metadata } from "next";
import { meet } from "@/content/meet";
import { Photo } from "@/components/ui/Photo";
import { Label } from "@/components/ui/Links";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";
import { Question } from "@/components/meet/Question";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Meet Dr. Joy",
  description: meet.hero.paragraphs[0],
};

export default function MeetPage() {
  const { hero, credentials, guides } = meet;
  return (
    <>
      {/* Opening: photo-led, asymmetric */}
      <section className="bg-paper pt-[76px]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-12 pb-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:pt-20 md:pb-32">
          <div className="md:col-span-7">
            <Label index="01">Meet Dr. Joy</Label>
            <h1 className="display mt-8 text-[clamp(3.2rem,7.6vw,8.4rem)] leading-[0.9]">
              <LineReveal lines={["My career has", "never followed", <em key="a">a single lane.</em>]} delay={0.1} />
            </h1>
          </div>
          <div className="md:col-span-5 md:row-span-2 md:mt-28">
            <ImageReveal delay={0.2}>
              <Photo slot={hero.portrait} priority className="aspect-[4/5] w-full" sizes="(max-width: 768px) 100vw, 40vw" />
            </ImageReveal>
          </div>
          <div className="flex flex-col gap-5 md:col-span-5 md:col-start-2">
            {hero.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.06}>
                <p className={`leading-relaxed ${i === 0 ? "text-[20px] text-ink" : "text-[17px] text-stone"}`}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Couplet */}
      <section className="border-y border-line bg-ivory">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
          {hero.couplet.map((line, i) => (
            <Reveal key={line} delay={i * 0.12} className={`px-5 py-16 md:px-10 md:py-24 ${i === 1 ? "border-t border-line md:border-t-0 md:border-l" : ""}`}>
              <p className="display text-[clamp(2.2rem,4.2vw,4rem)] leading-[1]">{i === 1 ? <em>{line}</em> : line}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education, Leadership, and Service */}
      <section className="grain grain-light bg-ink text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
          <Reveal>
            <Label index="02" className="text-ash">
              Credentials
            </Label>
            <h2 className="display mt-6 max-w-3xl text-[clamp(2.6rem,5vw,4.8rem)]">{credentials.heading}</h2>
          </Reveal>
          <div className="mt-16 grid gap-14 md:grid-cols-12 md:gap-x-6">
            {credentials.groups.map((g, gi) => (
              <Reveal
                key={g.title}
                delay={gi * 0.08}
                className={gi === 0 ? "md:col-span-4" : gi === 1 ? "md:col-span-5" : "md:col-span-3"}
              >
                <h3 className="label border-b border-line-dark pb-4 text-blush">{g.title}</h3>
                <ul>
                  {g.items.map((item) => {
                    // "Role, Organization": lead with the first part. "What I've Built"
                    // entries end in the role ("Jell-Ed, co-founder"), so split on the last comma.
                    const cut = gi === 2 ? item.lastIndexOf(", ") : item.indexOf(", ");
                    const first = cut > 0 ? item.slice(0, cut) : item;
                    const rest = cut > 0 ? [item.slice(cut + 2)] : [];
                    return (
                      <li key={item} className="border-b border-line-dark py-4">
                        <span className="block text-[16px] leading-snug text-white">{first}</span>
                        {rest.length > 0 && <span className="mt-1 block text-[14px] leading-snug text-ash">{rest.join(", ")}</span>}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What Guides My Work */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-36">
          <div className="md:col-span-5">
            <Reveal>
              <Label index="03">{guides.heading}</Label>
            </Reveal>
            <h2 className="sr-only">{guides.heading}</h2>
            <div className="mt-8 flex flex-col gap-5">
              {guides.before.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className="text-[19px] leading-relaxed">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <ImageReveal>
              <Photo slot={guides.photo} className="aspect-[4/5] w-full" sizes="(max-width: 768px) 100vw, 40vw" />
            </ImageReveal>
          </div>

          <div className="py-10 md:col-span-11 md:py-20">
            <Question question={guides.question} answer={guides.answer} />
          </div>

          <div className="flex flex-col gap-5 md:col-span-5 md:col-start-7">
            {guides.after.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={`leading-relaxed ${i === 0 ? "text-[17px] text-stone" : "text-[19px] text-ink"}`}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <NextPage current="/meet-dr-joy" />
    </>
  );
}
