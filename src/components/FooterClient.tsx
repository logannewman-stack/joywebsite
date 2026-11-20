"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

const noop = () => () => {};

/** Current year, read on the client so the static page never goes stale. */
export function Year() {
  const year = useSyncExternalStore(
    noop,
    () => String(new Date().getFullYear()),
    () => "2026",
  );
  return <>{year}</>;
}

/** Newsletter signup. Connect to your email platform (Beehiiv, ConvertKit, etc.) in onSubmit. */
export function Newsletter() {
  const [done, setDone] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };
  if (done) {
    return (
      <p className="mt-5 flex items-center gap-2 text-[15px] font-semibold text-violet-soft">
        <Check className="size-4" /> You&apos;re on the list. See you Friday.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className="mt-5 flex items-center rounded-full border border-white/15 bg-white/[0.04] p-1 pl-4 focus-within:border-violet-hi">
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <input
        id="nl-email"
        type="email"
        required
        placeholder="Your email"
        className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/40"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-violet text-white transition-colors hover:bg-violet-hi"
      >
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      href="#top"
      aria-label="Back to top"
      className={`fixed right-5 bottom-5 z-40 inline-flex size-12 items-center justify-center rounded-full border border-violet-hi/60 bg-ink/80 text-white shadow-[0_0_30px_-6px_rgba(155,109,255,0.8)] backdrop-blur-lg transition-all duration-500 hover:bg-violet md:right-8 md:bottom-8 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowRight className="size-4 -rotate-90" />
    </a>
  );
}
