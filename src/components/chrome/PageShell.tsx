"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * The part of the frame that changes with the page: <main> and the footer.
 *
 * Page transitions: the shell sits in React's <ViewTransition> and is keyed
 * by the path, so a navigation is one page leaving and another entering.
 * Where the browser supports view transitions the new page dissolves in over
 * the old one with a slight rise, and a link that carries the "next-page"
 * transition type (NextPage) brings it up from below like the next spread
 * (styles/chrome.css). Everywhere else, and with reduced motion, the page
 * simply changes. Navigation is never held back: the animation starts after
 * the new page has committed, on a snapshot of the old one.
 *
 * The footer lives inside the shell so the snapshot is the page as it looks
 * (the footer covered by <main>), and .foot-ghost marks the footer's place in
 * the flow for the header while the footer itself is sticky (see Footer).
 */
export function PageShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition
      key={pathname}
      enter={{ "next-page": "spread-in", default: "page-in" }}
      exit={{ "next-page": "spread-out", default: "page-out" }}
      default="none"
    >
      <div className="page-shell">
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <div aria-hidden data-header="dark" className="foot-ghost" />
        {footer}
      </div>
    </ViewTransition>
  );
}
