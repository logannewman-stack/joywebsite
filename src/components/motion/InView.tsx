import type { CSSProperties, ElementType, ReactNode } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Marks its content as "seen" the first time it enters the viewport, so the
 * entrance classes in motion.css can play inside it:
 *
 *   .rise        fades and lifts            (--d delays it, e.g. style={{"--d": "0.1s"}})
 *   .stagger     its children enter one after another
 *   .rule-draw   a hairline draws from the left
 *   .wipe        wipes in from the left (the script wordmark)
 *   .settle      a photo settles from slightly large
 *
 * WordRise, LineRise and a light-tone Hl also play inside it. The classes
 * can sit on the InView element itself (className="rise") or on anything in it.
 */
export function InView({
  children,
  className = "",
  as: Tag = "div",
  delay,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds added to every entrance inside (sets --d). */
  delay?: number;
  id?: string;
}) {
  const style: Vars | undefined = delay ? { "--d": `${delay}s` } : undefined;
  return (
    <Tag id={id} data-inview="" className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Leans a few pixels toward the pointer (fine pointers only). Wrap a button or an arrow circle. */
export function Magnetic({ children, strength = 0.3, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  return (
    <span data-magnetic={strength} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}
