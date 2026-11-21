"use client";

import { useEffect, useRef } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "01 / 04" and a progress line for the swipeable pathways row (phones and
 * tablets). It reads the row's scroll position and writes two values for CSS
 * (--cx, 0 to 1, and data-i, the nearest card); nothing is animated here.
 * Decorative: every card carries its own number. Hidden without JavaScript.
 */
export function PathwaysMeter({ total }: { total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const row = el?.parentElement?.querySelector<HTMLElement>("[data-carousel]");
    if (!el || !row) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = row.scrollWidth - row.clientWidth;
      const x = max > 0 ? Math.min(1, Math.max(0, row.scrollLeft / max)) : 0;
      el.style.setProperty("--cx", x.toFixed(4));
      el.dataset.i = String(Math.round(x * (total - 1)));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    row.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [total]);
  return (
    <div ref={ref} aria-hidden data-i="0" className="work-swipe label mx-5 mt-8 items-center text-stone md:mx-10">
      <span className="roll-count tabular-nums text-ink">
        <span className="roll">
          {Array.from({ length: total }, (_, i) => (
            <span key={i}>{pad(i + 1)}</span>
          ))}
        </span>
      </span>
      <span className="mx-2 opacity-50">/</span>
      <span className="tabular-nums">{pad(total)}</span>
      <span className="work-swipe-rule">
        <span />
      </span>
    </div>
  );
}
