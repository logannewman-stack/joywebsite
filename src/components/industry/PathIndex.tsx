import type { CSSProperties } from "react";
import { InView } from "@/components/motion/InView";
import { ArrowCircle } from "./ArrowCircle";

type Vars = CSSProperties & Record<`--${string}`, string>;

/** Seconds before the first row arrives: the headline and the offer above it come first. */
const DELAY = 0.3;
/** Seconds between one row and the next (the motion system's stagger). */
const STEP = 0.07;

/** A thin line across the list that draws from the left, in step with row `i`. */
function Rule({ i, edge }: { i: number; edge: "top" | "bottom" }) {
  return (
    <span
      aria-hidden
      className={`rule-draw absolute inset-x-0 block h-px bg-line ${edge === "top" ? "top-0" : "bottom-0"}`}
      style={{ "--d": `${(DELAY + i * STEP).toFixed(2)}s` } as Vars}
    />
  );
}

/**
 * The two ways to work together, named with their approved headings and
 * numbered as a list, so the page's two inquiry categories are clear from the
 * first screen. Each row jumps to its section.
 *
 * It is set as a ledger: a thin line above each row and under the last. The
 * rows come in one after another and each line draws from the left with its
 * row. On hover or focus a row answers as one: a soft wash rises behind it,
 * the title leans in, the number darkens and the arrow travels down as its
 * ring fills.
 */
export function PathIndex({ items, className = "" }: { items: { label: string; href: string }[]; className?: string }) {
  return (
    <nav aria-label="On this page" className={className}>
      <InView delay={DELAY}>
        <ol className="stagger">
          {items.map((item, i) => (
            <li key={item.href} className="relative">
              <Rule i={i} edge="top" />
              <a href={item.href} className="group relative flex min-h-14 items-center gap-5 py-3">
                <span className="label w-6 shrink-0 text-stone tabular-nums transition-colors duration-(--duration-ui) group-hover:text-ink group-focus-visible:text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lean display t-h3 flex-1">{item.label}</span>
                <ArrowCircle direction="down" className="size-8 shrink-0" iconClassName="size-3.5" />
                <span aria-hidden className="rule-over" />
              </a>
              {i === items.length - 1 && <Rule i={i + 1} edge="bottom" />}
            </li>
          ))}
        </ol>
      </InView>
    </nav>
  );
}
