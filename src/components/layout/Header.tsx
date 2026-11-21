"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/content/site";
import { Wordmark } from "../ui/Brand";
import { instrumentalLink, PendingTag } from "../ui/Links";
import { typeset } from "../ui/Typeset";
import { InquiryButton } from "../inquiry/InquiryProvider";
import { inertOutside, lockScroll, trapTab } from "../inquiry/modal";

/** Height of the header bar; the dark-section observer watches this band. */
const BAR = 76;

/*
 * Header colour follows what is under it. Any page can mark a section with
 * data-header="dark" (Home's black hero, the footer, black page sections):
 * while one sits behind the header bar, the header uses its dark variant
 * (transparent at the top, ink once scrolled, cream wordmark, light links and
 * pill). An IntersectionObserver watches a band the height of the bar, so
 * nothing runs on every scroll frame.
 *
 * The observer starts after hydration. Pages that OPEN on a dark section are
 * listed here so the server HTML already has the dark variant and nothing
 * flashes: add a path when a page's first section carries data-header="dark".
 */
function opensDark(pathname: string) {
  return pathname === "/" && site.homeHero === "b";
}

/** Home is the cover; the five pages carry their page numbers, as on their own openings (Meet 01 … Insights 05). */
const menu = [
  { label: "Home", href: "/", index: "" },
  ...nav.map((item, i) => ({ label: item.label, href: item.href, index: String(i + 1).padStart(2, "0") })),
];

