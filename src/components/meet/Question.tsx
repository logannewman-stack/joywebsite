"use client";

import { Fragment, useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { bindI, noWidow } from "./text";

/** Opacity of a word not yet reached: ink at 50% on white is 3.7:1, AA for display-size type. */
const FLOOR = 0.5;
/** How many words are fading in at once as the line lights up. */
const OVERLAP = 3;

/**
 * "If you are going to complain, why not do something about it?" lights up
 * word by word as it rises to the reading line, then "I joined the board."
 * arrives with the site's shared reveal.
 *
 * The server HTML renders every word at full ink: each word's opacity reads
 * the --lit variable and falls back to 1 when it is not set. The effect only
 * dims a line the visitor has not reached yet (it is below the viewport on
 * mount), and the lighting is a high-water mark, so the line never dims again
 * on the way back up. No-JS, print, reduced motion and visitors who land
 * further down the page all get the full sentence.
 */
export function Question({ question, answer }: { question: string; answer: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = question.split(" ");
  const steps = words.length + OVERLAP - 1;

  useEffect(() => {
    const line = ref.current;
    if (!line) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || line.getBoundingClientRect().top < window.innerHeight) return;

    let lit = 0;
    let frame = 0;
    const set = (value: number) => line.style.setProperty("--lit", value.toFixed(3));
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const box = line.getBoundingClientRect();
      // 0 when the top of the line reaches 90% of the viewport; 1 when its
      // middle reaches 65%, so it is fully lit by the time it is read.
      const start = vh * 0.9;
      const end = vh * 0.65 - box.height / 2;
      const progress = Math.min(1, Math.max(0, (start - box.top) / (start - end)));
      if (progress > lit) {
        lit = progress;
        set(lit);
      }
    };
    const onScroll = () => {
      if (lit < 1 && !frame) frame = requestAnimationFrame(measure);
    };
    const onMotionChange = () => {
      if (!reduce.matches) return;
      lit = 1;
      set(1);
    };

    set(0);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", onMotionChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onMotionChange);
      if (frame) cancelAnimationFrame(frame);
      line.style.removeProperty("--lit");
    };
  }, []);

  return (
    <div>
      {/* Plain inline spans (not inline-block), so assistive technology, search and copy-paste get one continuous sentence. */}
      <p ref={ref} className="display text-[clamp(2.75rem,7vw,7.25rem)] leading-[0.96] print:[--lit:1]!">
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span
              className="transition-opacity duration-300 ease-out"
              style={{ opacity: `calc(${FLOOR} + ${1 - FLOOR} * clamp(0, (var(--lit, 1) * ${steps} - ${i}) / ${OVERLAP}, 1))` }}
            >
              {word}
            </span>
          </Fragment>
        ))}
      </p>
      <Reveal delay={0.2} y={12} className="mt-14 md:mt-20 lg:mt-24 lg:pl-[calc(50%+0.75rem)]">
        <p className="font-sans text-[clamp(2.15rem,5vw,4.75rem)] leading-none font-semibold tracking-[-0.04em] text-balance!">
          {bindI(noWidow(answer.replace(/\.$/, "")))}
          <span aria-hidden className="ml-[0.04em] inline-block size-[0.2em] rounded-full bg-blush-deep" />
          <span className="sr-only">.</span>
        </p>
      </Reveal>
    </div>
  );
}
