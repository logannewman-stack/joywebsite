"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { links, nav, site } from "@/content/site";
import { Wordmark } from "../ui/Brand";
import { InquiryButton } from "../inquiry/InquiryProvider";

/** Pages whose opening screen is black, so the header starts in white-on-black. */
function startsDark(pathname: string) {
  return pathname === "/" && site.homeHero === "b";
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setPastHero(y > window.innerHeight * 0.8);
      if (y > 400 && y > last + 6) setHidden(true);
      else if (y < last - 6 || y <= 400) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const dark = startsDark(pathname) && !pastHero && !open;
  const surface = open
    ? "bg-paper"
    : dark
      ? scrolled
        ? "bg-ink/85 backdrop-blur-md"
        : "bg-transparent"
      : scrolled
        ? "bg-paper/90 backdrop-blur-md shadow-[0_1px_0_rgba(11,11,11,0.08)]"
        : "bg-paper";

  return (
    <>
      <a
        href="#main"
        className="label fixed top-3 left-3 z-[80] -translate-y-20 bg-ink px-4 py-3 text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${surface} ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${dark ? "text-white" : "text-ink"}`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10">
          <Link href="/" aria-label={`${site.name}, home`} onClick={() => setOpen(false)} className="shrink-0">
            <Wordmark tone={dark ? "dark" : "light"} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-[14px] font-medium transition-opacity hover:opacity-100 ${active ? "opacity-100" : "opacity-75"}`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ${active ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            <a
              href={links.instrumental || "#"}
              {...(links.instrumental ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center gap-1 text-[14px] font-medium opacity-75 transition-opacity hover:opacity-100"
            >
              Consulting <ArrowUpRight className="size-3.5" aria-hidden />
              <span className="sr-only"> at Instrumental</span>
            </a>
            <InquiryButton tone={dark ? "dark" : "light"} className="!min-h-11 !px-5 !text-[14px]">
              Start a Conversation
            </InquiryButton>
          </div>

          <button
            type="button"
            className="relative inline-flex size-11 flex-col items-center justify-center gap-[6px] rounded-full border border-current/25 xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? "translate-y-[3.75px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper px-5 pt-24 pb-8 md:px-10 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Mobile">
              <ul>
                {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
                  <motion.li
                    key={item.href}
                    className="border-b border-line"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="flex items-baseline gap-4 py-4"
                    >
                      <span className="label w-6 text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display text-[34px]">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto flex flex-col items-start gap-4 pt-10">
              <a
                href={links.instrumental || "#"}
                {...(links.instrumental ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex min-h-11 items-center gap-1.5 text-[16px] font-medium"
              >
                Consulting at Instrumental <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <span onClick={() => setOpen(false)}>
                <InquiryButton>Start a Conversation</InquiryButton>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
