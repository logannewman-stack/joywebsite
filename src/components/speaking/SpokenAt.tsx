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
 * Setting the wall. Set widths are estimated in em of the wall's serif: about
 * a third of an em per character, italic a little wider, and a gold mark with
 * its space between names. The estimate only decides where the rows break;
 * speaking.css sets how far each row travels from its real width.
 */
const CHAR_EM = 0.33;
const ITALIC = 1.065;
const MARK_EM = 1.27;
/** A row this long is about an eighth wider than the screen at the wall's type size. */
const ROW_EM = 45;

/**
 * The venues in rows of near-equal set width, keeping their order, alternating
 * roman and italic. Tries both a roman and an italic first row and keeps the
 * more even setting (least sum of squared row widths).
 */
function wallRows(venues: string[]): { rows: string[][]; italicFirst: boolean } {
  const n = venues.length;
  if (n === 0) return { rows: [], italicFirst: false };
  // upTo[j]: the roman width of the first j names, without marks.
  const upTo = [0];
  for (const v of venues) upTo.push(upTo[upTo.length - 1] + v.length * CHAR_EM);
  const count = Math.min(n, Math.max(1, Math.round((upTo[n] + MARK_EM * n) / (ROW_EM + MARK_EM))));

  let best: { cost: number; cuts: number[]; italicFirst: boolean } | undefined;
  for (const italicFirst of [false, true]) {
    // cost[r][j]: the most even way to set the first j names in r rows; from[r][j]: where its last row starts.
    const cost = Array.from({ length: count + 1 }, () => new Array<number>(n + 1).fill(Infinity));
    const from = Array.from({ length: count + 1 }, () => new Array<number>(n + 1).fill(0));
    cost[0][0] = 0;
    for (let r = 1; r <= count; r++) {
      const slant = (r % 2 === 1) === italicFirst ? ITALIC : 1;
      for (let j = r; j <= n; j++) {
        for (let i = r - 1; i < j; i++) {
          const width = (upTo[j] - upTo[i]) * slant + MARK_EM * (j - i - 1);
          const c = cost[r - 1][i] + width * width;
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
 * From tablet width the names are set as a wall: rows of display serif,
 * alternately roman and italic, with a gold mark between names. Each row is a
 * little wider than the screen and drifts sideways by exactly its own overflow
 * as the visitor scrolls, in alternating directions (nothing moves on its
 * own): it arrives flush with one page margin and leaves flush with the
 * other, so every name is on screen, whole, during a normal scroll, and most
 * of them the whole time. That wall is decoration: the real list sits beside
 * it for assistive technology, and is what phones and print show, one venue
 * per line. Without JavaScript or with reduced motion the wall is a still,
 * wrapped run of names.
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
          {/* The real list. Phones and print: one venue per line on hairline rules. From md it is read by assistive technology only. */}
          <InView className="mx-auto max-w-[90rem] px-5 md:sr-only print:not-sr-only print:px-10">
            <ul className="stagger font-serif text-[1.25rem] leading-snug tracking-[-0.005em] sm:columns-2 sm:gap-x-8 [--stagger:45ms]">
              {venues.map((v) => (
                <li key={v} className="break-inside-avoid border-b border-line py-2.5">
                  {v}
                </li>
              ))}
            </ul>
          </InView>

          {/* The wall of names (decorative copy of the list above). Each row reads its own --v (see speaking.css). */}
          <div aria-hidden className="sp-wall mt-12 hidden md:block lg:mt-16 print:!hidden">
            {wall.rows.map((row, r) => (
              <div key={r} data-view="" suppressHydrationWarning className={`sp-wall-row ${(r % 2 === 0) === wall.italicFirst ? "sp-wall-row-italic" : ""}`}>
                <div className="sp-wall-line">
                  {row.map((v, i) => (
                    // The space lets the still run wrap between names; a flex row drops it.
                    <Fragment key={v}>
                      <span className="sp-wall-item">
                        <span className="sp-wall-name">{v}</span>
                        {/* A mark after every name but the last of all; the animated wall hides the one that ends a row. */}
                        {(r < wall.rows.length - 1 || i < row.length - 1) && <span className="sp-wall-mark" />}
                      </span>{" "}
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
