import Image from "next/image";
import { notes, site } from "@/content/site";
import { speaking } from "@/content/speaking";
import { InView } from "@/components/motion/InView";

/** Shown at launch only once the list is confirmed (or cleared logos exist). */
export function showSpokenAt() {
  const { logos, verified } = speaking.spokenAt;
  return logos.length > 0 || verified || site.showPlaceholders;
}

/*
 * Setting the wall. Set widths are estimated in em of the heading face at the
 * wall's size (measured on the current list: M and W are the widest, then the
 * other capitals, then lower case; i, l, r, t, f, spaces and punctuation are
 * narrow), with a gap between names. The estimate only decides where the rows
 * break: speaking.css moves each row by its real width.
 */
const GAP_EM = 1.6;
/** About the width of the page column at the wall's type size. */
const ROW_EM = 51;

function setWidth(name: string): number {
  let em = 0;
  for (const ch of name) em += /[MWmw]/.test(ch) ? 0.97 : /[A-Z]/.test(ch) ? 0.8 : /[il’' ]/.test(ch) ? 0.25 : /[rtf()]/.test(ch) ? 0.37 : 0.64;
  return em;
}

/**
 * The venues in rows, keeping their order. Each row is set as close as it can
 * be to the width of the page column; a row that runs long (and puts a name
 * outside the column for part of the scroll) counts twice as much as one
 * that falls short by the same amount.
 */
function wallRows(venues: string[]): string[][] {
  const n = venues.length;
  if (n === 0) return [];
  // upTo[j]: the width of the first j names, without gaps.
  const upTo = [0];
  for (const v of venues) upTo.push(upTo[upTo.length - 1] + setWidth(v));
  const count = Math.min(n, Math.max(1, Math.round((upTo[n] + GAP_EM * n) / (ROW_EM + GAP_EM))));
  // cost[r][j]: the best setting of the first j names in r rows; from[r][j]: where its last row starts.
  const cost = Array.from({ length: count + 1 }, () => new Array<number>(n + 1).fill(Infinity));
  const from = Array.from({ length: count + 1 }, () => new Array<number>(n + 1).fill(0));
  cost[0][0] = 0;
  for (let r = 1; r <= count; r++) {
    for (let j = r; j <= n; j++) {
      for (let i = r - 1; i < j; i++) {
        const over = upTo[j] - upTo[i] + GAP_EM * (j - i - 1) - ROW_EM;
        const c = cost[r - 1][i] + (over > 0 ? 2 : 1) * over * over;
        if (c < cost[r][j]) {
          cost[r][j] = c;
          from[r][j] = i;
        }
      }
    }
  }
  const cuts = [n];
  for (let r = count; r > 0; r--) cuts.unshift(from[r][cuts[0]]);
  return cuts.slice(1).map((end, r) => venues.slice(cuts[r], end));
}

/**
 * Where I've Spoken. Until conference logos are cleared, the venues are set
 * as type only: a wall of names rather than a logo wall. Review mode tags the
 * list as unconfirmed.
 *
 * The list itself is one quiet run of names in the approved order, in two
 * columns beside the section's label (one column on phones). It is what
 * phones, tablets, touch screens, print, reduced motion and no JavaScript
 * show at every width.
 *
 * On a laptop or desktop with a mouse or trackpad, with motion on, the names
 * are set instead as a wall under the label: rows of heading type the width
 * of the page column, alternately ink and grey. A row drifts sideways as the
 * visitor scrolls, by exactly the difference between its own width and the
 * column's, and each row runs the opposite way to its neighbours (nothing
 * moves on its own): it starts against one edge of the column and ends
 * against the other, so every name is on screen, whole, during a normal
 * scroll. The wall is a decorative copy; the list stays in place for
 * assistive technology. Touch screens keep the list because rows that run
 * past the column look swipeable and are not. Which of the two shows is
 * decided in speaking.css ("Wall of names").
 */
export function SpokenAt() {
  if (!showSpokenAt()) return null;
  const { heading, logos, verified, venues } = speaking.spokenAt;
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <InView className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-4 lg:block lg:pt-1.5">
          <h2 className="label rise text-stone">{heading}</h2>
          {!verified && notes && (
            <p className="label inline-block border border-ink/25 px-2 py-1 leading-relaxed text-stone lg:mt-4">
              From Testimonials.pdf (partial listing): confirm before launch
            </p>
          )}
        </InView>

        {logos.length > 0 ? (
          <ul className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-10 lg:col-span-8 lg:col-start-5 lg:mt-0">
            {logos.map((l) => (
              <li key={l.name} className="relative h-10 w-32">
                <Image src={l.src} alt={l.name} fill sizes="(max-width: 1440px) 128px, 8.9vw" className="object-contain grayscale" />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <InView className="sp-venues mt-8 lg:col-span-8 lg:col-start-5 lg:mt-0">
              {/* role: an unstyled list still reads as a list of 23 in every screen reader. */}
              <ul role="list" className="rise t-body sm:columns-2 sm:gap-x-6">
                {venues.map((v) => (
                  <li key={v} className="break-inside-avoid pb-3 text-pretty">
                    {v}
                  </li>
                ))}
              </ul>
            </InView>

            {/* The wall of names (decorative copy of the list above). Each row reads its own --v (see speaking.css). */}
            <div aria-hidden className="sp-wall display t-h3 lg:col-span-12">
              {wallRows(venues).map((row, r) => (
                <div key={r} data-view="" suppressHydrationWarning className="sp-wall-row">
                  <div className="sp-wall-line">
                    {row.map((v) => (
                      <span key={v}>{v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
