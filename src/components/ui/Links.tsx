import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { links, site } from "@/content/site";

/**
 * The companion consulting site. Use this everywhere Instrumental is linked
 * so the "URL pending" tag, new-tab behavior and launch guard stay consistent.
 * While the URL is pending (review mode only: the launch check in site.ts
 * requires it), `href` is "#"; render <PendingLink> instead of navigating to it.
 */
export function instrumentalLink(): { href: string; pending: boolean; newTab: boolean } {
  const pending = !links.instrumental;
  return { href: links.instrumental || "#", pending, newTab: !pending };
}

/** Resolves content hrefs. "instrumental" maps to the companion consulting site. */
export function resolveHref(href: string): { href: string; external: boolean; pending: boolean } {
  if (href === "instrumental") {
    const i = instrumentalLink();
    return { href: i.href, external: true, pending: i.pending };
  }
  const external = /^https?:\/\//.test(href);
  return { href, external, pending: false };
}

/** Review-mode tag for links whose destination has not been supplied yet. */
export function PendingTag({ className = "" }: { className?: string }) {
  if (!site.showPlaceholders) return null;
  return (
    <span className={`label ml-2 rounded-full border border-current/30 px-1.5 py-0.5 !text-[0.53125rem] whitespace-nowrap opacity-70 ${className}`}>
      URL pending
    </span>
  );
}

const Pending = PendingTag;

/**
 * A link whose destination has not been supplied yet (review mode). It keeps
 * the link's look and place in the tab order but goes nowhere, instead of
 * jumping to the top of the page through href="#".
 */
export function PendingLink({ children, className = "", title = "Link to come" }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <span role="link" aria-disabled="true" tabIndex={0} title={title} className={`cursor-not-allowed ${className}`}>
      {children}
    </span>
  );
}

/**
 * Link to the Instrumental site with the shared new-tab and pending behavior.
 * Pass the link's own classes and content; the "URL pending" tag is added while
 * the address is missing.
 */
export function InstrumentalLink({ children, className = "", pendingTagClassName = "" }: { children: ReactNode; className?: string; pendingTagClassName?: string }) {
  const i = instrumentalLink();
  if (i.pending) {
    return (
      <PendingLink className={className} title="Instrumental website link to come">
        {children}
        <Pending className={pendingTagClassName} />
      </PendingLink>
    );
  }
  return (
    <a href={i.href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Focus ring that stays visible on both light and dark surfaces. */
export const focusRing = {
  light: "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink",
  dark: "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white",
};

/**
 * Shared interaction states (styles in src/app/styles/chrome.css).
 *
 * Pills: a soft fill change on hover (ink to the logo charcoal; white to
 * champagne gold on black), the arrow swap below, and one press state
 * everywhere: `press` (a small, quick scale). Text links: the underline draws
 * (`link-draw`) and the same arrow swap; pressed, they dim.
 */
export const press = "press";
export const buttonStates = press;
export const textLink = "group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium";
/** Fill for a solid pill, by the surface it sits on. */
export const solidFill = {
  light: "bg-ink text-white hover:bg-charcoal",
  dark: "bg-white text-ink hover:bg-gold-soft",
};

const solid = {
  light: `${solidFill.light} ${focusRing.light}`,
  dark: `${solidFill.dark} ${focusRing.dark}`,
};

type ArrowDirection = "right" | "up-right" | "up" | "left";
const arrowIcon = { right: ArrowRight, "up-right": ArrowUpRight, up: ArrowUp, left: ArrowLeft };
const arrowTravel: Record<ArrowDirection, string> = { right: "", "up-right": "swap-ne", up: "swap-n", left: "swap-w" };

/**
 * The arrow swap: on hover or keyboard focus of the nearest `group`, the arrow
 * travels out of its own small frame and a second arrow enters from the
 * opposite side. Decorative; without motion the two arrows are identical, so
 * nothing changes. Use it wherever a button or link carries an arrow.
 */
export function SwapArrow({ direction = "right", className = "size-4" }: { direction?: ArrowDirection; className?: string }) {
  const Icon = arrowIcon[direction];
  return (
    <span aria-hidden className={`swap ${arrowTravel[direction]} ${className}`}>
      <Icon className="size-full" />
      <Icon className="size-full" />
    </span>
  );
}

/** Solid, high-contrast button. Large hit area, plain words. */
export function ButtonLink({
  href,
  children,
  tone = "light",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const r = resolveHref(href);
  // One line at every normal size; below 360px a long label may wrap rather than push past the
  // screen edge (e.g. at 320px with increased text spacing, WCAG 1.4.12).
  const cls = `group inline-flex min-h-12 max-w-full items-center gap-3 whitespace-nowrap rounded-full px-6 py-3 text-[0.9375rem] font-medium max-[359px]:whitespace-normal ${buttonStates} ${solid[tone]} ${className}`;
  const inner = (
    <>
      {children}
      <SwapArrow direction={r.external ? "up-right" : "right"} />
    </>
  );
  if (r.pending) {
    return (
      <PendingLink className={cls} title="Instrumental website link to come">
        {inner}
        <Pending />
      </PendingLink>
    );
  }
  if (r.external) {
    return (
      <a href={r.href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={r.href} className={cls}>
      {inner}
    </Link>
  );
}

/** Text link with an arrow, for secondary actions. */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const r = resolveHref(href);
  const cls = `${textLink} transition-opacity duration-(--duration-hover) active:opacity-70 ${className}`;
  const inner = (
    <>
      <span className="link-draw pb-0.5">{children}</span>
      <SwapArrow direction={r.external ? "up-right" : "right"} />
    </>
  );
  if (r.pending) {
    return (
      <PendingLink className={cls} title="Instrumental website link to come">
        {inner}
        <Pending />
      </PendingLink>
    );
  }
  if (r.external) {
    return (
      <a href={r.href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={r.href} className={cls}>
      {inner}
    </Link>
  );
}

/** Small uppercase section label, optionally with an index. Use `as="h2"` when it is the section's heading. */
export function Label({
  index,
  children,
  className = "",
  as: Tag = "p",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  as?: "p" | "h2" | "h3";
}) {
  return (
    <Tag className={`label flex items-center gap-3 ${className}`}>
      {index && <span className="tabular-nums">{index}</span>}
      {/* The short rule is gold: gold-deep on light surfaces, gold on black (.label-rule in styles/chrome.css). */}
      {index && <span className="label-rule h-px w-8" aria-hidden />}
      <span>{children}</span>
    </Tag>
  );
}

/** A labelled empty slot, visible only in review mode. */
export function ReviewSlot({ children, tone = "light", className = "" }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  if (!site.showPlaceholders) return null;
  return (
    <div
      className={`flex min-h-28 items-center justify-center rounded-sm border border-dashed px-6 py-8 text-center ${
        tone === "dark" ? "border-white/25 text-white/60" : "border-ink/25 text-stone"
      } ${className}`}
    >
      <p className="label !text-[0.625rem] leading-relaxed text-balance">{children}</p>
    </div>
  );
}
