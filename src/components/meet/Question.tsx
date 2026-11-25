import type { CSSProperties } from "react";
import { InView } from "@/components/motion/InView";
import { WordLight } from "@/components/motion/Text";
import { Label } from "@/components/ui/Links";
import { bindI } from "./text";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** The scene is cut into this many equal parts; the answer lands in the last one. */
const STEPS = 4;

/**
 * What Guides My Work:
 * "If you are going to complain, why not do something about it?"
 * "I joined the board."
 *
 * The page's one pinned scene. The stage is the whole section: its label in
 * the left margin, the two paragraphs that lead to the question, the
 * question, and the answer. The stage holds while the question takes ink
 * word by word; then the answer lands as its own beat, one size larger, and
 * the question steps back. A thin line along the foot of the stage fills as
 * the visitor scrolls, a dot at its head. After that the stage lets go and
 * the story carries on.
 *
 * It is a plain sticky section driven by the scroll engine (--p and
 * data-step on the scene); the choreography is in meet.css ("The question").
 * The page always scrolls at its own speed. Without JavaScript, with reduced
 * motion and in print it is an ordinary section: the paragraphs, the
 * question, then the answer, in full ink.
 *
 * The words stay real text: the question is plain inline spans, and the
 * answer is set as two units that rise one after the other.
 */
export function Question({ label, before, question, answer }: { label: string; before: string[]; question: string; answer: string }) {
  // "I joined the board." is set as two units, "I joined" and "the board.", that rise one after the other.
  const words = answer.split(" ");
  const cut = Math.ceil(words.length / 2);
  const first = words.slice(0, cut).join("\u00a0");
  const second = words.slice(cut).join("\u00a0");

  return (
    <section data-scene="all" data-steps={STEPS} className="meet-q bg-paper">
      <div data-scene-pin className="meet-q-pin relative">
        <div className="meet-q-stage mx-auto max-w-(--wrap) px-5 pt-20 pb-20 md:px-10 md:pt-28 md:pb-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <InView className="lg:col-span-4">
            <Label as="h2" className="rise text-stone">
              {label}
            </Label>
          </InView>
          <div className="mt-8 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <InView className="stagger flex max-w-[40rem] flex-col gap-5">
              {before.map((p, i) => (
                <p key={i} className="t-lead text-ink">
                  {p}
                </p>
              ))}
            </InView>
            <p className="meet-question display t-h1 mt-12 max-w-[18em] md:mt-14">
              <WordLight driver="scene" from={-0.1} to={0.56} dim={0.35}>
                {bindI(question)}
              </WordLight>
            </p>
            <p className="meet-answer display t-hero mt-6 md:mt-8">
              <span className="wr">
                <span className="wr-in" style={{ "--i": 0 } as Vars}>
                  {first}
                </span>
              </span>{" "}
              <span className="wr">
                <span className="wr-in" style={{ "--i": 1 } as Vars}>
                  {second}
                </span>
              </span>
            </p>
          </div>
        </div>
        {/*
          The scene's progress line, at the foot of the stage and the width of the page column: it fills as
          the visitor scrolls, with a dot at its head. Pinned only; decorative. While it shows, it stands
          in for the thin line between this section and the next (meet.css).
        */}
        <span aria-hidden className="meet-q-progress pointer-events-none absolute bottom-8 hidden h-px bg-ink/15 pinned:block">
          <span className="scene-line absolute inset-0 bg-ink" />
          {/* The dot sits at the start of a track as wide as the line; the track slides, so nothing is laid out again. */}
          <span className="meet-q-mark absolute inset-0">
            <span className="absolute top-1/2 left-0 size-[0.4375rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
          </span>
        </span>
      </div>
    </section>
  );
}
