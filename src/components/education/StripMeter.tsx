"use client";

import { useEffect, useRef } from "react";
import { SceneLine } from "@/components/motion/Scene";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "01 / 05" and a thin ink line under the filmstrip: the frame in place, and
 * how far the strip has travelled, with a dot at the line's head.
 *
 * While the strip is pinned the scroll engine drives both, in CSS
 * (education.css, "Filmstrip"). While it is a strip to swipe, this script
 * reads its sideways scroll position and writes the same two values on the
 * meter: --q (0 to 1, how far the strip has travelled) and --i (the frame in
 * place). Nothing is animated here.
 *
 * Swiped, the frame in place is the print whose resting position is nearest.
 * Prints near the end that can never reach the edge share the last stretch of
 * the swipe, so the count always runs 01 to the last frame, in order.
 *
 * Decorative: every print carries its own frame number. Hidden from assistive
 * technology, and shown only while pinned or once this script has measured a
 * strip that scrolls.
 *
 * It also keeps the strip's group a tab stop only while there is something
 * to move with the arrow keys: pinned, or fitted to the page column, the
 * strip does not scroll sideways, so the tab stop is taken away.
 */
export function StripMeter({ total }: { total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const row = el?.parentElement?.querySelector<HTMLElement>("[data-filmstrip]");
    if (!el || !row) return;
    let frame = 0;
    let stops: number[] = [];
    // Read on load and on resize only: whether the strip scrolls sideways, and where each print rests, as a scroll position.
    const measure = () => {
      const max = row.scrollWidth - row.clientWidth;
      const scrolls = max > 1 && /auto|scroll/.test(getComputedStyle(row).overflowX);
      if (scrolls) row.tabIndex = 0;
      else row.removeAttribute("tabindex");
      el.toggleAttribute("data-live", scrolls);
      if (!scrolls) {
        stops = [];
        el.style.removeProperty("--q");
        el.style.removeProperty("--i");
        return;
      }
      const lefts = Array.from(row.querySelectorAll<HTMLElement>("[data-scene-panel]"), (p) => p.getBoundingClientRect().left);
      const raw = lefts.map((x) => x - lefts[0]);
      const reach = raw.findIndex((x) => x >= max - 1);
      const first = reach < 0 ? raw.length : Math.max(reach, 1);
      const from = raw[first - 1] ?? 0;
      stops = raw.map((x, k) => (k < first ? x : from + ((max - from) * (k - first + 1)) / (raw.length - first)));
    };
    const update = () => {
      frame = 0;
      if (!stops.length) return;
      const max = row.scrollWidth - row.clientWidth;
      const x = Math.min(Math.max(row.scrollLeft, 0), Math.max(max, 0));
      let i = 0;
      stops.forEach((s, k) => {
        if (Math.abs(s - x) < Math.abs(stops[i] - x)) i = k;
      });
      el.style.setProperty("--q", max > 0 ? (x / max).toFixed(4) : "0");
      el.style.setProperty("--i", String(i));
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
      row.tabIndex = 0;
    };
  }, [total]);
  return (
    <div ref={ref} aria-hidden className="edu-strip-meter label items-center text-stone">
      <span className="edu-strip-roll tabular-nums">
        <span>
          {Array.from({ length: total }, (_, i) => (
            <span key={i}>{pad(i + 1)}</span>
          ))}
        </span>
      </span>
      <span className="mx-2 opacity-50">/</span>
      <span className="tabular-nums">{pad(total)}</span>
      <span className="edu-strip-rule relative ml-6 block flex-1 text-ink">
        <SceneLine />
        <span className="edu-strip-head" />
      </span>
    </div>
  );
}
