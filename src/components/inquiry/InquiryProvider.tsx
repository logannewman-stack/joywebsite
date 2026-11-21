"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { consultingChoice, inquiryTypes, interestChoices, type InquiryType } from "@/content/integrations";
import { education } from "@/content/education";
import { links } from "@/content/site";
import { InquiryForm } from "./InquiryForm";

type Choice = InquiryType | "consulting";
/** Optional limits for the general picker, e.g. only the two manufacturer categories. */
type OpenOptions = { choices?: Choice[] };
type Ctx = { open: (type?: Choice, opts?: OpenOptions) => void };

const InquiryCtx = createContext<Ctx>({ open: () => {} });
export const useInquiry = () => useContext(InquiryCtx);

const ease = [0.16, 1, 0.3, 1] as const;

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null); // null = show the picker
  const [fromPicker, setFromPicker] = useState(false);
  const [choices, setChoices] = useState<Choice[] | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const open = useCallback((type?: Choice, opts?: OpenOptions) => {
    returnTo.current = document.activeElement as HTMLElement | null;
    const t = !type || type === "general" ? null : type;
    setChoices(opts?.choices ?? null);
    setChoice(t);
    setFromPicker(t === null);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Esc to close, keep focus inside the panel, lock page scroll.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      root.style.overflow = "";
      returnTo.current?.focus?.();
    };
  }, [isOpen, close]);

  const title =
    choice === null ? inquiryTypes.general.title : choice === "consulting" ? "Consulting" : inquiryTypes[choice].title;
  const intro =
    choice === null ? inquiryTypes.general.intro : choice === "consulting" ? consultingChoice.note : inquiryTypes[choice].intro;

  return (
    <InquiryCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70]">
            <motion.div
              className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              aria-hidden
            />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="inquiry-title"
              className="absolute inset-y-0 right-0 flex w-full max-w-[600px] flex-col bg-paper shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.55, ease }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4 md:px-10">
                {choice !== null && fromPicker ? (
                  <button
                    type="button"
                    onClick={() => setChoice(null)}
                    className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-stone hover:text-ink"
                  >
                    <ArrowLeft className="size-4" aria-hidden /> All topics
                  </button>
                ) : (
                  <span className="label text-stone">Inquiry</span>
                )}
                <button
                  type="button"
                  onClick={close}
                  data-autofocus
                  className="inline-flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
                  aria-label="Close"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pt-10 pb-12 md:px-10">
                <h2 id="inquiry-title" className="display text-[clamp(2.4rem,6vw,3.4rem)]">
                  {title}
                </h2>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-stone">{intro}</p>

                <div className="mt-10">
                  {choice === null && <Picker choices={choices ?? interestChoices} onPick={(c) => setChoice(c)} />}
                  {choice === "consulting" && <ConsultingRoute />}
                  {choice === "p3_interest" && education.events.featured && <FeaturedEventRoute />}
                  {choice !== null && choice !== "consulting" && !(choice === "p3_interest" && education.events.featured) && (
                    <InquiryForm key={choice} type={choice} />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </InquiryCtx.Provider>
  );
}

function Picker({ choices, onPick }: { choices: Choice[]; onPick: (c: Choice) => void }) {
  return (
    <fieldset>
      <legend className="label mb-4 text-stone">What can I help with?</legend>
      <ul className="border-t border-line">
        {choices.map((c, i) => (
          <li key={c} className="border-b border-line">
            <button
              type="button"
              onClick={() => onPick(c)}
              className="group flex min-h-16 w-full items-center gap-5 py-4 text-left transition-colors hover:bg-ivory focus-visible:bg-ivory"
            >
              <span className="label w-6 shrink-0 text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-serif text-[22px] leading-tight">
                {c === "consulting" ? consultingChoice.label : inquiryTypes[c].label}
              </span>
              <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

function ConsultingRoute() {
  return (
    <a
      href={links.instrumental || "#"}
      {...(links.instrumental ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 text-[15px] font-medium text-white hover:bg-ink-soft"
    >
      Visit Instrumental
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      {!links.instrumental && <span className="label ml-1 !text-[8.5px] opacity-70">URL pending</span>}
    </a>
  );
}

function FeaturedEventRoute() {
  const ev = education.events.featured!;
  return (
    <div className="border-t border-line pt-6">
      <p className="font-serif text-3xl">{ev.name}</p>
      <p className="mt-2 text-stone">
        {ev.date} · {ev.location}
      </p>
      <a
        href={ev.registrationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 text-[15px] font-medium text-white hover:bg-ink-soft"
      >
        {education.events.cta}
        <ArrowUpRight className="size-4" aria-hidden />
      </a>
    </div>
  );
}

/** Any button that opens the inquiry panel, preset to a topic. */
export function InquiryButton({
  type,
  children,
  variant = "solid",
  tone = "light",
  className = "",
  choices,
}: {
  type?: Choice;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  tone?: "light" | "dark";
  className?: string;
  /** Limit the general picker to these topics (only when `type` is omitted). */
  choices?: Choice[];
}) {
  const { open } = useInquiry();
  const ring =
    tone === "dark"
      ? "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white"
      : "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink";
  const styles = {
    solid: tone === "dark" ? "whitespace-nowrap rounded-full bg-white px-6 text-ink hover:bg-ivory" : "whitespace-nowrap rounded-full bg-ink px-6 text-white hover:bg-ink-soft",
    outline:
      tone === "dark"
        ? "whitespace-nowrap rounded-full border border-white/40 px-6 text-white hover:border-white"
        : "whitespace-nowrap rounded-full border border-ink/30 px-6 text-ink hover:border-ink",
    text: "",
  }[variant];
  return (
    <button
      type="button"
      onClick={() => open(type, choices ? { choices } : undefined)}
      aria-haspopup="dialog"
      className={`group inline-flex min-h-12 items-center gap-3 text-left text-[15px] font-medium transition-colors duration-300 ${ring} ${styles} ${className}`}
    >
      <span className={variant === "text" ? "link-draw pb-0.5" : ""}>{children}</span>
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </button>
  );
}
