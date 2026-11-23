import { chapters } from "./chapters";

/**
 * The chapter indicator: which of the page's four chapters the visitor is in,
 * and how far through. On desktop it is a slim rail in the left margin; on
 * phones and tablets, a slim bar at the top of the screen.
 *
 * Each chapter section renders its own copy of both, fixed to the viewport
 * and clipped to that section (styles in speaking.css). So the indicator
 * never moves, yet it changes exactly where one chapter's edge passes it,
 * takes the section's own colour (white on the black chapter), and is simply
 * absent outside the chapters. No JavaScript is involved.
 *
 * Each chapter is a small dot (no lines): faint ahead, solid once read, gold
 * and a little larger for the chapter on screen. The marks change sharply at a chapter's edge
 * (the clip), but the chapter's name, set down the margin, is as tall as a
 * paragraph: clipped the same way it would show the halves of two names at
 * once. So the name has a layer of its own and is on screen only while the
 * whole of it lies inside its chapter: it fades in and out where scroll-driven
 * animations exist, and elsewhere its layer ends early, so one name has left
 * before the next arrives.
 *
 * The bar names the chapter and counts it (02 / 04). It sits where the site
 * header sits, underneath it: it shows while the header is away (reading
 * down the page) and the header covers it when it returns, so the two never
 * stack. It starts a little way into its chapter, once the chapter's own
 * heading has left the top of the screen.
 *
 * Both repeat the "On this page" list in the opening, so they are hidden
 * from assistive technology and from the tab order (that list stays the
 * keyboard route); with a mouse, each mark of the rail jumps to its chapter.
 */
export function ChapterRail({
  current,
  tone = "light",
  ground = "paper",
}: {
  current: number;
  tone?: "light" | "dark";
  /** The section's own colour on a light chapter, for the bar. */
  ground?: "paper" | "ivory";
}) {
  const two = (n: number) => String(n).padStart(2, "0");
  return (
    <>
      <div aria-hidden className="sp-rail-clip">
        <div className={`sp-rail ${tone === "dark" ? "sp-rail-dark text-white" : "text-ink"}`}>
          {chapters.map((c, i) => (
            <a
              key={c.href}
              href={c.href}
              tabIndex={-1}
              data-state={i === current ? "current" : i < current ? "past" : "next"}
              className="sp-rail-item"
            >
              <span className="sp-rail-tick" />
              {/* Another chapter's name, previewed while its mark is hovered. */}
              {i !== current && <span className="sp-rail-name label">{c.label}</span>}
            </a>
          ))}
        </div>
      </div>
      {/* This chapter's name, in a layer of its own so it can leave before the chapter's edge reaches it. */}
      <div aria-hidden className="sp-rail-clip sp-rail-clip-name">
        <div className={`sp-rail ${tone === "dark" ? "sp-rail-dark text-white" : "text-ink"}`}>
          <span className="sp-rail-name label">
            <span className="sp-rail-name-in">
              <span className="sp-rail-name-out">{chapters[current].label}</span>
            </span>
          </span>
        </div>
      </div>
      <div aria-hidden className="sp-bar-clip">
        <div className={`sp-bar ${tone === "dark" ? "sp-bar-dark" : ground === "ivory" ? "sp-bar-ivory" : ""}`}>
          <span className="sp-bar-name label">{chapters[current].label}</span>
          <span className="sp-bar-count label">
            {two(current + 1)} / {two(chapters.length)}
          </span>
        </div>
      </div>
    </>
  );
}
