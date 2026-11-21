"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{" "}
    </motion.span>
  );
}

/**
 * The question lights up word by word as it scrolls through the viewport,
 * then the answer lands. Reading order and text are unchanged for assistive
 * technology; the effect is purely visual and off under reduced motion.
 */
export function Question({ question, answer }: { question: string; answer: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = question.split(" ");
  const answerOpacity = useTransform(scrollYProgress, [0.78, 0.95], [0, 1]);
  const answerY = useTransform(scrollYProgress, [0.78, 0.95], [24, 0]);

  return (
    <div ref={ref}>
      <p className="display text-[clamp(2.6rem,6.6vw,6.6rem)] leading-[0.98]">
        {reduce
          ? question
          : words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[(i / words.length) * 0.7, ((i + 1) / words.length) * 0.7]} />
            ))}
      </p>
      <motion.p
        style={reduce ? undefined : { opacity: answerOpacity, y: answerY }}
        className="mt-12 font-sans text-[clamp(2rem,4.6vw,4.4rem)] leading-none font-semibold tracking-[-0.035em] md:mt-16"
      >
        {answer}
        <span className="ml-3 inline-block size-[0.32em] translate-y-[-0.1em] rounded-full bg-blush" aria-hidden />
      </motion.p>
    </div>
  );
}
