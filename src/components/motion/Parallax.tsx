import type { CSSProperties, ReactNode } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * A frame whose content drifts a little slower than the page. Give the frame
 * its size (an aspect ratio or a height); the content fills it.
 *
 *   <Parallax className="aspect-[4/5]"><Photo slot={...} className="h-full w-full" /></Parallax>
 */
export function Parallax({
  children,
  className = "",
  amount = 8,
}: {
  children: ReactNode;
  className?: string;
  /** How far the content travels, as a percentage of its height (default 8). */
  amount?: number;
}) {
  const style: Vars = { "--parallax": `${amount}%`, "--parallax-scale": 1 + (amount * 1.5) / 100 };
  return (
    // The scroll engine writes --v on this element before React hydrates.
    <div data-view className={`parallax ${className}`} style={style} suppressHydrationWarning>
      <div className="parallax-inner">{children}</div>
    </div>
  );
}
