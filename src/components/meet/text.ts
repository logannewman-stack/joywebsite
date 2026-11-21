/**
 * Display-line typesetting for the Meet page. The wording is unchanged: a
 * no-break space ties the pronoun "I" to the word after it, so a display line
 * never ends on a lone "I" ("In the operatory, I / tested and refined.").
 */
export function bindI(text: string): string {
  return text.replace(/\bI (?=\S)/g, "I ");
}
