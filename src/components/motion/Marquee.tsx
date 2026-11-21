import type { CSSProperties, ReactNode } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * A line of type that travels sideways.
 *
 * By default it moves only as the visitor scrolls, so nothing moves on its
 * own. With `auto` it drifts continuously, pauses on hover and focus, and
 * shows a small Pause control (required for anything that moves by itself).
 * Without JavaScript or with reduced motion it is a wrapped, static line.
 * The content is repeated once for the loop; the copy is hidden from
 * assistive technology and cannot take focus.
 */
export function Marquee({
  children,
  className = "",
  reverse = false,
  auto = false,
  duration = 48,
  travel = 30,
  pauseLabel = "Pause",
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  auto?: boolean;
  /** Seconds per loop when `auto`. */
  duration?: number;
  /** How far the line travels across a scroll, as a percentage of its width. */
  travel?: number;
  pauseLabel?: string;
}) {
  const style: Vars = {
    "--marquee-duration": `${duration}s`,
    "--marquee-travel": `${-travel}%`,
    "--marquee-anim-dir": reverse ? "reverse" : "normal",
  };
  const view = auto ? {} : { "data-view": "" };
  return (
    <div {...view} className={`marquee ${auto ? "marquee-auto" : reverse ? "marquee-reverse" : ""} ${className}`} style={style}>
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true" inert>
          {children}
        </div>
      </div>
      {auto && (
        <label className="marquee-pause label mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 opacity-70 hover:opacity-100 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
          <input type="checkbox" className="peer sr-only" />
          <span aria-hidden className="inline-block size-2 rounded-[1px] bg-current peer-checked:rounded-full" />
          {pauseLabel}
        </label>
      )}
    </div>
  );
}
