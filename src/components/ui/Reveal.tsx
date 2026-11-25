import { Fragment, type CSSProperties, type ReactNode } from "react";

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
  y = 12,
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

/**
 * Photographs uncover from the bottom edge, like a print being pulled.
 *
 * The uncover waits until the photo inside has loaded, so it never reveals an
 * empty frame, and it uses a CSS mask rather than clip-path so the browser
 * still lazy-loads the photo ahead of the scroll. If a page needs its own
 * mask-image (for example a fade into black), put it on a parent or child
 * element: a mask set on this element replaces the uncover.
 */
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
        const style: Vars = { "--line-delay": `${delay + i * 0.06}s` };
        return (
          <Fragment key={i}>
            {/* A real space between lines, so the heading's text reads "has always", not "hasalways". It is not rendered between the block lines. */}
            {i > 0 && " "}
            <span className="block overflow-hidden pb-[0.08em]">
              <span className={`line-rise block ${lineClassName}`} style={style}>
                {line}
              </span>
            </span>
          </Fragment>
        );
      })}
    </span>
  );
}

/** Inline script for <head>: marks the document as JS-capable before paint. */
export const REVEAL_HEAD_SCRIPT = `document.documentElement.classList.add('js')`;

/**
 * Inline script for the end of <body>:
 * - reveals [data-reveal] and [data-reveal-image] elements as they enter the viewport (data-in);
 * - marks each [data-reveal-image] ready to uncover (data-loaded) as soon as there is something to
 *   show: the photo's blur preview, or else the loaded photo. A reveal never uncovers an empty frame;
 * - fades each photo in over its preview once it has loaded ([data-blur] gets data-shown).
 * A MutationObserver picks up content added by client-side navigation: one rescan per animation
 * frame, and only when something with a reveal or a blur preview was added.
 */
export const REVEAL_BODY_SCRIPT = `(function(){var d=document.documentElement;if(!('IntersectionObserver' in window)){d.classList.remove('js');return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(d.__wait)d.__wait(e.target);e.target.setAttribute('data-in','');io.unobserve(e.target)}})},{rootMargin:'0px 0px -4% 0px'});function ready(img,fn){if(!img||img.complete){fn();return}img.addEventListener('load',fn,{once:true});img.addEventListener('error',fn,{once:true})}function scan(){document.querySelectorAll('[data-reveal=""]:not([data-in]),[data-reveal-image=""]:not([data-in])').forEach(function(el){io.observe(el)});document.querySelectorAll('[data-blur]:not([data-shown])').forEach(function(el){if(el.__rb)return;el.__rb=1;ready(el.querySelector('img'),function(){el.setAttribute('data-shown','')})});document.querySelectorAll('[data-reveal-image]:not([data-loaded])').forEach(function(el){if(el.__rv)return;el.__rv=1;var done=function(){el.setAttribute('data-loaded','')};if(el.querySelector('[data-blur]')){done();return}ready(el.querySelector('img'),done)})}scan();var q=false,S='[data-reveal],[data-reveal-image],[data-blur]';new MutationObserver(function(rs){if(q)return;for(var i=0;i<rs.length;i++){var a=rs[i].addedNodes;for(var j=0;j<a.length;j++){var n=a[j];if(n.nodeType===1&&(n.matches(S)||n.querySelector(S))){q=true;requestAnimationFrame(function(){q=false;scan()});return}}}}).observe(document.body,{childList:true,subtree:true})})();`;
