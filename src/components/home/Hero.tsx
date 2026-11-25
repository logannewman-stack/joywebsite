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
 * beside it, centred on the height of the stage. From 1024px the opening is
 * one screen tall. From 768px to 1023px the two still stand side by side. On
 * phones the words come first and the portrait follows, centred. The section
 * is marked data-header="dark", so the header keeps its dark style over it.
 *
 * Opening motion, one move each and in sequence: the portrait first, then
 * the headline lines, then the sub-line and buttons.
 */
export function Hero() {
  return (
    <section data-header="dark" className="bg-ink text-white" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-(--wrap) px-5 pt-(--header-height) md:grid md:grid-cols-12 md:items-center md:gap-x-6 md:px-10 lg:min-h-[min(100svh,56rem)]">
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
    </section>
  );
}
