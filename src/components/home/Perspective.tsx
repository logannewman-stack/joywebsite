import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { InView } from "@/components/motion/InView";
import { Scene, SceneStep, SceneSteps } from "@/components/motion/Scene";
import { WordRise } from "@/components/motion/Text";
import { ArtDirected } from "./ArtDirected";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const { perspective } = home;

/**
 * The approved paragraphs, one sentence at a time. Wording, order and
 * punctuation are untouched: the text is only cut at its sentence ends.
 */
const statements = perspective.paragraphs.flatMap((p) => p.split(/(?<=[.!?])\s+(?=[A-Z“‘])/));

/**
 * How many screens the pinned story lasts on wide landscape screens (from
 * 1024px, where a wheel or trackpad scrolls it): a little over half a screen
 * of scrolling for each step. Home's held opening reads it too.
 */
export const STORY_LENGTH = 4.8;
/**
 * And on phones and upright screens: about two thirds of a screen for each
 * step, one swipe of a thumb. home.css ("The story") chooses between the two.
 */
const STORY_LENGTH_TALL = 6.2;
/**
 * Step 0 is the opening (the photograph's frame opening to the full screen),
 * steps 1 to n are the statements, and two closing steps hold the final
 * statement: the next section slides up over the stage during the scene's
 * last screen of scrolling, which is longer than one step, and the last
 * statement should have its own time on the stage before that begins.
 */
const HOLD = 2;
const STEPS = statements.length + 1 + HOLD;

const pad = (n: number) => String(n).padStart(2, "0");

/** The heading, with its marked phrase over the pale pink marker; the words rise as one sentence. */
function Heading() {
  const text = perspective.heading;
  const mark = perspective.headingMark;
  const at = text.indexOf(mark);
  if (at < 0) return <WordRise>{text}</WordRise>;
  const before = text.slice(0, at).trim();
  const after = text.slice(at + mark.length).trim();
  const count = (t: string) => t.split(" ").filter(Boolean).length;
  return (
    <>
      {before && <WordRise>{before}</WordRise>}
      {before && " "}
      {/* The marked phrase stays on one line, so the marker is never cut in two. */}
      <span className="hl-light whitespace-nowrap">
        <WordRise start={count(before)}>{mark}</WordRise>
      </span>
      {after && " "}
      {after && <WordRise start={count(before) + count(mark)}>{after}</WordRise>}
    </>
  );
}

/**
 * "A perspective shaped by every side of dentistry.": the story, told over one
 * photograph.
 *
 * Animated, it is a pinned scene at every size. It arrives as a title spread:
 * the heading on white above the framed photograph. The frame opens until the
 * whole picture fills the screen, the light goes down on the side away from
 * her, and the statements appear there one at a time, in white, with a counter
 * and a thin progress line at the foot. The last statement holds while the
 * next section slides up over the stage. On landscape screens she stands on
 * the left and the words are set on the right; on upright screens she fills
 * the screen and the words sit low. Choreography: home.css ("The story").
 *
 * Without JavaScript, with reduced motion, in print, and whenever the words
 * cannot fit one screen (engine.ts, "Fit") it is a plain section: the heading,
 * the photograph and the statements as reading text. From 768px the
 * photograph keeps the left with the heading and the statements beside it.
 */
export function Perspective() {
  return (
    <section
      aria-labelledby="perspective-heading"
      className="relative z-10 bg-paper"
      style={{ "--story-wide": STORY_LENGTH, "--story-tall": STORY_LENGTH_TALL } as Vars}
    >
      {/* No length here: home.css sets the scene's length from the two values above. */}
      <Scene as="div" from="all" steps={STEPS} className="persp" pinClassName="persp-stage">
        {/* --n carries the step count and --m the number of statements for the timings in home.css. */}
        <div
          className="persp-set mx-auto max-w-(--wrap) px-5 py-20 md:grid md:grid-cols-12 md:gap-x-6 md:px-10 md:py-28"
          style={{ "--n": STEPS, "--m": statements.length } as Vars}
        >
          {/* While pinned, the header turns dark once the photograph fills the screen. data-scene-vars marks the
              parts that move with the scroll (this marker, the photograph and the meter): the engine writes the
              scene's progress on them only, so the words are not restyled on every scroll frame. */}
          <div aria-hidden data-header="dark" data-scene-vars="" suppressHydrationWarning className="persp-mark-pinned pointer-events-none" />

          <InView className="persp-title md:col-span-6 md:col-start-7 md:row-start-1">
            <h2 id="perspective-heading" className="persp-heading display t-h1 pinned:t-hero">
              <Heading />
            </h2>
          </InView>

          <div
            data-scene-vars=""
            suppressHydrationWarning
            className="persp-photo relative mt-10 aspect-[4/5] w-[min(100%,24rem)] overflow-hidden bg-mist md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-1 md:mt-0 md:w-auto md:self-start"
          >
            {/* Pinned, the photograph covers the whole screen, pushed in by up to 15%: the sizes ask for that. */}
            <ArtDirected
              wide={perspective.photo}
              tall={perspective.photoTall}
              sizesWide="(min-aspect-ratio: 3/2) 115vw, 172vh"
              sizesTall="(max-aspect-ratio: 4/5) 92vh, 115vw"
              className="persp-img"
            />
            <div aria-hidden className="persp-shade pointer-events-none absolute inset-0 opacity-0" />
          </div>

          <div className="persp-copy mt-10 md:col-span-6 md:col-start-7 md:row-start-2 md:mt-8">
            <SceneSteps className="persp-steps flex max-w-[34rem] flex-col gap-5">
              {statements.map((text, i) => (
                <SceneStep key={i} index={i + 1} className={i === statements.length - 1 ? "persp-step persp-step-last" : "persp-step"}>
                  <p className={`persp-say ${i === 0 ? "t-lead" : "t-body"}`}>
                    <WordRise>{text}</WordRise>
                  </p>
                </SceneStep>
              ))}
            </SceneSteps>

            {/* "01 / 05" and the progress line: pinned only. Decorative; the statements are all in the page. */}
            <div aria-hidden data-scene-vars="" suppressHydrationWarning className="persp-meter label">
              <span className="persp-count tabular-nums">
                <span className="persp-roll">
                  {statements.map((_, i) => (
                    <span key={i}>{pad(i + 1)}</span>
                  ))}
                </span>
              </span>
              <span className="mx-2 opacity-50">/</span>
              <span className="tabular-nums">{pad(statements.length)}</span>
              <span className="persp-rule">
                <span />
              </span>
            </div>
          </div>
        </div>
      </Scene>
    </section>
  );
}
