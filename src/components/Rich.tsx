import { Fragment } from "react";

/**
 * Renders a content string with lightweight inline formatting:
 *   **words** -> violet highlight
 *   _words_   -> serif italic accent
 *   \n        -> line break
 */
export function Rich({
  text,
  highlightClass = "text-violet-hi font-bold",
  accentClass = "font-serif italic font-normal text-violet-soft",
}: {
  text: string;
  highlightClass?: string;
  accentClass?: string;
}) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\n)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part === "\n") return <br key={i} />;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className={highlightClass}>
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
          return (
            <span key={i} className={accentClass}>
              {part.slice(1, -1)}
            </span>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
