import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ArrowLink } from "../ui/Links";
import { typeset } from "../ui/Typeset";
import { PathwaysMeter } from "./PathwaysMeter";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/*
 * The four pathways, one list in three layouts:
 *
 * - Animated, from 1024px: a sideways-scrolling sequence. The section pins
 *   (page.tsx wraps this in a Scene) and the row slides past as the visitor
 *   scrolls: each panel is its 4:5 photograph beside its words, with a large
 *   outlined numeral as texture. Layout and motion: home.css ("Explore My Work").
 * - Phones and tablets: a swipeable row that snaps card by card, with the
 *   next card peeking in and a "01 / 04" progress line under it.
 * - From 1024px without motion (reduced motion, no JavaScript, print): the
 *   four cards side by side as a grid.
 *
 * In every layout the whole card is one link (the link's ::after covers it),
 * so pointer, touch and keyboard users get the same target; hover and
 * keyboard focus both ease the photograph in. Nothing floats over the words.
 */

// Photo widths: a 4:5 crop that is 78% of a phone screen, about 44% of a tablet's, and about 30% of a wide screen's.
const sizes = "(max-width: 639px) 78vw, (max-width: 1023px) 44vw, (max-width: 1440px) 32vw, 30vw";

const pad = (n: number) => String(n).padStart(2, "0");

export function Pathways() {
  const total = home.pathways.length;
  return (
    <>
      <ol
        data-scene-track
        data-carousel
        className="work-track flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-1 [scrollbar-width:none] md:scroll-px-10 md:gap-6 md:px-10 lg:mx-auto lg:grid lg:max-w-[90rem] lg:snap-none lg:grid-cols-2 lg:gap-x-8 lg:gap-y-20 lg:overflow-visible xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {home.pathways.map((p, i) => (
          <li
            key={p.kicker}
            data-scene-panel
            style={{ "--c": total > 1 ? i / (total - 1) : 0 } as Vars}
            className="work-panel group relative w-[78%] shrink-0 snap-start self-start has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[0.625rem] has-[:focus-visible]:outline-ink sm:w-[44%] lg:w-auto lg:even:mt-24 xl:even:mt-28"
          >
            <div className="work-photo overflow-hidden bg-sand">
              <Photo
                slot={p.photo}
                sizes={sizes}
                className="work-photo-in aspect-[4/5] w-full transition-transform duration-(--duration-image) ease-expo group-hover:scale-[1.04] group-has-[:focus-visible]:scale-[1.04] motion-reduce:transition-none"
              />
            </div>
            <div className="work-text">
              <span aria-hidden className="work-numeral">
                {pad(i + 1)}
              </span>
              <div className="work-kicker mt-6 flex items-baseline gap-3 border-t border-ink pt-4">
                <span className="work-index label text-stone tabular-nums">{pad(i + 1)}</span>
                <h3 className="label">{p.kicker}</h3>
              </div>
              <p className="work-heading display mt-5 text-[clamp(1.75rem,6.6vw,2.1rem)] leading-[1.04] sm:text-[clamp(1.85rem,3.4vw,2.25rem)] xl:text-[clamp(1.75rem,2vw,2.1rem)]">
                {typeset(p.heading)}
              </p>
              <p className="work-body mt-4 text-[0.96875rem] leading-relaxed text-stone">{p.body}</p>
              {/* The link's ::after covers the card, so the photo and words are part of one target. */}
              <ArrowLink href={p.link.href} className="mt-5 focus-visible:outline-none after:absolute after:inset-0 after:content-['']">
                {p.link.label}
              </ArrowLink>
            </div>
          </li>
        ))}
      </ol>
      <PathwaysMeter total={total} />
    </>
  );
}
