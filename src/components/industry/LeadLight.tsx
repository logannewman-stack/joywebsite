import { Fragment, type CSSProperties } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The Clinical Launch lead as the page's statement: its words brighten one
 * after another, driven by the pinned scene on wide screens and by its own
 * path across the viewport elsewhere (see .launch-lead in industry.css). It
 * uses the motion system's .word-light, so the sentence stays real text.
 *
 * `accent` is the phrase that closes the sentence; it is set in champagne
 * gold italic (the motion system's gold highlight, for large display words on
 * black) on its own balanced lines, so it is never split from its first word. The
 * wording is never changed: if the phrase is not the end of the text, nothing
 * is accented.
 */
export function LeadLight({ text, accent, className = "" }: { text: string; accent?: string; className?: string }) {
  const words = text.split(" ").filter(Boolean);
  const accented = accent && text.endsWith(accent) ? accent.split(" ").filter(Boolean).length : 0;
  const from = words.length - accented;
  const line = (list: string[], start: number) =>
    list.map((w, i) => (
      <Fragment key={i}>
        {i > 0 && " "}
        <span className="launch-word" style={{ "--i": start + i } as Vars}>
          {w}
        </span>
      </Fragment>
    ));
  return (
    <span data-view className={`word-light launch-lead ${className}`} style={{ "--n": words.length } as Vars}>
      <span className="launch-line">{line(words.slice(0, from), 0)}</span>
      {accented > 0 && (
        <>
          {" "}
          <span className="launch-line launch-accent hl-gold">{line(words.slice(from), from)}</span>
        </>
      )}
    </span>
  );
}
