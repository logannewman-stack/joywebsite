"use client";

import { useEffect, useRef } from "react";
import { SceneLine } from "@/components/motion/Scene";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "01 / 05" and a gold progress line for the filmstrip while it is a strip to
 * swipe (the pinned strip has its own bar, driven by the scroll engine). It
 * reads the strip's sideways scroll position and writes two values for CSS:
 * --p (0 to 1, how far the strip has travelled) and --i (the frame in place).
 * Nothing is animated here.
 *
 * The frame in place is the print whose resting position is nearest. Prints
 * near the end that can never reach the edge share the last stretch of the
 * swipe, so the count always runs 01 to the last frame, in order.
 *
 * Decorative: every print carries its own frame number. Hidden from assistive
 * technology, and hidden without JavaScript (education.css, "Filmstrip").
 */
export function StripMeter({ total }: { total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const row = el?.parentElement?.querySelector<HTMLElement>("[data-filmstrip]");
    if (!el || !row) return;
    let frame = 0;
    let stops: number[] = [];
    // Where each print rests, as a scroll position. Read on load and on resize only.
    const measure = () => {
      const max = row.scrollWidth - row.clientWidth;
      const lefts = Array.from(row.querySelectorAll<HTMLElement>("[data-scene-panel]"), (p) => p.getBoundingClientRect().left);
      const raw = lefts.map((x) => x - lefts[0]);
      const reach = raw.findIndex((x) => x >= max - 1);
      const first = reach < 0 ? raw.length : Math.max(reach, 1);
      const from = raw[first - 1] ?? 0;
      stops = raw.map((x, k) => (k < first ? x : from + ((max - from) * (k - first + 1)) / (raw.length - first)));
    };
    const update = () => {
      frame = 0;
      const max = row.scrollWidth - row.clientWidth;
      const x = Math.min(Math.max(row.scrollLeft, 0), Math.max(max, 0));
      let i = 0;
      stops.forEach((s, k) => {
        if (Math.abs(s - x) < Math.abs(stops[i] - x)) i = k;
      });
      el.style.setProperty("--p", max > 0 ? (x / max).toFixed(4) : "0");
      el.style.setProperty("--i", String(i));
      // Nothing to swipe (every print fits): no meter.
      el.toggleAttribute("data-still", max <= 0);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      measure();
      queue();
    };
    measure();
    update();
    row.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener("scroll", queue);
      window.removeEventListener("resize", resize);
    };
  }, [total]);
  return (
    <div ref={ref} aria-hidden className="edu-strip-meter label mx-5 items-center text-stone md:mx-10">
      <span className="edu-strip-roll tabular-nums">
        <span>
          {Array.from({ length: total }, (_, i) => (
            <span key={i}>{pad(i + 1)}</span>
          ))}
        </span>
      </span>
      <span className="mx-2 opacity-50">/</span>
      <span className="tabular-nums">{pad(total)}</span>
      <span className="edu-strip-rule relative ml-6 block flex-1 text-gold-deep">
        <SceneLine />
        <span className="edu-strip-dot" />
      </span>
    </div>
  );
}
