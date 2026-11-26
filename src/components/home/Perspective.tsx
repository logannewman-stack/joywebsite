import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { InView } from "@/components/motion/InView";
import { Scene, SceneCount, SceneLine, SceneStep, SceneSteps } from "@/components/motion/Scene";
import { WordRise } from "@/components/motion/Text";
import { Photo } from "@/components/ui/Photo";
import { ImageReveal } from "@/components/ui/Reveal";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const { perspective } = home;

/**
 * The approved paragraphs, one sentence at a time. Wording, order and
 * punctuation are untouched: the text is only cut at its sentence ends.
 */
const statements = perspective.paragraphs.flatMap((p) => p.split(/(?<=[.!?])\s+(?=[A-Z“‘])/));

/** The story's length in screens while it is pinned: about half a screen of scrolling for each statement. */
export const STORY_LENGTH = 3.4;

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
 * "A perspective shaped by every side of dentistry.": the story, beside one
 * photograph.
 *
 * From 1024px it is a pinned scene. The stage is the section itself: the
 * photograph in five of the twelve columns, the heading beside it, and under
 * the heading the story, one statement at a time. Each statement arrives
 * word by word as the one before it leaves; a counter and a thin line under
 * them show how far the story has run, and the photograph pushes in very
 * slowly the whole way. The choreography is in home.css ("The story").
 *
 * Below 1024px, without JavaScript, with reduced motion and in print it is a
 * plain section. From 768px the photograph keeps its place on the left with
 * the heading and the statements, as reading text, beside it; on phones they
 * follow one under another: the heading, the photograph, the statements.
 */
export function Perspective() {
  return (
    <section aria-labelledby="perspective-heading" className="relative z-10 bg-paper">
      <Scene as="div" from="lg" steps={statements.length} length={STORY_LENGTH} className="persp" pinClassName="persp-stage">
        <div className="persp-grid mx-auto max-w-(--wrap) px-5 py-20 md:grid md:grid-cols-12 md:gap-x-6 md:px-10 md:py-28 lg:grid-rows-[1fr_auto_auto_auto_1fr]">
          <InView className="md:col-span-6 md:col-start-7 md:row-start-1 lg:row-start-2">
            <h2 id="perspective-heading" className="display t-h1">
              <Heading />
            </h2>
          </InView>

          {/* data-scene-vars: the engine writes the scene's progress (--p) on the photograph and the meter only, so the words are not restyled on every scroll frame. */}
          <ImageReveal className="mt-10 w-[min(100%,24rem)] md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-1 md:mt-0 md:w-auto md:self-start lg:row-span-5 lg:self-center">
            <div data-scene-vars="" suppressHydrationWarning className="persp-photo aspect-[4/5] w-full overflow-hidden">
              <Photo slot={perspective.photo} className="persp-img h-full w-full" sizes="(max-width: 767px) min(100vw - 40px, 384px), (max-width: 1023px) 38vw, 33vw" />
            </div>
          </ImageReveal>

          <SceneSteps className="persp-steps mt-10 flex max-w-[34rem] flex-col gap-5 md:col-span-6 md:col-start-7 md:row-start-2 md:mt-8 lg:row-start-3">
            {statements.map((text, i) => (
              <SceneStep key={i} index={i}>
                <p className={`persp-say ${i === 0 ? "t-lead" : "t-body"} text-ink`}>
                  <WordRise>{text}</WordRise>
                </p>
              </SceneStep>
            ))}
          </SceneSteps>

          {/* "01 / 05" and the progress line: pinned only. Decorative; the statements are all in the page. */}
          <div
            aria-hidden
            data-scene-vars=""
            suppressHydrationWarning
            className="persp-meter label hidden items-center gap-5 text-stone pinned:flex lg:col-span-6 lg:col-start-7 lg:row-start-4"
            style={{ "--n": statements.length } as Vars}
          >
            <SceneCount total={statements.length} />
            <SceneLine className="flex-1 text-ink" />
          </div>
        </div>
      </Scene>
    </section>
  );
}
