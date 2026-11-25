import type { CSSProperties, ReactNode } from "react";
import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ButtonLink, ArrowLink } from "../ui/Links";
import { LineReveal, Reveal } from "../ui/Reveal";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const { hero } = home;

/** The approved headline, hand-set on four lines. */
const lines = ["The work has", "always been", "bigger than", "the chair."];

/** One line of the page's key phrase, with the pale pink marker (.hl-dark). The marker draws from the left once the lines have risen (home.css, "Opening"). */
const mark = (text: string, delay: number): ReactNode => (
  <span className="hero-mark hl-dark" style={{ "--d": `${delay}s` } as Vars}>
    {text}
  </span>
);

/**
 * Home's opening: the black stage. Her portrait, in full colour with its
 * background removed, stands straight on the black at the right (five of the
 * twelve columns, about a third of the screen) with its foot on the bottom
 * edge of the section; the headline, the sub-line and the two actions sit
 * beside it, centred on the height of the stage. From 768px to 1023px the
 * two still stand side by side. On phones the words come first and the
 * portrait follows, centred.
 *
 * On landscape screens from 1024px the stage is exactly one screen and it
 * holds: it stays where it is while the story slides up over it, dimming as
 * it is covered, and a small "Scroll" cue at its foot fades as the page
 * moves (home.css, "Opening"). The page wraps the stage and the story in
 * .hero-hold for that.
 *
 * The header's colour: while the stage scrolls normally, the marker inside
 * it keeps the header dark. Where the stage holds, the page's own marker in
 * .hero-hold does, because the held stage is still under the header after
 * the white story has covered it.
 *
 * Opening motion, one move each and in sequence: the portrait first, then
 * the headline lines, then the sub-line and buttons.
 */
export function Hero() {
  return (
    <section className="hero-stage relative bg-ink text-white" aria-labelledby="hero-heading">
      <div aria-hidden data-header="dark" className="pointer-events-none absolute inset-0 lg:landscape:hidden" />
      <div className="relative mx-auto max-w-(--wrap) px-5 pt-(--header-height) md:grid md:grid-cols-12 md:items-center md:gap-x-6 md:px-10 lg:min-h-[min(100svh,56rem)] lg:landscape:min-h-[100svh]">
        <div className="pt-10 md:col-span-7 md:py-16">
          <h1 id="hero-heading" className="display t-hero">
            <LineReveal lines={[lines[0], lines[1], mark(lines[2], 0.65), mark(lines[3], 0.8)]} delay={0.05} />
          </h1>
          <Reveal immediate delay={0.25} className="mt-7 md:mt-8">
            <p className="t-lead max-w-[27rem] text-white/85">{hero.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={hero.primary.href} tone="dark">
                {hero.primary.label}
              </ButtonLink>
              <ArrowLink href={hero.secondary.href} className="text-white">
                {hero.secondary.label}
              </ArrowLink>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-12 w-[min(100%,21rem)] md:col-span-5 md:mx-0 md:mt-0 md:w-auto md:self-end md:pt-6 lg:col-start-8">
          {/* 1155 x 1647: the frame has the cut-out's own proportions, so nothing is cropped and its foot meets the section edge. */}
          <Photo slot={hero.photo} tone="dark" priority className="hero-settle aspect-[1155/1647] w-full" sizes="(max-width: 767px) min(100vw - 40px, 336px), (max-width: 1440px) 36vw, 30vw" />
        </div>
      </div>

      {/* "Scroll": a quiet cue at the foot of the held stage. data-scene-vars: the engine writes the hold's
          progress (--p) here and on the dim below, nowhere else. */}
      <div aria-hidden data-scene-vars="" suppressHydrationWarning className="hero-cue pointer-events-none absolute inset-x-0 bottom-10 hidden lg:landscape:block">
        <div className="mx-auto max-w-(--wrap) px-10">
          <span className="label text-white/70">Scroll</span>
        </div>
      </div>
      {/* The stage dims as the story slides up over it. */}
      <div aria-hidden data-scene-vars="" suppressHydrationWarning className="hero-dim pointer-events-none absolute inset-0 bg-ink opacity-0" />
    </section>
  );
}
