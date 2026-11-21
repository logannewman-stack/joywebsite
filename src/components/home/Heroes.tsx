import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ButtonLink, ArrowLink } from "../ui/Links";
import { LineReveal, Reveal, ImageReveal } from "../ui/Reveal";
import { ArtDirected } from "./ArtDirected";

const { hero } = home;

type HeroProps = {
  id?: string;
  as?: "h1" | "h2";
  /**
   * Home only (Direction B): the stage holds while the next section slides up
   * over it. The page wraps the hero and that section in `.hero-hold` (see
   * src/app/styles/home.css); the header's dark marker then moves off the
   * held stage, which would otherwise stay "behind the header" all the way.
   */
  hold?: boolean;
};

/*
 * Three directions for the opening screen. All use the same approved copy,
 * broken into the same four lines.
 * A: Editorial White   (white page, one large portrait locked to the headline)
 * B: Black Stage       (black, photograph bleeding off the right edge; the Home default)
 * C: Ivory & the Room  (warm ivory, a color photograph from a real room)
 *
 * Opening motion, one move each and in sequence: photo first, then the
 * headline lines, then the sub-line and buttons.
 */
const lines = [
  "The work has",
  "always been",
  <em key="a">bigger than</em>,
  <em key="b">the chair.</em>,
];

function Actions({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <ButtonLink href={hero.primary.href} tone={dark ? "dark" : "light"}>
        {hero.primary.label}
      </ButtonLink>
      <ArrowLink href={hero.secondary.href} className={dark ? "text-white" : ""}>
        {hero.secondary.label}
      </ArrowLink>
    </div>
  );
}

