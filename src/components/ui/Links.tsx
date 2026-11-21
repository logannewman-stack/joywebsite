import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { links, site } from "@/content/site";

/**
 * The companion consulting site. Use this everywhere Instrumental is linked
 * so the "URL pending" tag, new-tab behavior and launch guard stay consistent.
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

/** Focus ring that stays visible on both light and dark surfaces. */
export const focusRing = {
  light: "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink",
  dark: "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white",
};

const solid = {
  light: `bg-ink text-white hover:bg-ink-soft ${focusRing.light}`,
  dark: `bg-white text-ink hover:bg-ivory ${focusRing.dark}`,
};

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
  const cls = `group inline-flex min-h-12 items-center gap-3 whitespace-nowrap rounded-full px-6 py-3 text-[15px] font-medium transition-colors duration-300 ${solid[tone]} ${className}`;
  const inner = (
    <>
      {children}
      {r.external ? (
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      ) : (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      )}
    </>
  );
  if (r.external) {
    return (
      <a href={r.href} className={cls} {...(r.pending ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
        {inner}
        {r.pending && <Pending />}
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
  const cls = `group inline-flex min-h-11 items-center gap-2 text-[15px] font-medium ${className}`;
  const inner = (
    <>
      <span className="link-draw pb-0.5">{children}</span>
      {r.external ? (
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      ) : (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      )}
      {r.pending && <Pending />}
    </>
  );
  if (r.external) {
    return (
      <a href={r.href} className={cls} {...(r.pending ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
        {inner}
        {!r.pending && <span className="sr-only"> (opens in a new tab)</span>}
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
      <p className="label !text-[10px] leading-relaxed">{children}</p>
    </div>
  );
}
