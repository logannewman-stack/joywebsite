import { Fragment, type ReactNode } from "react";

/**
 * Keeps hyphenated compounds ("long-term", "hands-on", "well-being") on one
 * line in body copy, so a line never ends on "long-". It also lets the
 * browser's own last-line care work (`text-wrap: pretty` on paragraphs): a
 * compound it may break counts as two words, so one left alone on the last
 * line is not seen as stranded. The wording is unchanged.
 */
export function keepCompounds(text: string): ReactNode {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    /^\S+-\S+$/.test(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
