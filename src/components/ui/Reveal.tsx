import type { CSSProperties, ReactNode } from "react";

/*
 * Reveal motion that never hides content from the server HTML.
 *
 * Elements are hidden only once the `js` class is on <html> (an inline
 * script in the layout's <head> adds it before first paint) and are shown
 * again by a small inline IntersectionObserver at the end of <body>, which
 * runs before React hydrates. Without JavaScript, for crawlers, in print,
 * and with reduced motion, everything is simply visible. Styles live in
 * globals.css under "Reveals".
 *
 * Above-the-fold content should use `immediate` (Reveal, ImageReveal) or
 * LineReveal: those are plain CSS animations that start at first paint.
 */

type Vars = CSSProperties & Record<`--${string}`, string>;

/** Quiet fade-and-lift the first time content enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className = "",
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Animate on page load instead of on scroll (use above the fold). */
  immediate?: boolean;
}) {
  const style: Vars = { "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` };
  return (
    <div data-reveal={immediate ? "now" : ""} className={className} style={style} suppressHydrationWarning>
      {children}
    </div>
  );
}

/** Photographs uncover from the bottom edge, like a print being pulled. */
export function ImageReveal({
  children,
  className = "",
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Animate on page load instead of on scroll (use for the opening photo). */
  immediate?: boolean;
}) {
  const style: Vars = { "--reveal-delay": `${delay}s` };
  return (
    <div data-reveal-image={immediate ? "now" : ""} className={className} style={style} suppressHydrationWarning>
      {children}
    </div>
  );
}

/** Headline lines slide up from a mask, one after another, from first paint. */
export function LineReveal({
  lines,
  className,
  lineClassName = "",
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => {
        const style: Vars = { "--line-delay": `${delay + i * 0.1}s` };
        return (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <span className={`line-rise block ${lineClassName}`} style={style}>
              {line}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Inline script for <head>: marks the document as JS-capable before paint. */
export const REVEAL_HEAD_SCRIPT = `document.documentElement.classList.add('js')`;

/**
 * Inline script for the end of <body>: reveals [data-reveal] and
 * [data-reveal-image] elements as they enter the viewport. A MutationObserver
 * picks up content added by client-side navigation.
 */
export const REVEAL_BODY_SCRIPT = `(function(){var d=document.documentElement;if(!('IntersectionObserver' in window)){d.classList.remove('js');return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-in','');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});function scan(){document.querySelectorAll('[data-reveal=""]:not([data-in]),[data-reveal-image=""]:not([data-in])').forEach(function(el){io.observe(el)})}scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})})();`;
