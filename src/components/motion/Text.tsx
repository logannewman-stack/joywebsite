import { Fragment, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { typeset } from "@/components/ui/Typeset";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Words slide up from behind their own baseline, one after another, the first
 * time the text is seen. The text stays real text: screen readers, search and
 * copy-paste get the sentence unchanged.
 *
 *   <h2 className="display ..."><WordRise>Explore My Work</WordRise></h2>
 *
 * `start` continues the stagger when a heading is built from several parts
 * (for example a roman part and an italic part).
 */
export function WordRise({
  children,
  className = "",
  delay = 0,
  start = 0,
  immediate = false,
}: {
  children: string;
  className?: string;
  delay?: number;
  start?: number;
  /** Play on page load instead of on scroll (use above the fold). */
  immediate?: boolean;
}) {
  const words = children.split(" ").filter(Boolean);
  const style: Vars = { "--rise-delay": `${delay}s` };
  const trigger = immediate ? { "data-rise-now": "" } : { "data-inview": "" };
  return (
    <span {...trigger} className={className} style={style}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="wr">
            <span className="wr-in" style={{ "--i": start + i } as Vars}>
              {typeset(w)}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

/** Hand-set lines slide up one after another the first time they are seen (LineReveal's scroll twin). */
export function LineRise({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const style: Vars = { "--rise-delay": `${delay}s`, "--rise-stagger": "80ms" };
  const trigger = immediate ? { "data-rise-now": "" } : { "data-inview": "" };
  return (
    <span {...trigger} className={className} style={style}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="wr wr-block">
            <span className={`wr-in ${lineClassName}`} style={{ "--i": i } as Vars}>
              {line}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Words brighten one after another as the text crosses the viewport
 * (driver "view") or as the enclosing scene progresses (driver "scene").
 * `from` and `to` are the progress values where the first word starts and the
 * last word finishes. At rest the dim words keep `dim` opacity: choose a value
 * that still passes contrast for the text size (0.5 for large type on white).
 */
export function WordLight({
  children,
  className = "",
  driver = "view",
  from = 0.2,
  to = 0.55,
  dim = 0.3,
}: {
  children: string;
  className?: string;
  driver?: "view" | "scene";
  from?: number;
  to?: number;
  dim?: number;
}) {
  const words = children.split(" ").filter(Boolean);
  const style: Vars = { "--n": words.length, "--from": from, "--to": to, "--dim": dim };
  const view = driver === "view" ? { "data-view": "" } : {};
  return (
    <span {...view} className={`word-light ${driver === "view" ? "wl-view" : "wl-scene"} ${className}`} style={style}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span style={{ "--i": i } as Vars}>{typeset(w)}</span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * A highlighted phrase. On black it is blush type; on white or ivory it is a
 * blush marker behind ink type (blush is never small text on white). Inside
 * an [data-inview] element the marker draws itself in.
 */
export function Hl({ children, tone = "dark", className = "" }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return <span className={`${tone === "dark" ? "hl-dark" : "hl-light"} ${className}`}>{children}</span>;
}

/**
 * Splits a sentence around the phrases to highlight, keeping the wording
 * untouched: highlight("clinical excellence and business", ["business"]).
 */
export function highlight(text: string, phrases: string[], tone: "dark" | "light" = "dark"): ReactNode {
  let parts: (string | ReactElement)[] = [text];
  phrases.forEach((phrase, pi) => {
    const next: (string | ReactElement)[] = [];
    parts.forEach((part, i) => {
      if (typeof part !== "string" || !part.includes(phrase)) {
        next.push(part);
        return;
      }
      const [before, ...rest] = part.split(phrase);
      next.push(
        before,
        <Hl key={`${pi}-${i}`} tone={tone}>
          {phrase}
        </Hl>,
        rest.join(phrase),
      );
    });
    parts = next;
  });
  return parts;
}
