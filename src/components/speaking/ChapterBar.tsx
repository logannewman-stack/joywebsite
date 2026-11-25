import { chapters } from "./chapters";

/**
 * The chapter indicator: a slim bar at the top of the screen that names which
 * of the page's four chapters the visitor is in and counts it (02 / 04). It
 * is ink on white, and white on black over the black chapter.
 *
 * Each chapter section renders its own copy, fixed to the viewport and
 * clipped to that section (styles in speaking.css). So the bar never moves,
 * yet it changes exactly where one chapter's edge passes it, takes the
 * section's own colour, and is simply absent outside the chapters. No
 * JavaScript is involved.
 *
 * It sits where the site header sits, underneath it: it shows while the
 * header is away (reading down the page) and the header covers it when it
 * returns, so the two never stack. It starts a little way into its chapter,
 * once the chapter's own heading has left the top of the screen.
 *
 * It repeats the "On this page" list in the opening, so it is hidden from
 * assistive technology (that list stays the keyboard route).
 */
export function ChapterBar({ current, tone = "light" }: { current: number; tone?: "light" | "dark" }) {
  const two = (n: number) => String(n).padStart(2, "0");
  return (
    <div aria-hidden className="sp-bar-clip">
      <div className={`sp-bar ${tone === "dark" ? "sp-bar-dark" : ""}`}>
        <span className="sp-bar-name label">{chapters[current].label}</span>
        <span className="sp-bar-count label">
          {two(current + 1)} / {two(chapters.length)}
        </span>
      </div>
    </div>
  );
}
