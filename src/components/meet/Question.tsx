import type { CSSProperties } from "react";
import { WordLight } from "@/components/motion/Text";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** The scene is cut into this many equal parts; the answer lands in the last one. */
const STEPS = 4;

/**
 * "If you are going to complain, why not do something about it?"
 * "I joined the board."
 *
 * The page's one pinned scene. The stage holds while the question takes ink
 * word by word; then the answer lands as its own beat, larger, closed by a
 * gold full stop, and the question steps back. After that the stage lets go
 * and the story carries on.
 *
 * It is a plain sticky section driven by the scroll engine (--p and
 * data-step on the scene); the choreography is in meet.css. The page always
 * scrolls at its own speed. Without JavaScript, with reduced motion and in
 * print it is an ordinary block: the question, then the answer, in full ink.
 *
 * The words stay real text: the question is plain inline spans, and the
 * answer's approved full stop is kept for screen readers and copy-paste
 * behind the drawn one.
 */
export function Question({ question, answer }: { question: string; answer: string }) {
  // "I joined the board." is set as two units, "I joined" and "the board", that rise one after the other.
  const words = answer.replace(/\.$/, "").split(" ");
  const cut = Math.ceil(words.length / 2);
  const first = words.slice(0, cut).join("\u00a0");
  const second = words.slice(cut).join("\u00a0");

  return (
    <section data-scene="all" data-steps={STEPS} className="meet-q bg-paper">
      <div data-scene-pin className="meet-q-pin relative">
        <div className="meet-q-stage mx-auto max-w-[90rem] px-5 pt-14 pb-20 md:px-10 md:pt-20 md:pb-28">
          <p className="meet-question display leading-[0.96]">
            <WordLight driver="scene" from={-0.12} to={0.54} dim={0.5}>
              {question}
            </WordLight>
          </p>
          <p className="meet-answer font-sans leading-none font-semibold tracking-[-0.04em]">
            <span className="wr">
              <span className="wr-in" style={{ "--i": 0 } as Vars}>
                {first}
              </span>
            </span>{" "}
            {/* Phones set the answer on two lines; the break is fixed so the stage can reserve its height. */}
            <br className="md:hidden" />
            <span className="whitespace-nowrap">
              <span className="wr">
                <span className="wr-in" style={{ "--i": 1 } as Vars}>
                  {second}
                </span>
              </span>
              <span aria-hidden className="meet-dot ml-[0.05em] inline-block size-[0.2em] rounded-full bg-gold-deep" />
              <span className="sr-only">.</span>
            </span>
          </p>
        </div>
        {/*
          The gold rule above the sign-off. While the stage is pinned it is also the scene's
          progress line: it fills as the visitor scrolls, with a dot at its head. Decorative.
        */}
        <span aria-hidden className="meet-q-progress pointer-events-none absolute inset-x-5 bottom-8 h-px bg-gold-deep md:inset-x-10 pinned:bg-gold-deep/25">
          <span className="scene-line absolute inset-0 hidden bg-gold-deep pinned:block" />
          {/* The dot sits at the start of a track as wide as the line; the track slides, so nothing is laid out again. */}
          <span className="meet-q-mark absolute inset-0 hidden pinned:block">
            <span className="absolute top-1/2 left-0 size-[0.4375rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-deep" />
          </span>
        </span>
      </div>
    </section>
  );
}
