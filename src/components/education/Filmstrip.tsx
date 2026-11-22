import type { CSSProperties } from "react";
import { education } from "@/content/education";
import { Photo } from "@/components/ui/Photo";
import { InView } from "@/components/motion/InView";
import { Scene, SceneLine, ScenePanel, SceneTrack } from "@/components/motion/Scene";
import { StripMeter } from "./StripMeter";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The workshop as prints on a table: photographs of different sizes, set at
 * different heights, each on its paper border.
 *
 * From lg, on screens wider than they are tall, the section pins and the row
 * slides sideways as the visitor scrolls (the nearer prints a little faster),
 * with a frame counter and a gold progress line whose dot travels with the
 * row. Below lg, and on upright screens of any width, it is a strip to swipe,
 * which drifts a little as the page scrolls to show that it moves; the same
 * counter and line follow the swipe (StripMeter).
 *
 * Without JavaScript and with reduced motion: below lg it is a still strip to
 * swipe; from lg the whole row is fitted to the window, so every print is in
 * view with nothing to scroll. In print it is a contact sheet.
 *
 * Keyboard: while the strip scrolls sideways its group is a tab stop, so the
 * arrow keys move it. Pinned or fitted there is nothing to move, and
 * StripMeter takes the tab stop away (the page's own scrolling slides the row).
 * Sizes and offsets come from education.filmstrip; the styles are in
 * src/app/styles/education.css ("Filmstrip").
 */
export function Filmstrip() {
  const prints = education.filmstrip.filter((p) => p.photo.src);
  if (!prints.length) return null;
  // How long the scene pins: about one screen of scrolling per two prints.
  const length = 1 + prints.length * 0.26;
  // The row's width in strip units: each photograph, its paper border (a unit each side) and the space before it.
  const row = prints.reduce((sum, p, i) => sum + p.height * p.ratio + 2 + (i ? p.gap : 0), 0);
  return (
    <Scene
      from="lg"
      length={length}
      steps={prints.length}
      className="edu-strip bg-ivory"
      pinClassName="edu-strip-stage py-16 md:py-24"
    >
      <div
        data-view=""
        data-filmstrip=""
        tabIndex={0}
        role="group"
        aria-label="Photographs from a P3 workshop"
        className="edu-strip-scroll"
        style={{ "--row": Number(row.toFixed(2)) } as Vars}
      >
        <SceneTrack className="edu-strip-track">
          {prints.map((p, i) => {
            const style: Vars = { "--h": p.height, "--y": p.drop, "--ar": p.ratio, "--gap": i ? p.gap : 0, "--drift": p.drift, zIndex: p.layer };
            // A print tucked under the one before it carries its frame number on the right, where it shows.
            const tucked = i > 0 && p.gap < 0 && p.layer < prints[i - 1].layer;
            return (
              <ScenePanel as="figure" key={p.photo.src} className="edu-print">
                <div className="edu-print-body" style={style}>
                  <InView className="edu-print-paper">
                    <Photo
                      slot={p.photo}
                      className="edu-print-photo settle"
                      // The widest print is about 77 units wide: 84vw on phones, 62vw from lg.
                      sizes={
                        p.ratio > 1.6
                          ? "(min-width: 1441px) 62vw, (min-width: 1024px) 64vw, (min-width: 768px) 66vw, 86vw"
                          : "(min-width: 1441px) 50vw, (min-width: 1024px) 50vw, (min-width: 768px) 52vw, 76vw"
                      }
                    />
                    {/* The frame number, in the print's bottom margin. */}
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
      {/* Only while swiped: the frame in place, and how far the strip has travelled. */}
      {prints.length > 1 && <StripMeter total={prints.length} />}
      {/* Only while pinned: the frame in view, and how far the row has travelled. */}
      <div className="edu-strip-bar mx-auto w-full max-w-[90rem] items-center gap-6 px-10">
        {/* The current frame comes from CSS (the scene's data-step), not from text the engine rewrites:
            that text would differ from the server's on a reload mid-scene and break hydration. */}
        <span aria-hidden className="label tabular-nums text-stone">
          <span className="edu-strip-now" />
          <span className="mx-2 opacity-50">/</span>
          {String(prints.length).padStart(2, "0")}
        </span>
        <span className="edu-strip-rule relative block flex-1 text-gold-deep">
          <SceneLine />
          <span aria-hidden className="edu-strip-dot" />
        </span>
      </div>
    </Scene>
  );
}
