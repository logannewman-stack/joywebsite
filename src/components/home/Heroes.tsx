import type { CSSProperties, ReactNode } from "react";
import { home } from "@/content/home";
import type { PhotoSlot } from "@/content/site";
import { Photo } from "../ui/Photo";
import { ButtonLink, ArrowLink } from "../ui/Links";
import { LineReveal, Reveal, ImageReveal } from "../ui/Reveal";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const { hero } = home;

type HeroProps = {
  id?: string;
  as?: "h1" | "h2";
};

/*
 * Three directions for the opening screen. All use the same approved copy,
 * broken into the same four lines, and the same arrangement: the headline,
 * the sub-line and the two actions on the left, one photograph on the right.
 * A: Editorial White   (white page, the portrait)
 * B: Black Stage       (black, her photograph in full colour; the Home default)
 * C: White & the Room  (white page, a photograph from a real room)
 * A and C are shown on the review page /directions only.
 *
 * Opening motion, one move each and in sequence: photo first, then the
 * headline lines, then the sub-line and buttons.
 */
const lines = ["The work has", "always been", "bigger than", "the chair."];

/** The page's key phrase, over the pale pink marker. On black the marker draws once the lines have risen (home.css, "Opening"). */
const mark = (text: string, delay: number): ReactNode => (
  <span className="hero-mark hl-dark" style={{ "--d": `${delay}s` } as Vars}>
    {text}
  </span>
);

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

/** A and C: a white opening. The words take six columns; the photograph stands in the last five. */
function LightHero({ id, as: H, slot, frame }: Required<HeroProps> & { slot: PhotoSlot; frame: string }) {
  return (
    <section className="bg-paper pt-(--header-height)" aria-labelledby={id}>
      <div className="mx-auto max-w-(--wrap) px-5 pt-10 pb-16 md:px-10 md:pt-14 md:pb-20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="lg:col-span-6">
          <H id={id} className="display t-hero">
            <LineReveal lines={lines} delay={0.05} />
          </H>
          <Reveal immediate delay={0.25} className="mt-7 md:mt-8">
            <p className="t-lead max-w-[27rem] text-ink">{hero.sub}</p>
            <div className="mt-8">
              <Actions />
            </div>
          </Reveal>
        </div>
        <ImageReveal immediate className="mt-12 w-[min(100%,24rem)] lg:col-span-5 lg:col-start-8 lg:mt-0 lg:w-auto">
          <Photo slot={slot} priority className={`${frame} w-full`} sizes="(max-width: 1023px) min(100vw - 40px, 384px), 33vw" />
        </ImageReveal>
      </div>
    </section>
  );
}

/** A: white page, the portrait in a 4:5 frame. */
export function HeroA({ id = "hero-heading", as = "h1" }: HeroProps) {
  return <LightHero id={id} as={as} slot={hero.portrait} frame="aspect-[4/5]" />;
}

/**
 * B: the black stage. Her photograph, in full colour, stands in the right
 * half of the page column (six of its twelve columns, about two fifths of
 * the screen); the headline, the sub-line and the two actions sit beside it,
 * centred on its height. From 1024px the opening is one screen tall and the
 * photograph never taller than the room under the header. On phones the words
 * come first and the photograph follows, no wider than the column.
 * The section is marked data-header="dark", so the header keeps its dark
 * style while over it.
 */
export function HeroB({ id = "hero-heading", as: H = "h1" }: HeroProps) {
  const cutout = hero.bStyle === "cutout";
  return (
    <section data-header="dark" className="bg-ink text-white" aria-labelledby={id}>
      <div className="mx-auto max-w-(--wrap) px-5 pt-(--header-height) md:grid md:grid-cols-12 md:items-center md:gap-x-6 md:px-10 lg:min-h-[min(100svh,60rem)]">
        <div className="pt-10 md:col-span-7 md:py-16 lg:col-span-6">
          <H id={id} className="display t-hero">
            <LineReveal lines={[lines[0], lines[1], mark(lines[2], 0.65), mark(lines[3], 0.8)]} delay={0.05} />
          </H>
          <Reveal immediate delay={0.25} className="mt-7 md:mt-8">
            <p className="t-lead max-w-[27rem] text-white/85">{hero.sub}</p>
            <div className="mt-8">
              <Actions dark />
            </div>
          </Reveal>
        </div>

        {cutout ? (
          // The cut-out keeps its own outline and stands on the foot of the stage.
          <div className="mx-auto mt-12 w-[min(100%,18rem)] md:col-span-5 md:mx-0 md:mt-0 md:w-auto md:self-end md:pt-10 lg:col-span-6 lg:col-start-7 lg:px-[14%]">
            <Photo slot={hero.cutout} tone="dark" priority className="aspect-[1248/2003] w-full" sizes="(max-width: 767px) 288px, 28vw" />
          </div>
        ) : (
          <div className="mt-12 pb-16 md:col-span-5 md:mt-0 md:py-16 lg:col-span-6 lg:col-start-7 lg:py-12">
            <ImageReveal immediate className="w-[min(100%,24rem)] md:w-auto">
              {/* 4:5, and on a short wide screen no taller than the room under the header: the frame keeps its width and crops from the foot. */}
              <div className="aspect-[4/5] w-full overflow-hidden lg:max-h-[calc(100svh-var(--header-height)-6rem)]">
                <Photo slot={hero.stageTall} tone="dark" priority className="hero-settle h-full w-full" sizes="(max-width: 767px) min(100vw - 40px, 384px), 39vw" />
              </div>
            </ImageReveal>
          </div>
        )}
      </div>
    </section>
  );
}

/** C: white page, a colour photograph of a real room in a 4:5 frame. */
export function HeroC({ id = "hero-heading", as = "h1" }: HeroProps) {
  return <LightHero id={id} as={as} slot={hero.color} frame="aspect-[4/5]" />;
}

export const heroes = { a: HeroA, b: HeroB, c: HeroC };
