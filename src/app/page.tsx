import { home } from "@/content/home";
import { site } from "@/content/site";
import { heroes } from "@/components/home/Heroes";
import { Pathways } from "@/components/home/Pathways";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink, Label } from "@/components/ui/Links";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { Quote } from "@/components/ui/Quote";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { NextPage } from "@/components/layout/NextPage";

export default function Home() {
  const Hero = heroes[site.homeHero];
  const { perspective, closing, testimonial } = home;
  return (
    <>
      <Hero />

      {/* A perspective shaped by every side of dentistry */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-36">
          <div className="md:col-span-5 md:row-span-2">
            <ImageReveal>
              <Photo slot={perspective.photo} className="aspect-[3/4] w-full" sizes="(max-width: 768px) 100vw, 40vw" />
            </ImageReveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <Label index="01">About</Label>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display mt-6 text-[clamp(2.6rem,5vw,4.8rem)]">{perspective.heading}</h2>
            </Reveal>
          </div>
          <div className="flex flex-col gap-5 md:col-span-5 md:col-start-7 md:self-end">
            {perspective.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={`leading-relaxed ${i === 0 ? "text-[21px] text-ink" : "text-[17px] text-stone"}`}>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2} className="mt-3">
              <ArrowLink href={perspective.cta.href}>{perspective.cta.label}</ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Four pathways */}
      <section id="work" className="scroll-mt-20 bg-paper">
        <div className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-36">
          <Reveal className="mb-10 flex items-end justify-between">
            <h2 className="sr-only">Explore My Work</h2>
            <Label index="02">Work</Label>
          </Reveal>
          <Pathways />
        </div>
      </section>

      <Quote {...testimonial} />

      {/* Let's start a conversation */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-40">
          <Reveal className="md:col-span-7">
            <h2 className="display text-[clamp(3.2rem,8vw,8.4rem)] leading-[0.9]">{closing.heading}</h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="text-[17px] leading-relaxed text-stone">{closing.body}</p>
            <InquiryButton className="mt-8">{closing.cta}</InquiryButton>
          </Reveal>
        </div>
      </section>

      <NextPage current="/" />
    </>
  );
}
