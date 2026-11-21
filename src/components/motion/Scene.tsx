import type { CSSProperties, ElementType, ReactNode } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * A pinned scene: a tall section whose stage sticks to the viewport while the
 * visitor scrolls through `length` screens. CSS inside reads `--p` (0 to 1).
 *
 * `from` is the width from which it pins ("all", "md" or "lg"). Below that,
 * without JavaScript and with reduced motion it is an ordinary section: lay
 * the content out for that case first, then use `pinned:` utilities for the
 * pinned version.
 *
 * With `steps`, wrap the changing content in <SceneSteps> and <SceneStep>:
 * one step shows at a time. With a <SceneTrack>, the track slides sideways.
 */
export function Scene({
  children,
  length = 3,
  steps,
  from = "all",
  dark = false,
  id,
  className = "",
  pinClassName = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  /** How many screens of scrolling the scene lasts while pinned. */
  length?: number;
  /** Number of <SceneStep> children, if the scene has steps. */
  steps?: number;
  from?: "all" | "md" | "lg";
  /** Marks the scene as a black section for the header (data-header="dark"). */
  dark?: boolean;
  id?: string;
  className?: string;
  pinClassName?: string;
  as?: ElementType;
}) {
  const style: Vars = { "--scene-length": length };
  return (
    <Tag id={id} data-scene={from} data-steps={steps} data-header={dark ? "dark" : undefined} className={className} style={style}>
      <div data-scene-pin className={pinClassName}>
        {children}
      </div>
    </Tag>
  );
}

/** Holds the steps of a scene. Unpinned, it is a normal block: give it a gap. */
export function SceneSteps({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-scene-steps className={className}>
      {children}
    </div>
  );
}

/** One step of a scene (index from 0). Keep links out of steps: a hidden step cannot be clicked. */
export function SceneStep({ index, children, className = "" }: { index: number; children: ReactNode; className?: string }) {
  return (
    <div data-scene-step={index} className={className}>
      {children}
    </div>
  );
}

/**
 * A row that slides sideways through a pinned scene. Unpinned it is whatever
 * its className says (a column, a snap carousel...). Mark each panel with
 * <ScenePanel> so keyboard focus can bring it into view.
 */
export function SceneTrack({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-scene-track className={className}>
      {children}
    </div>
  );
}

export function ScenePanel({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: ElementType }) {
  return (
    <Tag data-scene-panel className={className}>
      {children}
    </Tag>
  );
}

/** "01 / 05": the current step of the enclosing scene. Decorative; hidden from screen readers. */
export function SceneCount({ total, className = "" }: { total: number; className?: string }) {
  return (
    <span aria-hidden className={`tabular-nums ${className}`}>
      <span data-scene-count>01</span>
      <span className="mx-2 opacity-50">/</span>
      {String(total).padStart(2, "0")}
    </span>
  );
}

/** A hairline that fills as the enclosing scene progresses. */
export function SceneLine({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`relative block h-px overflow-hidden bg-current/20 ${className}`}>
      <span className="scene-line absolute inset-0 bg-current" />
    </span>
  );
}
