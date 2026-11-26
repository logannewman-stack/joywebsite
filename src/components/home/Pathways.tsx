import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ArrowLink } from "../ui/Links";
import { typeset } from "../ui/Typeset";
import { keepCompounds } from "@/components/ui/keepCompounds";

/*
 * The four pathways. Each is a card: a 4:5 photograph, the pathway's name as
 * a small label, its one-line summary as the card's heading, the paragraph
 * and the link.
 *
 * From 1024px the cards are the panels of a sideways track inside the pinned
 * "Explore My Work" scene (src/app/page.tsx): each card is set wide, the
 * photograph beside its words, and the row travels across the stage as the
 * visitor scrolls (home.css, "Explore My Work"). Without the scene (no
 * JavaScript, reduced motion, print) they are four cards side by side.
 *
 * - 640px to 1023px: two across.
 * - Phones: one card under another, the photograph beside the label and the
 *   heading, then the paragraph and the link across the card.
 *
 * Unpinned, each card rises when it is reached, one after another. The whole
 * card is one link (the link's ::after covers it), so pointer, touch and
 * keyboard users get the same target; hover and keyboard focus both ease the
 * photograph in, and focus draws a ring around the card. Inside the scene the
 * engine brings a focused card onto the stage.
 */

// Photo widths: about a third of a phone screen beside the heading; half the column from 640px; about a fifth of a wide screen.
const sizes = "(max-width: 639px) 36vw, (max-width: 1023px) 45vw, (max-width: 1440px) 22vw, 21vw";

export function Pathways() {
  return (
    <ol
      data-scene-track
      data-inview=""
      suppressHydrationWarning
      className="work-track stagger mx-auto grid max-w-(--wrap) gap-y-12 px-5 sm:grid-cols-2 sm:gap-x-6 md:px-10 lg:grid-cols-4"
    >
      {home.pathways.map((p) => (
        <li key={p.kicker} data-scene-panel className="work-panel">
          <div className="work-card group relative grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-x-5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[0.75rem] has-[:focus-visible]:outline-ink sm:flex sm:h-full sm:flex-col sm:items-stretch">
            <div className="work-photo overflow-hidden bg-mist">
              <Photo
                slot={p.photo}
                sizes={sizes}
                className="aspect-[4/5] w-full transition-transform duration-(--duration-image) ease-expo group-hover:scale-[1.04] group-has-[:focus-visible]:scale-[1.04] motion-reduce:transition-none"
              />
            </div>
            <div className="work-words sm:mt-5">
              <p className="label text-stone">{p.kicker}</p>
              <h3 className="display t-h3 mt-2.5 pinned:t-h2 pinned:mt-4">{typeset(p.heading)}</h3>
            </div>
            <p className="work-body col-span-2 mt-5 text-[0.9375rem] leading-relaxed text-stone sm:mt-3 pinned:t-body">{keepCompounds(p.body)}</p>
            {/* The link's ::after covers the card, so the photograph and the words are part of one target. */}
            <ArrowLink href={p.link.href} className="work-link col-span-2 mt-2 self-start focus-visible:outline-none after:absolute after:inset-0 after:content-[''] sm:mt-auto sm:pt-2">
              {p.link.label}
            </ArrowLink>
          </div>
        </li>
      ))}
    </ol>
  );
}
