import { Fragment } from "react";
import Image from "next/image";
import { site } from "@/content/site";
import { speaking } from "@/content/speaking";
import { InView } from "@/components/motion/InView";

/** Shown at launch only once the list is confirmed (or cleared logos exist). */
export function showSpokenAt() {
  const { logos, verified } = speaking.spokenAt;
  return logos.length > 0 || verified || site.showPlaceholders;
}

/*
 * Setting the wall. Set widths are estimated in em of the wall's serif
 * (measured on the current list: capitals and m, w are wide; i, l, t and
 * their like, spaces and punctuation narrow; italic a little wider), with a
 * gold mark and its space between names. The estimate only decides where the
 * rows break: speaking.css moves each row by its real width.
 */
const ITALIC = 1.066;
const MARK_EM = 1.27;
/** The longest row that sits whole between the page margins at the wall's type size (3vw). */
const ROW_EM = 32.5;

function setWidth(name: string): number {
  let em = 0;
  for (const ch of name) em += /[A-Z]/.test(ch) ? 0.59 : /[mw]/.test(ch) ? 0.67 : /[iljtfr’'.,()–\- ]/.test(ch) ? 0.19 : 0.37;
  return em;
}

/**
 * The venues in rows, keeping their order, alternately roman and italic. Each
 * row is set as close as it can be to the length that just fits the screen; a
 * row that runs long (and puts a name off the screen for part of the scroll)
 * counts four times as much as one that falls short by the same amount. Both
 * a roman and an italic first row are tried, and the better setting kept.
 */
function wallRows(venues: string[]): { rows: string[][]; italicFirst: boolean } {
  const n = venues.length;
  if (n === 0) return { rows: [], italicFirst: false };
  // upTo[j]: the roman width of the first j names, without marks.
  const upTo = [0];
  for (const v of venues) upTo.push(upTo[upTo.length - 1] + setWidth(v));
  const count = Math.min(n, Math.max(1, Math.round((upTo[n] + MARK_EM * n) / (ROW_EM + MARK_EM))));

  let best: { cost: number; cuts: number[]; italicFirst: boolean } | undefined;
  for (const italicFirst of [false, true]) {
    // cost[r][j]: the best setting of the first j names in r rows; from[r][j]: where its last row starts.
    const cost = Array.from({ length: count + 1 }, () => new Array<number>(n + 1).fill(Infinity));
    const from = Array.from({ length: count + 1 }, () => new Array<number>(n + 1).fill(0));
    cost[0][0] = 0;
    for (let r = 1; r <= count; r++) {
      const slant = (r % 2 === 1) === italicFirst ? ITALIC : 1;
      for (let j = r; j <= n; j++) {
        for (let i = r - 1; i < j; i++) {
          const over = (upTo[j] - upTo[i]) * slant + MARK_EM * (j - i - 1) - ROW_EM;
          const c = cost[r - 1][i] + (over > 0 ? 1 : 0.25) * over * over;
          if (c < cost[r][j]) {
            cost[r][j] = c;
            from[r][j] = i;
          }
        }
      }
    }
    if (!best || cost[count][n] < best.cost) {
      const cuts = [n];
      for (let r = count; r > 0; r--) cuts.unshift(from[r][cuts[0]]);
      best = { cost: cost[count][n], cuts, italicFirst };
    }
  }
  const { cuts, italicFirst } = best!;
  return { rows: cuts.slice(1).map((end, r) => venues.slice(cuts[r], end)), italicFirst };
}

/**
 * Where I've Spoken. Until conference logos are cleared, the venues are set
 * as type only: a wall of names rather than a logo wall. Review mode tags the
 * list as unconfirmed.
 *
 * The list itself is a flowing run of names, alternately roman and italic,
 * with a gold mark between them: compact on a phone, and what tablets, touch
 * screens, print, reduced motion and no JavaScript show at every width.
 *
 * On a laptop or desktop with a mouse or trackpad, with motion on, the names
 * are set instead as a wall: a band of display serif, eight rows deep for
 * the current list, alternately italic and roman, each row about as wide as
 * the screen. A row drifts sideways by exactly its own overflow as the
 * visitor scrolls, in alternating directions (nothing moves on its own): it
 * arrives flush with one page margin and leaves flush with the other, so
 * every name is on screen, whole, during a normal scroll, and most of them
 * the whole time. The wall is a decorative copy; the list stays in place for
 * assistive technology. Touch screens keep the list because rows that run
 * off the screen look swipeable and are not. Which of the two shows is
 * decided in speaking.css ("Wall of names").
 */
export function SpokenAt({ className = "" }: { className?: string }) {
  if (!showSpokenAt()) return null;
  const { heading, logos, verified, venues } = speaking.spokenAt;
  const wall = wallRows(venues);
  return (
    <section className={`grain overflow-x-clip bg-ivory pt-24 pb-24 md:pt-36 md:pb-36 ${className}`}>
      <InView className="mx-auto max-w-[90rem] px-5 md:px-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <h2 className="label text-stone">{heading}</h2>
          {!verified && site.showPlaceholders && (
            <p className="label inline-block border border-ink/25 px-2 py-1 !text-[0.5625rem] leading-relaxed text-stone">
              From Testimonials.pdf (partial listing): confirm before launch
            </p>
          )}
        </div>
        <span aria-hidden className="rule-draw mt-5 block h-px bg-gold-deep/70" />
      </InView>

      {logos.length > 0 ? (
        <div className="mx-auto mt-12 max-w-[90rem] px-5 md:px-10">
          <ul className="flex flex-wrap items-center gap-x-12 gap-y-10">
            {logos.map((l) => (
              <li key={l.name} className="relative h-10 w-32">
                <Image src={l.src} alt={l.name} fill sizes="(max-width: 1440px) 128px, 8.9vw" className="object-contain grayscale" />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {/* The real list: a flowing run of names. The last word of a name holds its gold mark, so a line never starts with one. */}
          <InView className="sp-venues mx-auto mt-10 max-w-[90rem] px-5 md:mt-12 md:px-10">
            {/* role: an unstyled list set inline still reads as a list of 23 in every screen reader. */}
            <ul role="list" className="sp-venues-list rise">
              {venues.map((v, i) => {
                const last = v.lastIndexOf(" ") + 1;
                return (
                  <li key={v}>
                    {v.slice(0, last)}
                    <span className="whitespace-nowrap">
                      {v.slice(last)}
                      {i < venues.length - 1 && <span aria-hidden className="sp-venues-mark" />}
                    </span>{" "}
                  </li>
                );
              })}
            </ul>
          </InView>

          {/* The wall of names (decorative copy of the list above). Each row reads its own --v (see speaking.css). */}
          <div aria-hidden className="sp-wall mt-16">
            {wall.rows.map((row, r) => (
              <div key={r} data-view="" suppressHydrationWarning className={`sp-wall-row ${(r % 2 === 0) === wall.italicFirst ? "sp-wall-row-italic" : ""}`}>
                <div className="sp-wall-line">
                  {row.map((v, i) => (
                    <Fragment key={v}>
                      {i > 0 && <span className="sp-wall-mark" />}
                      <span className="sp-wall-name">{v}</span>
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