const ease = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function Header() {
  const pathname = usePathname();
  const [path, setPath] = useState(pathname);
  const [overDark, setOverDark] = useState(() => opensDark(pathname));
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // A new page: close the menu and start from that page's opening colour.
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
    setOverDark(opensDark(pathname));
  }

  const closeMenu = useCallback((focusToggle: boolean) => {
    setOpen(false);
    if (focusToggle) toggleRef.current?.focus({ preventScroll: true });
  }, []);

  // Scrolled state and hide-on-scroll-down, at most once per frame.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y <= 400) {
        setHidden(false);
        last = y;
      } else if (y > last + 12) {
        setHidden(true);
        last = y;
      } else if (y < last - 12) {
        setHidden(false);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Dark variant while any [data-header="dark"] element is behind the bar.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('[data-header="dark"]'));
    if (!targets.length) {
      const frame = requestAnimationFrame(() => setOverDark(false));
      return () => cancelAnimationFrame(frame);
    }
    const behind = new Set<Element>();
    let io: IntersectionObserver | null = null;
    const watch = () => {
      io?.disconnect();
      behind.clear();
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) behind.add(e.target);
            else behind.delete(e.target);
          }
          setOverDark(behind.size > 0);
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - BAR)}px 0px` },
      );
      for (const t of targets) io.observe(t);
    };
    watch();
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(watch, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      io?.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  // Open menu: page locked and inert behind it, Tab stays in the header and menu,
  // Escape closes and returns focus to the menu button. Wide screens close it.
  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const restore = inertOutside([headerRef.current, menuRef.current]);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.isComposing) {
        e.preventDefault();
        closeMenu(true);
      } else trapTab(e, [headerRef.current, menuRef.current]);
    };
    const wide = window.matchMedia("(min-width: 1280px)");
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      unlock();
      restore();
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open, closeMenu]);

  const dark = overDark && !open;
  const surface = open
    ? "bg-paper"
    : dark
      ? scrolled
        ? "bg-ink/85 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.07)]"
        : "bg-transparent"
      : scrolled
        ? "bg-paper/90 backdrop-blur-md shadow-[0_1px_0_rgba(11,11,11,0.08)]"
        : "bg-paper";
  const tone = dark ? "dark" : "light";

  return (
    <>
      <a
        href="#main"
        className="label fixed top-3 left-3 z-[80] -translate-y-20 bg-ink px-4 py-3 text-white transition-transform focus:translate-y-0 focus-visible:outline-white"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        data-tone={tone}
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 mr-[var(--scroll-lock-gap,0px)] transition-[translate,background-color,box-shadow,color] duration-[var(--duration-ui,320ms)] ${ease} ${surface} ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${dark ? "text-white" : "text-ink"}`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10">
          <Link
            href="/"
            aria-label={`${site.name}, home`}
            onClick={() => open && closeMenu(false)}
            className="shrink-0 rounded-sm focus-visible:outline-offset-4"
          >
            {/* Both artworks are in the page so switching tone never waits for a download. */}
            <Wordmark tone="light" className={dark ? "hidden" : ""} />
            <Wordmark tone="dark" className={dark ? "" : "hidden"} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 text-[14px] font-medium transition-opacity duration-[var(--duration-hover,180ms)] hover:opacity-100 ${
                    active ? "opacity-100" : "opacity-75"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-[var(--duration-ui,320ms)] ${ease} ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 xl:flex">
            <ConsultingLink label="Consulting" srLabel=" at Instrumental" className="text-[14px] font-medium opacity-75 hover:opacity-100" />
            <InquiryButton tone={tone} className="!min-h-11 !px-5 !text-[14px]">
              Start a Conversation
            </InquiryButton>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            {/* From tablet width the primary CTA stays in the bar beside the menu button. */}
            <span className="hidden md:block" onClickCapture={() => open && closeMenu(false)}>
              <InquiryButton tone={tone} className="!min-h-11 !px-5 !text-[14px]">
                Start a Conversation
              </InquiryButton>
            </span>
            <button
              ref={toggleRef}
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => (open ? closeMenu(false) : setOpen(true))}
              className={`relative inline-flex size-11 flex-col items-center justify-center gap-[6px] rounded-full border border-current/25 transition-[border-color,transform] duration-[var(--duration-hover,180ms)] hover:border-current/60 active:scale-95 motion-reduce:active:scale-100 ${
                dark ? "focus-visible:outline-white" : "focus-visible:outline-ink"
              }`}
            >
              <span aria-hidden className={`h-[1.5px] w-5 bg-current transition-transform duration-[var(--duration-ui,320ms)] ${ease} ${open ? "translate-y-[3.75px] rotate-45" : ""}`} />
              <span aria-hidden className={`h-[1.5px] w-5 bg-current transition-transform duration-[var(--duration-ui,320ms)] ${ease} ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Always in the page (hidden and inert while closed) so it can fade with CSS alone. */}
      <div
        ref={menuRef}
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-paper px-5 pt-[calc(76px+1rem)] pb-[max(2rem,env(safe-area-inset-bottom))] transition-[opacity,visibility] duration-[var(--duration-ui,320ms)] md:px-10 md:pt-[calc(76px+2.5rem)] xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Menu">
          <ul>
            {menu.map((item, i) => {
              const current = pathname === item.href;
              return (
                <li
                  key={item.href}
                  className={`border-b border-line transition-[opacity,translate] duration-[350ms] ${ease} ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                  style={{ transitionDelay: open ? `${40 + i * 30}ms` : "0ms" }}
                >
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => closeMenu(true)}
                    className="group flex items-baseline gap-4 py-3.5 focus-visible:outline-offset-0 md:gap-6 md:py-4"
                  >
                    <span aria-hidden className="label w-6 shrink-0 text-stone tabular-nums group-aria-[current=page]:text-ink">
                      {item.index}
                    </span>
                    <span
                      className={`display text-[clamp(2.15rem,5.4vw,3.5rem)] transition-transform duration-[var(--duration-ui,320ms)] ${ease} group-hover:translate-x-1.5 group-aria-[current=page]:italic`}
                    >
                      {typeset(item.label)}
                      {current && (
                        <span aria-hidden className="ml-[0.22em] inline-block size-[0.2em] -translate-y-[0.06em] rounded-full bg-blush-deep align-middle" />
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div
          className={`mt-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-5 pt-12 transition-opacity duration-[350ms] ${open ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: open ? `${40 + menu.length * 30}ms` : "0ms" }}
        >
          <ConsultingLink label="Consulting at Instrumental" className="text-[16px] font-medium" />
          {/* Below tablet width the CTA lives here instead of the bar. */}
          <span className="md:hidden" onClickCapture={() => closeMenu(false)}>
            <InquiryButton>Start a Conversation</InquiryButton>
          </span>
        </div>
      </div>
    </>
  );
}

/** Instrumental, the companion consulting site. While its URL is pending (review mode) nothing navigates. */
function ConsultingLink({ label, srLabel = "", className = "" }: { label: string; srLabel?: string; className?: string }) {
  const link = instrumentalLink();
  const cls = `group inline-flex min-h-11 items-center gap-1.5 transition-opacity duration-[var(--duration-hover,180ms)] ${className}`;
  const icon = (
    <ArrowUpRight
      className="size-4 transition-transform duration-[var(--duration-hover,180ms)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      aria-hidden
    />
  );
  if (link.pending) {
    return (
      <span role="link" aria-disabled="true" tabIndex={0} title="Instrumental website link to come" className={`${cls} cursor-not-allowed`}>
        {label}
        {srLabel && <span className="sr-only">{srLabel}</span>}
        {icon}
        <PendingTag className="!ml-1" />
      </span>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label}
      <span className="sr-only">{srLabel} (opens in a new tab)</span>
      {icon}
    </a>
  );
}
