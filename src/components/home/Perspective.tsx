import type { CSSProperties, ReactNode } from "react";
import { home } from "@/content/home";
import { Scene, SceneStep, SceneSteps } from "@/components/motion/Scene";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { typeset } from "@/components/ui/Typeset";
import { ArtDirected } from "./ArtDirected";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const { perspective } = home;

/**
 * The approved paragraphs, one sentence at a time. Wording, order and
 * punctuation are untouched: the text is only cut at its sentence ends.
 */
const statements = perspective.paragraphs.flatMap((p) => p.split(/(?<=[.!?])\s+(?=[A-Z“‘])/));
if (statements.length !== perspective.marks.length) {
  throw new Error(`home.perspective.marks needs one list per sentence (${statements.length} sentences, ${perspective.marks.length} lists).`);
}

/**
 * How many screens the pinned story lasts: about four fifths of a screen of
 * scrolling per step. Home's held opening reads it too.
 */
export const PERSPECTIVE_LENGTH = 6.6;
/**
 * Step 0 is the opening (the photograph's frame opening to the full screen),
 * steps 1 to n are the statements, and the last step holds the final
 * statement while the next section slides up over the stage.
 */
const STEPS = statements.length + 2;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A statement as words that can rise one after another, with its marked
 * phrases in champagne gold (large display type on black). Trailing
 * punctuation stays outside a mark ("at 16," keeps a white comma), and a short
 * marked phrase is never split across two lines.
 */
function Words({ text, marks }: { text: string; marks: readonly string[] }) {
  const ranges = marks.map((m) => {
    const at = text.indexOf(m);
    if (at < 0) throw new Error(`home.perspective.marks: “${m}” is not in “${text}”.`);
    return [at, at + m.length] as const;
  });
  const out: ReactNode[] = [];
  // The words of one short marked phrase, held together until the phrase ends.
  let run: ReactNode[] = [];
  let runOf: (typeof ranges)[number] | undefined;
  const flush = (key: string) => {
    if (!run.length) return;
    if (out.length) out.push(" ");
    out.push(
      run.length > 1 ? (
        <span key={key} className="whitespace-nowrap">
          {run}
        </span>
      ) : (
        run[0]
      ),
    );
    run = [];
  };
  let pos = 0;
  text.split(" ").forEach((word, i) => {
    const start = text.indexOf(word, pos);
    const end = start + word.length;
    pos = end;
    const hit = ranges.find(([a, b]) => start < b && end > a);
    let inner: ReactNode = typeset(word);
    if (hit) {
      const a = Math.max(start, hit[0]) - start;
      const b = Math.min(end, hit[1]) - start;
      inner = (
        <>
          {typeset(word.slice(0, a))}
          <span className="hl-gold">{typeset(word.slice(a, b))}</span>
          {typeset(word.slice(b))}
        </>
      );
    }
    const node = (
      <span key={i} className="wr">
        <span className="wr-in" style={{ "--i": i } as Vars}>
          {inner}
        </span>
      </span>
    );
    const short = hit && hit[1] - hit[0] <= 8 ? hit : undefined;
    if (short && short === runOf) {
      run.push(" ", node);
    } else {
      flush(`run-${i}`);
      run = [node];
      runOf = short;
    }
  });
  flush("run-end");
  return out;
}

/** The heading, with its marked phrase over a pale pink marker; the words rise as one sentence. */
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
 * Animated, it is a pinned scene. It arrives as a title spread (the heading
 * above the framed photograph); the frame opens to the full screen, the light
 * goes down, and the five statements appear one at a time with a counter and
 * a progress line. The last statement holds while the next section slides up
 * over the stage. Choreography: src/app/styles/home.css ("Perspective").
 *
 * Without JavaScript, with reduced motion and in print it is a static
 * editorial section: the heading, the full-bleed photograph, then the five
 * statements, numbered, on black.
 */
export function Perspective({ tone = "bg-ivory" }: { tone?: string }) {
  return (
    <section aria-labelledby="perspective-heading" className="relative z-10">
      <Scene as="div" from="all" steps={STEPS} length={PERSPECTIVE_LENGTH} className={`persp ${tone}`} pinClassName="persp-stage">
        {/* Carries the step count for the timings in home.css; it adds no box.
            data-scene-vars marks the three parts that move with the scroll (the header's marker, the photograph
            and the meter): the engine writes the scene's progress on them only, so the words are not restyled
            on every scroll frame. */}
        <div className="persp-set contents" style={{ "--n": STEPS } as Vars}>
          {/* While pinned, the header turns dark once the photograph fills the screen. */}
          <div aria-hidden data-header="dark" data-scene-vars="" suppressHydrationWarning className="persp-mark-pinned pointer-events-none" />

          <InView className="persp-title mx-auto max-w-[90rem] px-5 pt-24 pb-12 md:px-10 md:pt-32 md:pb-16 lg:pt-36">
            {/* A short gold rule opens each chapter of the page. */}
            <span aria-hidden className="rule-draw mb-6 block h-px w-16 bg-gold-deep md:mb-8" />
            <h2 id="perspective-heading" className="persp-heading display max-w-[18ch] text-[clamp(2.75rem,6.4vw,6.5rem)] leading-[0.94]">
              <Heading />
            </h2>
          </InView>

          <div data-scene-vars="" suppressHydrationWarning className="persp-photo relative aspect-[4/5] w-full overflow-hidden bg-sand md:aspect-[16/9] lg:aspect-auto lg:h-[min(84svh,55rem)]">
            {/* Pinned, the photograph covers the screen's height: on upright screens that is wider than the screen. */}
            <ArtDirected
              wide={perspective.photo}
              tall={perspective.photoTall}
              at="md"
              sizesWide="(orientation: portrait) 170vh, 115vw"
              sizesTall="(orientation: portrait) 95vh, 100vw"
              className="persp-img"
            />
            <div aria-hidden className="persp-shade pointer-events-none absolute inset-0 opacity-0" />
          </div>

          <div className="persp-copy relative bg-ink text-white">
            {/* Static layout only: the statements sit on black, so the header goes dark over them. */}
            <div aria-hidden data-header="dark" className="persp-mark-static pointer-events-none absolute inset-0" />
            <div className="persp-copy-inner relative mx-auto max-w-[90rem] px-5 py-20 md:px-10 md:py-28">
              <SceneSteps className="persp-steps flex flex-col gap-10 md:gap-12">
                {statements.map((text, i) => (
                  <SceneStep
                    key={i}
                    index={i + 1}
                    className={`persp-step grid gap-x-6 gap-y-4 md:grid-cols-12 ${i === statements.length - 1 ? "persp-step-last" : ""}`}
                  >
                    <span aria-hidden className="persp-num label text-ash tabular-nums md:col-span-3 md:pt-3 lg:col-span-4">
                      {pad(i + 1)}
                    </span>
                    <p className={`persp-say display md:col-span-9 lg:col-span-8 ${text.length <= 60 ? "persp-say-short" : text.length > 130 ? "persp-say-long" : ""}`}>
                      <Words text={text} marks={perspective.marks[i]} />
                    </p>
                  </SceneStep>
                ))}
              </SceneSteps>

              {/* "01 / 05" and the progress line: pinned only. Decorative; the statements are all in the page. */}
              <div aria-hidden data-scene-vars="" suppressHydrationWarning className="persp-meter label text-white/80">
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
        </div>
      </Scene>
    </section>
  );
}
