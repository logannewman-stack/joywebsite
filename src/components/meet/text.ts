/**
 * Display-line typesetting for the Meet page. The wording is unchanged; only
 * line breaking is steered with no-break spaces.
 */

/** Ties the pronoun "I" to the word after it, so a line never ends on a lone "I". */
export function bindI(text: string): string {
  return text.replace(/\bI (?=\S)/g, "I ");
}
