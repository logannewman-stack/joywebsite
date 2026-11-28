import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ButtonLink, ArrowLink } from "../ui/Links";
import { LineReveal, Reveal } from "../ui/Reveal";
import { STORY_LENGTH } from "./Perspective";

const { hero } = home;

/**
 * The held stage's parts finish their moves within the first screen of
 * scrolling, which is this share of the whole hold (the opening and the story,
 * less the screen in view: the story's length). The engine
 * stops writing their progress there (data-scene-vars), so they are not
 * restyled all the way through the story.
 */
const HELD = (1 / STORY_LENGTH + 0.01).toFixed(3);

/** The approved headline, hand-set on four lines. */
const lines = ["The work has", "always been", "bigger than", "the chair."];

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
 * holds: it stays where it is while the story slides up over it. As the page
 * moves the words lift away and fade, she comes a little closer, the stage
 * dims, and the "Scroll" cue at its foot (a label and a thin line that a
 * light runs along) fades (home.css, "Opening"). The page wraps the stage
 * and the story in .hero-hold for that.
 *
 * The header's colour: while the stage scrolls normally, the marker inside
 * it keeps the header dark. Where the stage holds, the page's own marker in
 * .hero-hold does, because the held stage is still under the header after
 * the white story has covered it.
 *
 * Opening motion, one move each and in sequence: the portrait first, then
 * the headline lines, then the sub-line and buttons. With a mouse the stage
 * also answers the pointer: she leans a few pixels away from it and the light
 * behind her follows it a little further, so the opening has depth while the
 * visitor is still (data-magnetic; home.css, "Opening").
 */
export function Hero() {
  return (
    <section className="hero-stage relative overflow-clip bg-ink text-white" aria-labelledby="hero-heading" data-magnetic="0.012">
      <div aria-hidden data-header="dark" className="pointer-events-none absolute inset-0 lg:landscape:hidden" />
      {/* A soft pool of light on the black behind her: neutral grey, no colour (home.css, "Opening"). */}
      <div aria-hidden className="hero-light pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-(--wrap) px-5 pt-(--header-height) md:grid md:grid-cols-12 md:items-center md:gap-x-6 md:px-10 lg:min-h-[min(100svh,56rem)] lg:landscape:min-h-[100svh]">
        {/* data-scene-vars: on the held stage the engine writes the hold's progress here, so the words lift away as the page moves. */}
        <div data-scene-vars={HELD} data-own="" suppressHydrationWarning className="hero-copy pt-10 md:col-span-7 md:py-16">
          <h1 id="hero-heading" className="display t-hero">
            <LineReveal lines={lines} delay={0.05} />
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

        <div data-scene-vars={HELD} data-own="" suppressHydrationWarning className="hero-figure mx-auto mt-12 w-[min(100%,21rem)] md:col-span-5 md:mx-0 md:mt-0 md:w-auto md:self-end md:pt-6 lg:col-start-8">
          {/* 1155 x 1647: the frame has the cut-out's own proportions, so nothing is cropped and its foot meets the section edge. */}
          <Photo slot={hero.photo} tone="dark" priority className="hero-settle aspect-[1155/1647] w-full" sizes="(max-width: 767px) min(100vw - 40px, 336px), (max-width: 1440px) 36vw, 30vw" />
        </div>
      </div>

      {/* "Scroll": a quiet cue at the foot of the held stage. data-scene-vars: the engine writes the hold's
          progress (--p) here and on the dim below, nowhere else. */}
      <div aria-hidden data-scene-vars={HELD} data-own="" suppressHydrationWarning className="hero-cue pointer-events-none absolute inset-x-0 bottom-10 hidden lg:landscape:block">
        <div className="mx-auto max-w-(--wrap) px-10">
          <span className="label inline-flex items-center gap-4 text-white/70">
            Scroll
            <span className="hero-cue-line" />
          </span>
        </div>
      </div>
      {/* The stage dims as the story slides up over it. */}
      <div aria-hidden data-scene-vars={HELD} data-own="" suppressHydrationWarning className="hero-dim pointer-events-none absolute inset-0 bg-ink opacity-0" />
    </section>
  );
}
