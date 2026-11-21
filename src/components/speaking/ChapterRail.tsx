import type { CSSProperties } from "react";
import { chapters } from "./chapters";

/**
 * The chapter rail (desktop): a slim indicator in the left margin that shows
 * which of the page's four chapters the visitor is in, and how far through.
 *
 * Each chapter section renders its own copy, fixed to the viewport and
 * clipped to that section (styles in speaking.css). So the rail never moves,
 * yet it changes exactly where one chapter's edge passes it, takes the
 * section's own colour (white on the black chapter), and is simply absent
 * outside the chapters. No JavaScript is involved; only the progress fill of
 * the current mark reads the scroll engine's --v.
 *
 * It repeats the "On this page" list in the opening, so it is hidden from
 * assistive technology and from the tab order (that list stays the keyboard
 * route); with a mouse, each mark jumps to its chapter.
 */
export function ChapterRail({ current, tone = "light" }: { current: number; tone?: "light" | "dark" }) {
  return (
    <div aria-hidden data-view className="sp-rail-clip">
      <div className={`sp-rail ${tone === "dark" ? "text-white" : "text-ink"}`}>
        {chapters.map((c, i) => (
          <a
            key={c.href}
            href={c.href}
            tabIndex={-1}
            data-state={i === current ? "current" : i < current ? "past" : "next"}
            className="sp-rail-item"
            style={{ "--i": i } as CSSProperties}
          >
            <span className="sp-rail-tick" />
            <span className="sp-rail-name label">{c.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
