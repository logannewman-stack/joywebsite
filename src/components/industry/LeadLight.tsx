import { Fragment, type CSSProperties } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The Clinical Launch lead as the section's statement: its words brighten one
 * after another, driven by the pinned scene on wide screens and by the
 * sentence's own path across the screen elsewhere (the motion system's
 * .word-light, timed by .launch-lead in industry.css), so it stays real text.
 *
 * `close` is the phrase that closes the sentence. The sentence is set as two
 * line groups, each balanced on its own, so the phrase is never split from
 * its first word. The wording is never changed: if the phrase is not the end
 * of the text, the sentence is one group.
 */
export function LeadLight({ text, close, className = "" }: { text: string; close?: string; className?: string }) {
  const words = text.split(" ").filter(Boolean);
  const closing = close && text.endsWith(close) ? close.split(" ").filter(Boolean).length : 0;
  const from = words.length - closing;
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
    // The scroll engine writes --v (data-view) and the scene's --p (data-scene-vars) on this element before React hydrates.
    <span data-view="" data-scene-vars="" className={`word-light launch-lead ${className}`} style={{ "--n": words.length } as Vars} suppressHydrationWarning>
      <span className="launch-line">{line(words.slice(0, from), 0)}</span>
      {closing > 0 && (
        <>
          {" "}
          <span className="launch-line">{line(words.slice(from), from)}</span>
        </>
      )}
    </span>
  );
}
