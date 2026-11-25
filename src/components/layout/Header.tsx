"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { nav, site } from "@/content/site";
import { Wordmark } from "../ui/Brand";
import { instrumentalLink, PendingTag, SwapArrow } from "../ui/Links";
import { typeset } from "../ui/Typeset";
import { InquiryButton } from "../inquiry/InquiryProvider";
import { inertOutside, lockScroll, trapTab } from "../inquiry/modal";

/** Height of the header bar; the dark-section observer watches this band. */
const BAR = 76;

/** Browser chrome (the phone's status and address bar) follows the header: ink over black sections, white over light. */
const THEME = { dark: "#0b0b0b", light: "#ffffff" };

type Vars = CSSProperties & Record<`--${string}`, string | number>;

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
  // Home opens on the black stage.
  return pathname === "/";
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

  // Dark variant while any [data-header="dark"] element is behind the bar, unless a
  // [data-header="light"] element is too (a light band inside a dark section). The
  // band is re-measured on resize, and the targets re-read if the page adds content.
  useEffect(() => {
    const behind = new Set<Element>();
    let io: IntersectionObserver | null = null;
    let frame = 0;
    const watch = () => {
      io?.disconnect();
      behind.clear();
      const targets = document.querySelectorAll('[data-header="dark"], [data-header="light"]');
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) behind.add(e.target);
            else behind.delete(e.target);
          }
          let darkBehind = false;
          let lightBehind = false;
          behind.forEach((el) => {
            if (el.getAttribute("data-header") === "light") lightBehind = true;
            else darkBehind = true;
          });
          setOverDark(darkBehind && !lightBehind);
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - (headerRef.current?.offsetHeight ?? BAR))}px 0px` },
      );
      targets.forEach((t) => io?.observe(t));
      if (!targets.length) frame = requestAnimationFrame(() => setOverDark(false));
    };
    watch();
    let timer = 0;
    const rewatch = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(watch, 150);
    };
    window.addEventListener("resize", rewatch);
    const main = document.getElementById("main");
    const added = new MutationObserver(rewatch);
    if (main) added.observe(main, { childList: true, subtree: true });
    return () => {
      io?.disconnect();
      added.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("resize", rewatch);
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
        ? "bg-ink/85 backdrop-blur-md shadow-[0_0.75rem_1.75rem_-1.25rem_rgba(0,0,0,0.6)]"
        : "bg-transparent"
      : scrolled
        ? "bg-paper/90 backdrop-blur-md shadow-[0_0.75rem_1.75rem_-1.25rem_rgba(11,11,11,0.22)]"
        : "bg-paper";
  const tone = dark ? "dark" : "light";
  // On paper the bar sits once at the top of the first page, so it takes the tone that page opens with,
  // not the tone of wherever the visitor had scrolled to.
  const printDark = opensDark(pathname);

  // The browser's own chrome takes the header's colour. The tag is created by the chrome head
  // script; the opening curtain (html.intro) holds it black and hands back when it lifts.
  // The page canvas follows too (html[data-tone]): it shows in a classic scrollbar's gutter
  // and when the page is pulled past its edge, so black sections have no white strip.
  useEffect(() => {
    document.documentElement.dataset.tone = tone;
    if (document.documentElement.classList.contains("intro")) return;
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", THEME[tone]));
  }, [tone, pathname]);

  return (
    <>
      <a
        href="#main"
        className="label fixed top-3 left-3 z-[80] -translate-y-20 bg-ink px-4 py-3 text-white transition-transform focus:translate-y-0 focus-visible:outline-white print:hidden"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        data-tone={tone}
        onFocusCapture={() => setHidden(false)}
        // Print: a fixed bar would repeat on every sheet, over the words. It is placed once, at the top of the first.
        className={`site-header fixed inset-x-0 top-0 z-50 mr-[var(--scroll-lock-gap,0px)] transition-[translate,background-color,box-shadow,color] duration-[var(--duration-ui,320ms)] print:absolute print:translate-y-0 print:shadow-none ${ease} ${surface} ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${dark ? "text-white" : "text-ink"} ${printDark ? "print:bg-transparent print:text-white" : "print:bg-paper print:text-ink"}`}
      >
        <div className="mx-auto flex h-[4.75rem] max-w-(--wrap) items-center justify-between gap-6 px-5 md:px-10">
          <Link
            href="/"
            aria-label={`${site.name}, home`}
            onClick={() => open && closeMenu(false)}
            className="shrink-0 rounded-sm focus-visible:outline-offset-4"
          >
            {/* Both artworks are in the page so switching tone never waits for a download. */}
            <Wordmark tone="light" className={`${dark ? "hidden" : ""} ${printDark ? "print:hidden" : "print:block"}`} />
            <Wordmark tone="dark" className={`${dark ? "" : "hidden"} ${printDark ? "print:block" : "print:hidden"}`} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 text-[0.875rem] font-medium whitespace-nowrap transition-opacity duration-[var(--duration-hover,180ms)] hover:opacity-100 ${
                    active ? "opacity-100" : "opacity-75"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    // Windows contrast themes repaint backgrounds: the line is given the theme's link colour there.
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-[var(--duration-ui,320ms)] forced-colors:bg-[LinkText] ${ease} ${
                      active ? "scale-x-100 bg-current" : "scale-x-0 bg-current group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 xl:flex">
            <ConsultingLink
              label="Consulting"
              srLabel=" at Instrumental"
              className="text-[0.875rem] font-medium whitespace-nowrap opacity-75 hover:opacity-100"
              tagClassName="hidden min-[1366px]:inline"
            />
            <InquiryButton tone={tone} className="!min-h-11 !px-5 !text-[0.875rem]">
              Start a Conversation
            </InquiryButton>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            {/* From tablet width the primary CTA stays in the bar beside the menu button. */}
            <span className="hidden md:block" onClickCapture={() => open && closeMenu(false)}>
              <InquiryButton tone={tone} className="!min-h-11 !px-5 !text-[0.875rem]">
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
              className={`press relative inline-flex size-11 flex-col items-center justify-center gap-[0.375rem] rounded-full border border-current/25 hover:border-current/60 ${
                dark ? "focus-visible:outline-white" : "focus-visible:outline-ink"
              }`}
            >
              {/* The two bars are backgrounds, which Windows contrast themes repaint: there they take the theme's button text colour. */}
              <span aria-hidden className={`h-[1.5px] w-5 bg-current transition-transform duration-[var(--duration-ui,320ms)] forced-colors:bg-[ButtonText] ${ease} ${open ? "translate-y-[3.75px] rotate-45" : ""}`} />
              <span aria-hidden className={`h-[1.5px] w-5 bg-current transition-transform duration-[var(--duration-ui,320ms)] forced-colors:bg-[ButtonText] ${ease} ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/*
        Scroll progress: a hairline under the bar that fills with the page (--page-p, written by
        the scroll engine). It rides at the top edge while the bar is away, and is off under the open menu.
      */}
      <div
        aria-hidden
        className={`page-progress mr-[var(--scroll-lock-gap,0px)] ${hidden && !open ? "translate-y-0" : "translate-y-[4.75rem]"} ${
          open ? "opacity-0" : "opacity-100"
        } ${dark ? "text-white" : "text-ink"}`}
      >
        <span className="progress-page" />
      </div>

      {/*
        Always in the page (hidden and inert while closed) so it can open with CSS alone: the sheet
        drops from under the bar, the links rise one after another and their hairlines draw
        (styles/chrome.css). With reduced motion it simply appears.
        scroll-pt: when the list scrolls, keyboard focus stops below the bar instead of under it.
        Short phones (up to 660px tall) get a tighter list, so "Start a Conversation" stays on screen.
      */}
      <div
        ref={menuRef}
        id="mobile-menu"
        inert={!open}
        data-open={open}
        className="menu-sheet thin-scroll fixed inset-0 z-40 flex scroll-pt-[calc(4.75rem+1rem)] flex-col overflow-y-auto overscroll-contain bg-paper px-5 pt-[calc(4.75rem+1rem)] pb-[max(2rem,env(safe-area-inset-bottom))] max-md:[@media(max-height:660px)]:pt-[calc(4.75rem+0.5rem)] max-md:[@media(max-height:660px)]:pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-10 md:pt-[calc(4.75rem+2.5rem)] [@media(max-height:500px)]:pt-[calc(4.75rem+0.25rem)]! xl:hidden print:hidden"
      >
        <nav aria-label="Menu" className="flex flex-1 flex-col">
          <ul>
            {menu.map((item, i) => {
              const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href} className="menu-item" style={{ "--i": i } as Vars}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    // Going to another page: the sheet stays until the new page is in place (the path effect closes it),
                    // so the page being left never flashes. The current page's link simply closes the menu.
                    onClick={() => current && closeMenu(true)}
                    className="group flex items-baseline gap-4 py-3.5 focus-visible:outline-offset-0 max-md:[@media(max-height:660px)]:py-2 md:gap-6 md:py-4 md:[@media(min-height:900px)]:py-6 [@media(max-height:500px)]:py-1.5!"
                  >
                    <span aria-hidden className="menu-fade label w-6 shrink-0 text-stone tabular-nums group-aria-[current=page]:text-ink">
                      {item.index}
                    </span>
                    <span
                      className={`display text-[clamp(1.375rem,5.6vw,2.25rem)] max-md:[@media(max-height:660px)]:text-[1.25rem] [@media(max-height:500px)]:text-[1.125rem]! transition-transform duration-[var(--duration-ui,320ms)] ${ease} group-hover:translate-x-1.5`}
                    >
                      {/* The label rises from behind its own baseline (the .wr frame clips only the bottom edge). */}
                      <span className="wr">
                        {/* The current page has the pale pink marker behind it. */}
                        <span className="menu-rise inline-block">
                          <span className={current ? "hl-light" : undefined}>{typeset(item.label)}</span>
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div
            className="menu-fade mt-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-5 pt-12 max-md:[@media(max-height:660px)]:pt-5 [@media(max-height:500px)]:pt-4!"
            style={{ "--i": menu.length } as Vars}
          >
            {/* Below tablet width the CTA lives here instead of the bar, first, so it is the action short screens still show. */}
            <span className="md:hidden" onClickCapture={() => closeMenu(false)}>
              <InquiryButton>Start a Conversation</InquiryButton>
            </span>
            <ConsultingLink label="Consulting at Instrumental" className="text-[1rem] font-medium" />
          </div>
        </nav>
      </div>
    </>
  );
}

/** Instrumental, the companion consulting site. While its URL is pending (review mode) nothing navigates. */
function ConsultingLink({
  label,
  srLabel = "",
  className = "",
  tagClassName = "",
}: {
  label: string;
  srLabel?: string;
  className?: string;
  /** The review-mode tag does not fit the bar below 1366px. */
  tagClassName?: string;
}) {
  const link = instrumentalLink();
  const cls = `group inline-flex min-h-11 items-center gap-1.5 transition-opacity duration-[var(--duration-hover,180ms)] ${className}`;
  const icon = <SwapArrow direction="up-right" />;
  if (link.pending) {
    return (
      <span role="link" aria-disabled="true" tabIndex={0} title="Instrumental website link to come" className={`${cls} cursor-not-allowed`}>
        {label}
        {srLabel && <span className="sr-only">{srLabel}</span>}
        {icon}
        <PendingTag className={`!ml-1 ${tagClassName}`} />
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
