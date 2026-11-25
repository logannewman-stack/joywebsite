import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ArrowLink } from "../ui/Links";
import { typeset } from "../ui/Typeset";

/*
 * The four pathways: one list, one row each, under a thin line. All four are
 * on the page at every width; nothing waits behind a swipe.
 *
 * - From 1024px a row is three parts on the page's twelve columns: the 4:5
 *   photograph (three columns, a quarter of the page column), the pathway's
 *   name with its one-line summary under it (four), and the paragraph with
 *   the link (four).
 * - 640px to 1023px: the photograph on the left (four columns) and the name,
 *   the summary, the paragraph and the link in one column beside it.
 * - Phones: the name across the row, then the photograph beside the summary,
 *   then the paragraph and the link across the row.
 *
 * Each row rises when it is reached, and its photograph settles from
 * slightly large.
 *
 * In every layout the whole row is one link (the link's ::after covers it),
 * so pointer, touch and keyboard users get the same target; hover and
 * keyboard focus both ease the photograph in, and focus draws a ring around
 * the row, inside its lines.
 */

// Photo widths: about a third of a phone screen beside the summary; just under a third from 640px; a fifth of a wide screen.
const sizes = "(max-width: 639px) 36vw, (max-width: 1023px) 32vw, 19vw";

export function Pathways() {
  return (
    <ol className="mt-10 md:mt-14">
      {home.pathways.map((p) => (
        <li key={p.kicker} data-inview="" suppressHydrationWarning className="rise border-t border-line py-8 last:pb-0 md:py-10">
          <div className="group relative grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[0.75rem] has-[:focus-visible]:outline-ink sm:grid-cols-12 sm:grid-rows-[auto_auto_1fr] sm:gap-x-6 lg:grid-rows-[auto_1fr]">
            <div className="row-start-2 overflow-hidden bg-mist sm:col-span-4 sm:row-span-3 sm:row-start-1 lg:col-span-3 lg:row-span-2">
              <div className="settle">
                <Photo
                  slot={p.photo}
                  sizes={sizes}
                  className="aspect-[4/5] w-full transition-transform duration-(--duration-image) ease-expo group-hover:scale-[1.04] group-has-[:focus-visible]:scale-[1.04] motion-reduce:transition-none"
                />
              </div>
            </div>
            <h3 className="display t-h2 col-span-2 row-start-1 mb-5 sm:col-span-8 sm:col-start-5 sm:mb-0 lg:col-span-4 lg:col-start-5">{typeset(p.kicker)}</h3>
            <p className="t-lead row-start-2 self-center text-ink sm:col-span-8 sm:col-start-5 sm:mt-3 sm:self-start lg:col-span-4 lg:col-start-5 lg:mt-4">{typeset(p.heading)}</p>
            <div className="col-span-2 row-start-3 mt-5 flex flex-col items-start sm:col-span-8 sm:col-start-5 sm:mt-4 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:mt-0">
              <p className="t-body text-stone">{p.body}</p>
              {/* The link's ::after covers the row, so the photo and words are part of one target. */}
              <ArrowLink href={p.link.href} className="mt-2 focus-visible:outline-none after:absolute after:inset-0 after:content-[''] lg:mt-auto lg:-mb-2.5">
                {p.link.label}
              </ArrowLink>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
