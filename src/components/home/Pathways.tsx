import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ArrowLink } from "../ui/Links";
import { typeset } from "../ui/Typeset";

/*
 * The four pathways, side by side: four cards on the page's twelve columns,
 * each a 4:5 photograph with the pathway's name as a small label, its
 * one-line summary as the card's heading, the paragraph and the link. The
 * links sit on one line across the row whatever the length of the text.
 *
 * - From 1024px: four across.
 * - 640px to 1023px: two across.
 * - Phones: one card under another, the photograph beside the label and the
 *   heading, then the paragraph and the link across the card.
 *
 * Each card rises when it is reached, one after another. The whole card is
 * one link (the link's ::after covers it), so pointer, touch and keyboard
 * users get the same target; hover and keyboard focus both ease the
 * photograph in, and focus draws a ring around the card.
 */

// Photo widths: about a third of a phone screen beside the heading; half the column from 640px; a fifth of a wide screen.
const sizes = "(max-width: 639px) 36vw, (max-width: 1023px) 45vw, (max-width: 1440px) 20vw, 19vw";

export function Pathways() {
  return (
    <ol data-inview="" suppressHydrationWarning className="stagger mt-10 grid gap-y-12 sm:grid-cols-2 sm:gap-x-6 md:mt-14 lg:grid-cols-4">
      {home.pathways.map((p) => (
        <li key={p.kicker}>
          <div className="group relative grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-x-5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[0.75rem] has-[:focus-visible]:outline-ink sm:flex sm:h-full sm:flex-col sm:items-stretch">
            <div className="overflow-hidden bg-mist">
              <Photo
                slot={p.photo}
                sizes={sizes}
                className="aspect-[4/5] w-full transition-transform duration-(--duration-image) ease-expo group-hover:scale-[1.04] group-has-[:focus-visible]:scale-[1.04] motion-reduce:transition-none"
              />
            </div>
            <div className="sm:mt-5">
              <p className="label text-stone">{p.kicker}</p>
              <h3 className="display t-h3 mt-2.5">{typeset(p.heading)}</h3>
            </div>
            <p className="col-span-2 mt-5 text-[0.9375rem] leading-relaxed text-stone sm:mt-3">{p.body}</p>
            {/* The link's ::after covers the card, so the photograph and the words are part of one target. */}
            <ArrowLink href={p.link.href} className="col-span-2 mt-2 self-start focus-visible:outline-none after:absolute after:inset-0 after:content-[''] sm:mt-auto sm:pt-2">
              {p.link.label}
            </ArrowLink>
          </div>
        </li>
      ))}
    </ol>
  );
}
