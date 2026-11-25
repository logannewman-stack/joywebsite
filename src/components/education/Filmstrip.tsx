import type { CSSProperties } from "react";
import { education } from "@/content/education";
import { Photo } from "@/components/ui/Photo";
import { InView } from "@/components/motion/InView";
import { Scene, ScenePanel, SceneTrack } from "@/components/motion/Scene";
import { StripMeter } from "./StripMeter";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The workshop as a strip of prints: photographs of different sizes, set at
 * different heights, each on a white border with its frame number under it.
 *
 * From lg, on screens wider than they are tall, the section pins and the
 * strip travels sideways through a window the width of the page column as the
 * visitor scrolls (the nearer prints a little faster). Under it a counter and
 * a thin ink line, with a dot at its head, show how far it has travelled.
 * Once the last print is in, the strip rests while the next section slides up
 * over it.
 *
 * Below lg, and on upright screens of any width, it is a strip to swipe,
 * which drifts a little as the page scrolls to show that it moves; the same
 * counter and line follow the swipe (StripMeter).
 *
 * Without JavaScript and with reduced motion: below lg it is a still strip to
 * swipe; from lg the whole strip is fitted to the page column, so every print
 * is in view with nothing to scroll. In print it is a contact sheet.
 *
 * Keyboard: while the strip scrolls sideways its group is a tab stop, so the
 * arrow keys move it. Pinned or fitted there is nothing to move, and
 * StripMeter takes the tab stop away (the page's own scrolling moves the strip).
 * Sizes and offsets come from education.filmstrip; the styles are in
 * src/app/styles/education.css ("Filmstrip").
 */
export function Filmstrip() {
  const prints = education.filmstrip.filter((p) => p.photo.src);
  if (!prints.length) return null;
  // Pinned: a fifth of a screen of scrolling for each print while the strip
  // travels, then one screen while it rests under the section that follows.
  const travel = prints.length * 0.2;
  // The strip's width in its own units: each photograph, its border (a unit each side) and the space before it.
  const row = prints.reduce((sum, p, i) => sum + p.height * p.ratio + 2 + (i ? p.gap : 0), 0);
  // --k turns the scene's progress into the strip's: the strip has arrived when the rest begins.
  const vars: Vars = { "--row": Number(row.toFixed(2)), "--n": prints.length, "--k": Number(((travel + 1) / travel).toFixed(4)) };
  return (
    <Scene from="lg" length={travel + 2} className="edu-strip no-rule bg-paper" pinClassName="edu-strip-stage pb-20 md:pb-28">
      <div className="edu-strip-col lg:mx-auto lg:w-full lg:max-w-(--wrap) lg:px-10" style={vars}>
        <div
          data-view=""
          data-filmstrip=""
          tabIndex={0}
          role="group"
          aria-label="Photographs from a P3 workshop"
          className="edu-strip-scroll"
          // The scroll engine writes --v on this element before React hydrates.
          suppressHydrationWarning
        >
          <SceneTrack className="edu-strip-track">
            {prints.map((p, i) => {
              const width = p.height * p.ratio;
              const style: Vars = { "--h": p.height, "--y": p.drop, "--ar": p.ratio, "--gap": i ? p.gap : 0, "--drift": p.drift, zIndex: p.layer };
              // A print tucked under the one before it carries its frame number on the right, where it shows.
              const tucked = i > 0 && p.gap < 0 && p.layer < prints[i - 1].layer;
              return (
                <ScenePanel as="figure" key={p.photo.src} className="edu-print">
                  <div className="edu-print-body" style={style}>
                    {/* The prints in view when the strip is first seen lift in one after another; the rest as they arrive. */}
                    <InView className="edu-print-paper rise" delay={Math.min(i, 3) * 0.07}>
                      <Photo
                        slot={p.photo}
                        className="edu-print-photo settle"
                        // A unit is at most 0.62vw from lg, 0.82vw on tablets and 1.2vw on phones, where no print is wider than 70 units.
                        sizes={`(min-width: 1024px) ${Math.ceil(width * 0.62)}vw, (min-width: 768px) ${Math.ceil(width * 0.82)}vw, ${Math.ceil(Math.min(width, 70) * 1.2)}vw`}
                      />
                      <span aria-hidden className={`edu-print-no ${tucked ? "edu-print-no-end" : ""}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </InView>
                  </div>
                </ScenePanel>
              );
            })}
          </SceneTrack>
        </div>
        {prints.length > 1 && <StripMeter total={prints.length} />}
      </div>
    </Scene>
  );
}