/** A: white page; the portrait runs the full height of the opening screen beside the headline. */
export function HeroA({ id = "hero-heading", as: H = "h1" }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-paper pt-[4.75rem]" aria-labelledby={id}>
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 px-5 pt-6 pb-14 md:px-10 md:pt-10 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.74fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:pt-8 lg:pb-10">
        <H id={id} className="display relative z-10 text-[clamp(3.4rem,min(9vw,15.5svh),10.4rem)] leading-[0.88] lg:col-start-1 lg:row-start-1">
          <LineReveal lines={lines} delay={0.05} />
        </H>
        {/* Below lg the portrait follows the headline, so her face is on the first phone screen. */}
        <div className="relative mt-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mr-10 lg:mt-0">
          <ImageReveal immediate className="h-full">
            <Photo
              slot={hero.portrait}
              priority
              className="aspect-[4/5] w-full lg:aspect-auto lg:h-full"
              sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 42vw, 43.1vw"
            />
          </ImageReveal>
        </div>
        <Reveal immediate delay={0.25} className="mt-8 grid gap-7 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:self-end lg:pt-10">
          <p className="max-w-[26rem] text-[1.125rem] leading-relaxed text-stone md:text-[1.1875rem]">{hero.sub}</p>
          <Actions />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * B: black stage. On landscape screens from 1024px the photograph bleeds off
 * the right edge; on phones and portrait tablets it rises under the headline.
 * Either way it dissolves into black on its inner edge. The section is marked
 * data-header="dark" so the header keeps its dark style while over it.
 */
export function HeroB({ id = "hero-heading", as: H = "h1", hold = false }: HeroProps) {
  const photographic = hero.bStyle === "photo";
  return (
    <section
      data-header={hold ? undefined : "dark"}
      className={`relative isolate overflow-hidden bg-ink text-white ${hold ? "hero-stage" : ""}`}
      aria-labelledby={id}
    >
      {/* Held stage: this marker keeps the header dark while the stage scrolls normally (phones, portrait).
          Where the stage holds (landscape from 1024px), the page's own marker in .hero-hold takes over. */}
      {hold && <div aria-hidden data-header="dark" className="pointer-events-none absolute inset-0 -z-20 lg:landscape:hidden" />}
      {/* Short portrait phones: the stage runs past the fold, so the screen edge crops the photo and its fade to black stays below her face. */}
      <div className={`relative min-h-[100svh] ${photographic ? "max-md:portrait:min-h-[max(100svh,40rem)]" : ""}`}>
        {photographic ? (
          // Phones: the photo starts no higher than 20rem, because the headline's height follows the
          // width, not the height; on short screens (iPhone SE) 47svh would put the bun into "the chair.".
          // Landscape phones keep 47svh: the headline sits beside her there.
          <div className="absolute inset-x-0 top-[max(47svh,20rem)] bottom-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_22%)] max-md:landscape:top-[47svh] md:top-[42svh] lg:landscape:inset-y-0 lg:landscape:right-0 lg:landscape:left-auto lg:landscape:w-[58%] lg:landscape:[mask-image:linear-gradient(to_right,transparent_0%,#000_28%)]">
            <ImageReveal immediate className="absolute inset-0">
              <ArtDirected
                wide={hero.stage}
                tall={hero.stageTall}
                at="md"
                eager
                sizesWide="(min-width: 1024px) and (orientation: landscape) 150vh, 116vw"
                sizesTall="100vw"
                className="hero-settle"
              />
            </ImageReveal>
            {/* When stacked, the photo settles into the black where the sub-line begins. */}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#0b0b0b_0%,rgba(11,11,11,0)_32%)] lg:landscape:hidden" />
          </div>
        ) : (
          <>
            {/* Soft stage light so the dark bun separates from black. */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(70%_42%_at_72%_70%,#272727_0%,#151515_55%,#0b0b0b_100%)] lg:bg-[radial-gradient(34%_58%_at_76%_40%,#2a2a2a_0%,#161616_55%,#0b0b0b_100%)]"
            />
            {/* The one designed cutout: anchored to the stage floor, soft dissolve at the waist. */}
            <div className="pointer-events-none absolute right-[-4vw] bottom-0 z-10 aspect-[1248/2003] h-[54svh] [mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)] sm:right-0 lg:right-[3vw] lg:h-[min(88svh,55rem)]">
              <ImageReveal immediate className="h-full w-full">
                <Photo slot={hero.cutout} tone="dark" priority className="h-full w-full" sizes="(max-width: 1023px) 60vw, 36vw" />
              </ImageReveal>
            </div>
          </>
        )}

        <div className="mx-auto max-w-[90rem] px-5 pt-24 md:px-10 lg:landscape:pt-[6.25rem]">
          <H id={id} className="display relative z-20 text-[clamp(3rem,14vw,3.4rem)] leading-[0.88] sm:text-[clamp(3.4rem,min(10vw,15svh,calc(26svh_-_5.625rem)),11rem)]">
            <LineReveal
              lines={[
                "The work has",
                <span key="a" className="block lg:landscape:pl-[16%]">
                  always been
                </span>,
                <em key="b" className="block text-blush">
                  bigger than
                </em>,
                <em key="c" className="block text-blush lg:landscape:pl-[8%]">
                  the chair.
                </em>,
              ]}
              delay={0.05}
            />
          </H>
        </div>
      </div>

      {/* Stacked: directly under the stage. Landscape from 1024px: pinned to the bottom-left of the first screen. */}
      <Reveal
        immediate
        delay={0.25}
        className="relative z-20 mx-auto grid max-w-[90rem] gap-7 px-5 pt-4 pb-16 md:px-10 lg:landscape:absolute lg:landscape:inset-x-0 lg:landscape:bottom-0 lg:landscape:pt-0 lg:landscape:pb-12"
      >
        <p className="max-w-[30rem] text-[1.125rem] leading-relaxed text-white/80 md:text-[1.1875rem]">{hero.sub}</p>
        <Actions dark />
      </Reveal>

      {hold && (
        <>
          {/* "Scroll": a quiet cue at the foot of the first screen, wide screens only. It fades as the page moves. */}
          <div aria-hidden className="hero-cue pointer-events-none absolute right-10 bottom-12 z-20 hidden items-center gap-4 lg:landscape:flex">
            <span className="label !text-[0.65625rem] text-white/80">Scroll</span>
            <span className="hero-cue-line block h-px w-16 bg-white/60" />
          </div>
          {/* The stage dims as the next section slides up over it. */}
          <div aria-hidden className="hero-dim pointer-events-none absolute inset-0 z-30 bg-ink opacity-0" />
        </>
      )}
    </section>
  );
}

/** C: ivory, a color photograph of a real room, blush used once behind it. */
export function HeroC({ id = "hero-heading", as: H = "h1" }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-ivory pt-[4.75rem]" aria-labelledby={id}>
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 px-5 pt-6 pb-14 md:px-10 md:pt-10 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-x-16 lg:pt-12 lg:pb-16">
        {/* Phones: headline, photo, then the sub-line (order). lg: headline and sub-line centered beside the photo. */}
        <div className="contents lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:justify-center">
          <H id={id} className="display order-1 text-[clamp(3.4rem,min(7.4vw,13svh),8.4rem)] leading-[0.9]">
            <LineReveal lines={lines} delay={0.05} />
          </H>
          <Reveal immediate delay={0.25} className="order-3 mt-8 max-w-md lg:mt-10">
            <p className="text-[1.125rem] leading-relaxed text-stone md:text-[1.1875rem]">{hero.sub}</p>
            <div className="mt-8">
              <Actions />
            </div>
          </Reveal>
        </div>
        <div className="relative order-2 mt-8 lg:col-start-2 lg:row-start-1 lg:mt-0 lg:min-h-[26.25rem]">
          <div className="absolute top-0 -right-10 bottom-10 left-10 hidden bg-blush/70 lg:block" aria-hidden />
          <ImageReveal immediate className="relative h-full lg:translate-y-10">
            <Photo
              slot={hero.color}
              priority
              className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-auto lg:h-full"
              sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 50vw, 48.6vw"
            />
          </ImageReveal>
        </div>
      </div>
    </section>
  );
}

export const heroes = { a: HeroA, b: HeroB, c: HeroC };
