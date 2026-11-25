import type { CSSProperties } from "react";
import { education } from "@/content/education";
import { Photo } from "@/components/ui/Photo";
import { InView } from "@/components/motion/InView";
import { StripMeter } from "./StripMeter";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The workshop in pictures: a row of small prints, all one size and one
 * shape, so no photograph leads.
 *
 * From lg the row is the width of the page column and every print is in view:
 * with six prints each takes two of the twelve columns. Below lg it is a row
 * to swipe, starting on the page column and running off the right edge of the
 * screen; a thin line under it shows how far it has travelled (StripMeter).
 * The prints lift in one after another the first time the row is seen. In
 * print the row wraps.
 *
 * Keyboard: while the row scrolls sideways its group is a tab stop, so the
 * arrow keys move it. Where every print is in view there is nothing to move,
 * and StripMeter takes the tab stop away.
 *
 * The prints are education.filmstrip, with the close-up of hands and
 * instruments (education.hero.detail) as the third. Styles:
 * src/app/styles/education.css ("Row of prints").
 */
export function Filmstrip() {
  const strip = education.filmstrip.map((p) => p.photo);
  const prints = [...strip.slice(0, 2), education.hero.detail, ...strip.slice(2)].filter((p) => p.src);
  if (!prints.length) return null;
  return (
    <section className="bg-paper py-20 md:py-28">
      <div
        data-filmstrip=""
        tabIndex={0}
        role="group"
        aria-label="Photographs from a P3 workshop"
        className="edu-strip"
        style={{ "--prints": prints.length } as Vars}
      >
        <InView className="edu-strip-row stagger">
          {prints.map((photo) => (
            <figure key={photo.src} className="edu-print">
              {/* A print is 2 of 12 columns from lg, and at most 15rem where the row is swiped. */}
              <Photo slot={photo} className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 13vw, (min-width: 414px) 240px, 58vw" />
            </figure>
          ))}
        </InView>
      </div>
      {prints.length > 1 && <StripMeter />}
    </section>
  );
}
