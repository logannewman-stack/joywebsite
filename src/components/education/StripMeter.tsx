"use client";

import { useEffect, useRef } from "react";

/**
 * A thin grey line under the row of prints while it is a row to swipe, with
 * the part of the row in view marked on it in ink. It reads the row's
 * sideways scroll position and writes two values for CSS: --w (0 to 1, how
 * much of the row is in view) and --p (0 to 1, how far it has travelled).
 * Nothing is animated here.
 *
 * Decorative: hidden from assistive technology, and shown only once this
 * script has measured the row (education.css, "Row of prints").
 *
 * It also keeps the row's group a tab stop only while there is something to
 * move with the arrow keys: where every print is in view the row does not
 * scroll sideways, so the tab stop and the line are taken away.
 */
export function StripMeter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const row = el?.parentElement?.querySelector<HTMLElement>("[data-filmstrip]");
    if (!el || !row) return;
    let frame = 0;
    // Read on load and on resize only: whether the row scrolls sideways, and how much of it is in view.
    const measure = () => {
      const scrolls = row.scrollWidth - row.clientWidth > 1;
      if (scrolls) row.tabIndex = 0;
      else row.removeAttribute("tabindex");
      el.toggleAttribute("data-live", scrolls);
      el.style.setProperty("--w", scrolls ? (row.clientWidth / row.scrollWidth).toFixed(4) : "1");
    };
    const update = () => {
      frame = 0;
      const max = row.scrollWidth - row.clientWidth;
      const x = Math.min(Math.max(row.scrollLeft, 0), Math.max(max, 0));
      el.style.setProperty("--p", max > 0 ? (x / max).toFixed(4) : "0");
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
  }, []);
  return (
    <div ref={ref} aria-hidden className="edu-strip-meter">
      <span />
    </div>
  );
}
