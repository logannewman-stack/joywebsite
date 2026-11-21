import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
    <span className={`label ml-2 rounded-full border border-current/30 px-1.5 py-0.5 !text-[8.5px] whitespace-nowrap opacity-70 ${className}`}>
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
 * Shared interaction states. Solid buttons: a visible hover (ink to the logo
 * charcoal, or white to ivory on dark) and a small press. Text links: one
 * size, gap and icon size everywhere (ArrowLink, and InquiryButton's text variant).
 */
export const buttonStates =
  "transition-[background-color,scale] duration-(--duration-hover) ease-out motion-safe:active:scale-[0.98]";
export const textLink = "group inline-flex min-h-11 items-center gap-2 text-[15px] font-medium";

const solid = {
  light: `bg-ink text-white hover:bg-charcoal ${focusRing.light}`,
  dark: `bg-white text-ink hover:bg-ivory ${focusRing.dark}`,
};

const arrowMove = "size-4 shrink-0 transition-transform duration-(--duration-ui) ease-expo";

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
  const cls = `group inline-flex min-h-12 items-center gap-3 whitespace-nowrap rounded-full px-6 py-3 text-[15px] font-medium ${buttonStates} ${solid[tone]} ${className}`;
  const inner = (
    <>
      {children}
      {r.external ? (
        <ArrowUpRight className={`${arrowMove} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} aria-hidden />
      ) : (
        <ArrowRight className={`${arrowMove} group-hover:translate-x-1`} aria-hidden />
      )}
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
      {r.external ? (
        <ArrowUpRight className={`${arrowMove} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} aria-hidden />
      ) : (
        <ArrowRight className={`${arrowMove} group-hover:translate-x-1`} aria-hidden />
      )}
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
      {index && <span className="h-px w-8 bg-current opacity-40" aria-hidden />}
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
      <p className="label !text-[10px] leading-relaxed text-balance">{children}</p>
    </div>
  );
}
