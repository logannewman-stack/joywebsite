import { Fragment, type ReactNode } from "react";

/**
 * Line breaking for display-size text (headlines, big quotes, course titles).
 * The wording is unchanged: a hyphenated compound ("Skill-building",
 * "sold-out", "GLP-1s") is kept on one line, so a heading never breaks at its
 * hyphen.
 */
export function typeset(text: string): ReactNode {
  return text.split(/(\s+)/).map((token, i) =>
    /\S-\S/.test(token) ? (
      <span key={i} className="whitespace-nowrap">
        {token}
      </span>
    ) : (
      <Fragment key={i}>{token}</Fragment>
    ),
  );
}
