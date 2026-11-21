import { Fragment, type ReactNode } from "react";

/**
 * Display-type fixes for Instrument Serif. The wording is unchanged; only the
 * rendering of two glyphs is adjusted:
 * - Hyphens in compounds ("Skill-building", "sold-out") are drawn with wide
 *   side bearings in this face and read as a spaced dash. They are tightened,
 *   and the compound is kept on one line.
 * - The numeral 1 reads as a lowercase l ("GLP-1s" looked like "GLP-ls"). It
 *   is set in the sans face.
 * Use it for display-size text only (headlines, big quotes, course titles).
 */
export function typeset(text: string): ReactNode {
  return text.split(/(\s+)/).map((token, i) => {
    if (!/\S-\S/.test(token)) return <Fragment key={i}>{ones(token, `${i}`)}</Fragment>;
    const pieces = token.split("-");
    return (
      <span key={i} className="whitespace-nowrap">
        {pieces.map((piece, j) => (
          <Fragment key={j}>
            {j > 0 && <span className="typeset-hyphen">-</span>}
            {ones(piece, `${i}-${j}`)}
          </Fragment>
        ))}
      </span>
    );
  });
}

function ones(text: string, key: string): ReactNode {
  if (!text.includes("1")) return text;
  return text.split(/(1)/).map((part, k) =>
    part === "1" ? (
      <span key={`${key}-${k}`} className="typeset-one">
        1
      </span>
    ) : (
      part
    ),
  );
}
