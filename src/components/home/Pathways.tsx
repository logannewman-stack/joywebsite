import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ArrowLink } from "../ui/Links";
import { typeset } from "../ui/Typeset";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/*
 * The four pathways, one list in four layouts. All four are on the page in
 * every one of them; nothing waits behind a swipe.
 *
 * - Animated, from 1024px: a sideways-scrolling sequence. The section pins
 *   (page.tsx wraps this in a Scene) and the row slides past as the visitor
 *   scrolls: each panel is its 4:5 photograph beside its words, with a large
 *   outlined numeral as texture. Layout and motion: home.css ("Explore My Work").
 * - Phones (below 640px): four compact rows, one under another. Each row is
 *   its photograph beside its name and heading, with the paragraph and the
 *   link beneath, under a gold hairline (home.css places the pieces).
 * - 640px to 1023px: a two-by-two grid of cards, photograph above the words.
 * - From 1024px without motion (reduced motion, no JavaScript, print): the
 *   four cards side by side as a grid.
 *
 * Entrances: from 1024px the cards rise one after another the first time the
 * row is seen (the list is the [data-inview]). Below that each row is its own
 * [data-inview]: it rises, and its hairline draws, when it is reached.
 *
 * In every layout the whole card is one link (the link's ::after covers it),
 * so pointer, touch and keyboard users get the same target; hover and
 * keyboard focus both ease the photograph in. Nothing floats over the words.
 * The numerals are decoration (the list is ordered): hidden from assistive
 * technology everywhere.
 */

// Photo widths: about 36% of a phone screen beside its words, just under half a tablet's, and about a third of a wide screen's.
const sizes = "(max-width: 639px) 36vw, (max-width: 1023px) 46vw, 33vw";

const pad = (n: number) => String(n).padStart(2, "0");

export function Pathways() {
  const total = home.pathways.length;
  return (
    <ol
      data-scene-track
      data-inview=""
      suppressHydrationWarning
      className="work-track stagger px-5 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 md:gap-x-8 md:px-10 lg:mx-auto lg:max-w-[90rem] lg:gap-y-20 xl:grid-cols-4"
    >
      {home.pathways.map((p, i) => (
        <li
          key={p.kicker}
          data-scene-panel
          data-inview=""
          suppressHydrationWarning
          style={{ "--c": total > 1 ? i / (total - 1) : 0 } as Vars}
          className="work-panel group relative has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[0.625rem] has-[:focus-visible]:outline-ink sm:even:mt-16 lg:even:mt-24 xl:even:mt-28"
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
            <div className="work-words">
              {/* The hairline over the words: gold, and it draws, below 1024px; ink in the wide layouts. */}
              <span aria-hidden className="work-line block h-px bg-gold-deep sm:mt-6 lg:bg-ink" />
              <div className="work-kicker flex items-baseline gap-3 sm:pt-4">
                <span aria-hidden className="work-index label text-stone tabular-nums">
                  {pad(i + 1)}
                </span>
                <h3 className="label">{p.kicker}</h3>
              </div>
              <p className="work-heading display text-[clamp(1.3125rem,6vw,1.625rem)] leading-[1.04] sm:mt-5 sm:text-[clamp(1.85rem,3.4vw,2.25rem)] xl:text-[clamp(1.75rem,2vw,2.1rem)]">
                {typeset(p.heading)}
              </p>
              <p className="work-body mt-3.5 text-[0.9375rem] leading-[1.55] text-stone sm:mt-4 sm:text-[0.96875rem] sm:leading-relaxed">{p.body}</p>
              {/* The link's ::after covers the card, so the photo and words are part of one target. */}
              <ArrowLink href={p.link.href} className="work-link mt-1 focus-visible:outline-none after:absolute after:inset-0 after:content-[''] sm:mt-5">
                {p.link.label}
              </ArrowLink>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
