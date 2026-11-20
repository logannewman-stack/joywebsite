"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { site } from "@/content/site";
import { ButtonPrimary, Logo } from "./ui";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // hide when scrolling down past the hero, reveal when scrolling up
      if (y > 500 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y <= 500) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden && !open ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
        } ${scrolled || open ? "bg-ink/80 backdrop-blur-xl" : "bg-gradient-to-b from-black/70 to-transparent"}`}
      >
        <nav className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 md:px-10" aria-label="Main">
          <a href="#top" aria-label={`${site.name.first} home`} onClick={() => setOpen(false)}>
            <Logo />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => (
              <a
                key={item.href + item.label}
                href={item.href}
                className="relative px-3.5 py-2 text-[13px] font-bold tracking-[0.06em] text-white/85 uppercase transition-colors after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-violet-hi after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100"
              >
                {item.label}
              </a>
            ))}
            <ButtonPrimary href={site.cta.href} className="ml-4 !py-1.5 !text-[14px]">
              {site.cta.label}
            </ButtonPrimary>
          </div>

          <button
            type="button"
            className="relative z-10 flex size-11 flex-col items-center justify-center gap-[6px] rounded-full border border-white/15 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`h-[1.5px] w-5 bg-white transition-transform duration-300 ${open ? "translate-y-[3.75px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-white transition-transform duration-300 ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`} />
          </button>
        </nav>

        {/* scroll progress */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-violet via-violet-hi to-violet-soft"
          style={{ scaleX: progress }}
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-ink/95 px-6 pt-28 pb-10 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glow top-10 -right-24 size-80" />
            <ul className="flex flex-col">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href + item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/10"
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-4 font-display text-4xl font-semibold text-white"
                  >
                    <span className="eyebrow text-mute">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto">
              <ButtonPrimary href={site.cta.href} onClick={() => setOpen(false)}>
                {site.cta.label}
              </ButtonPrimary>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
