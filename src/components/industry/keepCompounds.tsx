import { Fragment, type ReactNode } from "react";

/**
 * Keeps hyphenated compounds ("long-term", "hands-on") on one line in body
 * copy, so a line never ends on "long-". The wording is unchanged.
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
