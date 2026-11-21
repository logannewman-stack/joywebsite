import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ButtonLink, ArrowLink } from "../ui/Links";
import { LineReveal, Reveal, ImageReveal } from "../ui/Reveal";

const { hero } = home;

type HeroProps = { id?: string; as?: "h1" | "h2" };

/*
 * Three directions for the opening screen. All use the same approved copy.
 * A: Editorial Monochrome   (white page, asymmetric B&W portrait)
 * B: Black Stage            (black, cutout portrait layered over the type)
 * C: Ivory & Color          (warm ivory, full-color photograph, blush accent)
 */

/** Splits the approved headline so the closing phrase can carry the accent. */
const head = {
  lead: "The work has always been",
  accent: "bigger than the chair.",
};

export function HeroA({ id = "hero-heading", as: H = "h1" }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-paper pt-[76px]" aria-labelledby={id}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-5 px-5 pt-10 pb-16 md:px-10 md:pt-16 lg:min-h-[calc(100svh-76px)] lg:pb-20">
        <div className="relative z-10 col-span-12 flex flex-col lg:col-span-8">
          <H id={id} className="display text-[clamp(3.4rem,9.4vw,10.4rem)] leading-[0.88]">
            <LineReveal lines={["The work has", "always been", <em key="a">bigger than</em>, <em key="b">the chair.</em>]} delay={0.1} />
          </H>
          <Reveal delay={0.55} className="mt-10 grid gap-8 md:grid-cols-[minmax(0,26rem)_auto] md:items-end lg:mt-auto lg:pt-14">
            <p className="text-[18px] leading-relaxed text-stone md:text-[19px]">{hero.sub}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={hero.primary.href}>{hero.primary.label}</ButtonLink>
              <ArrowLink href={hero.secondary.href}>{hero.secondary.label}</ArrowLink>
            </div>
          </Reveal>
        </div>

        <div className="relative col-span-12 mt-12 lg:col-span-4 lg:mt-24">
          <span className="absolute -top-4 -right-4 hidden h-28 w-28 bg-blush lg:block" aria-hidden />
          <ImageReveal delay={0.25} className="relative">
            <Photo slot={hero.portrait} priority className="aspect-[4/5] w-full" sizes="(max-width: 1024px) 100vw, 34vw" />
          </ImageReveal>
        </div>
      </div>
    </section>
  );
}

export function HeroB({ id = "hero-heading", as: H = "h1" }: HeroProps) {
  return (
    <section className="grain grain-light relative isolate overflow-hidden bg-ink text-white" aria-labelledby={id}>
      <div className="mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-5 pt-[108px] pb-10 md:px-10">
        <H id={id} className="display relative z-0 text-[clamp(3.6rem,10.4vw,11.5rem)] leading-[0.88]">
          <LineReveal
            lines={[
              "The work has",
              <span key="a" className="block md:pl-[18%]">always been</span>,
              <em key="b" className="block text-blush">bigger than</em>,
              <em key="c" className="block text-blush md:pl-[34%]">the chair.</em>,
            ]}
            delay={0.1}
          />
        </H>

        {/* Cutout sits over the type: a designed moment, used once. */}
        <div className="pointer-events-none relative z-10 -mt-10 flex justify-end md:absolute md:inset-x-0 md:bottom-0 md:mx-auto md:mt-0 md:max-w-[1440px] md:px-10">
          <ImageReveal delay={0.35} className="w-[72%] max-w-[560px] md:w-[40%]">
            <Photo slot={hero.cutout} tone="dark" priority className="aspect-[4/5] w-full" sizes="40vw" />
          </ImageReveal>
        </div>

        <Reveal delay={0.6} className="relative z-20 mt-8 grid max-w-xl gap-7 md:mt-auto md:pt-16">
          <p className="text-[18px] leading-relaxed text-white/80 md:text-[19px]">{hero.sub}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={hero.primary.href} tone="dark">
              {hero.primary.label}
            </ButtonLink>
            <ArrowLink href={hero.secondary.href} className="text-white">
              {hero.secondary.label}
            </ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function HeroC({ id = "hero-heading", as: H = "h1" }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-ivory pt-[76px]" aria-labelledby={id}>
      <div className="mx-auto grid max-w-[1440px] items-stretch gap-10 px-5 py-12 md:px-10 lg:min-h-[calc(100svh-76px)] lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-16">
        <div className="flex flex-col justify-center">
          <H id={id} className="display text-[clamp(3.2rem,6.6vw,7.4rem)] leading-[0.92]">
            <LineReveal lines={[head.lead, <em key="a">{head.accent}</em>]} delay={0.1} />
          </H>
          <Reveal delay={0.5} className="mt-10 max-w-md">
            <p className="text-[18px] leading-relaxed text-stone md:text-[19px]">{hero.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={hero.primary.href}>{hero.primary.label}</ButtonLink>
              <ArrowLink href={hero.secondary.href}>{hero.secondary.label}</ArrowLink>
            </div>
          </Reveal>
        </div>
        <div className="relative min-h-[420px]">
          <div className="absolute top-0 -right-10 bottom-10 left-10 bg-blush/70" aria-hidden />
          <ImageReveal delay={0.25} className="relative h-full lg:translate-y-10">
            <Photo slot={hero.color} priority className="h-full min-h-[420px] w-full" sizes="(max-width: 1024px) 100vw, 50vw" />
          </ImageReveal>
        </div>
      </div>
    </section>
  );
}

export const heroes = { a: HeroA, b: HeroB, c: HeroC };
