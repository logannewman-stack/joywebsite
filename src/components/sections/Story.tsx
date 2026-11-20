"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { site } from "@/content/site";
import { Rich } from "../Rich";

function Line({ text, index, total, progress }: { text: string; index: number; total: number; progress: MotionValue<number> }) {
  const seg = 1 / total;
  const start = index * seg;
  const end = start + seg;
  const fade = seg * 0.28;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  // first line is already on screen when the section arrives; last line stays put
  const inFrom = isFirst ? 1 : 0;
  const outTo = isLast ? 1 : 0;
  const opacity = useTransform(progress, [start, start + fade, end - fade, end], [inFrom, 1, 1, outTo]);
  const y = useTransform(progress, [start, start + fade, end - fade, end], [isFirst ? 0 : 40, 0, 0, isLast ? 0 : -40]);
  const blur = useTransform(progress, [start, start + fade, end - fade, end], [isFirst ? 0 : 8, 0, 0, isLast ? 0 : 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.p
      style={{ opacity, y, filter }}
      className="absolute inset-x-0 top-1/2 mx-auto max-w-[900px] -translate-y-1/2 px-6 text-center text-[clamp(1.8rem,4.2vw,3.4rem)] leading-[1.15] font-semibold tracking-[-0.015em] text-white"
    >
      <Rich text={text} highlightClass="text-violet-hi font-semibold" />
    </motion.p>
  );
}

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const lines = site.story;
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const dots = useTransform(scrollYProgress, (p) => Math.min(lines.length - 1, Math.floor(p * lines.length)));

  return (
    <section ref={ref} className="relative bg-ink" style={{ height: `${lines.length * 75 + 100}vh` }} aria-label="Story">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
          <Image src="/images/reaching-light.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,12,15,0.85)_0%,rgba(40,16,90,0.55)_50%,rgba(12,12,15,0.9)_100%)]" />
        <div className="absolute inset-0 bg-violet/20 mix-blend-color" />

        {/* accessible static copy for screen readers */}
        <div className="sr-only">
          {lines.map((l) => (
            <p key={l}>{l.replace(/\*\*/g, "")}</p>
          ))}
        </div>

        <div aria-hidden>
          {lines.map((l, i) => (
            <Line key={l} text={l} index={i} total={lines.length} progress={scrollYProgress} />
          ))}
        </div>

        {/* progress pips */}
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2" aria-hidden>
          {lines.map((_, i) => (
            <Pip key={i} index={i} active={dots} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Pip({ index, active }: { index: number; active: MotionValue<number> }) {
  const width = useTransform(active, (a) => (a === index ? 28 : 8));
  const bg = useTransform(active, (a) => (a >= index ? "#9b6dff" : "rgba(255,255,255,0.25)"));
  return <motion.span className="block h-2 rounded-full" style={{ width, backgroundColor: bg }} />;
}
