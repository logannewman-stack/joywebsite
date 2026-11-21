"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ArrowRight, X } from "lucide-react";
import type { InquiryType } from "@/content/integrations";
import { site } from "@/content/site";
import { focusFirst, inertOutside, lockScroll, prefersReducedMotion, trapTab } from "./modal";

/*
 * The inquiry slide-over. This file is on every page, so it stays small: the
 * context, InquiryButton and the dimmed backdrop. The panel itself (topic
 * picker, forms, content) is a separate chunk, fetched when a visitor shows
 * intent (hover, focus or touch on an InquiryButton) or opens it.
 */

export type Choice = InquiryType | "consulting";

export type OpenOptions = {
  /** Limit the topic picker to these topics, e.g. only the two manufacturer categories. */
  choices?: Choice[];
  /** Starting values for the form, by field name, e.g. { event_name: "Spring Meeting" }. */
  preset?: Record<string, string>;
  /** Speaking form: the program to preselect in "Program of interest" (a title from programTitles). */
  program?: string;
  /** A page's own approved line to show as the panel intro for the view it opens on. */
  intro?: string;
  /** Where focus returns on close. Defaults to the element that opened the panel. */
  returnFocus?: HTMLElement | null;
};

/** What the panel was opened with. `type: null` shows the topic picker. */
export type PanelRequest = {
  id: number;
  type: Choice | null;
  choices: Choice[] | null;
  preset: Record<string, string>;
  intro: string | null;
};
export type PanelProps = { request: PanelRequest; closing: boolean; close: () => void };

type Ctx = { open: (type?: Choice, opts?: OpenOptions) => void; preload: () => void };

const InquiryCtx = createContext<Ctx>({ open: () => {}, preload: () => {} });
export const useInquiry = () => useContext(InquiryCtx);

const loadPanel = () => import("./InquiryPanel").then((m) => m.default as ComponentType<PanelProps>);
let panelPromise: Promise<ComponentType<PanelProps>> | null = null;
function getPanel() {
  panelPromise ??= loadPanel().catch((err) => {
    panelPromise = null; // allow a retry on the next open
    throw err;
  });
  return panelPromise;
}
const preload = () => void getPanel().catch(() => {});

/** Matches the sheet's exit transition in InquiryPanel. */
const EXIT_MS = 320;

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<PanelRequest | null>(null);
  const [closing, setClosing] = useState(false);
  const [Panel, setPanel] = useState<ComponentType<PanelProps> | null>(null);
  const [failed, setFailed] = useState(false);
  const returnTo = useRef<HTMLElement | null>(null);
  const seq = useRef(0);

  const open = useCallback((type?: Choice, opts?: OpenOptions) => {
    returnTo.current = opts?.returnFocus ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    seq.current += 1;
    setRequest({
      id: seq.current,
      type: !type || type === "general" ? null : type,
      choices: opts?.choices?.length ? opts.choices : null,
      preset: { ...opts?.preset, ...(opts?.program ? { program: opts.program } : {}) },
      intro: opts?.intro || null,
    });
    setClosing(false);
    setFailed(false);
    getPanel().then(
      (C) => setPanel(() => C),
      () => setFailed(true),
    );
  }, []);

  const close = useCallback(() => setClosing(true), []);

  // While open: the page behind stays put, and Escape closes from anywhere.
  useEffect(() => {
    if (!request || closing) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.isComposing) return;
      e.preventDefault();
      close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      unlock();
      document.removeEventListener("keydown", onKey);
    };
  }, [request, closing, close]);

  // Closing: focus goes back where it came from (the panel has already released
  // the inert background in its own cleanup), then the panel unmounts after its exit.
  useEffect(() => {
    if (!closing) return;
    focusFirst(
      returnTo.current,
      document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]'),
      document.getElementById("main"),
    );
    const t = window.setTimeout(() => {
      setRequest(null);
      setClosing(false);
    }, prefersReducedMotion() ? 0 : EXIT_MS);
    return () => window.clearTimeout(t);
  }, [closing]);

  const value = useMemo(() => ({ open, preload }), [open]);

  return (
    <InquiryCtx.Provider value={value}>
      {children}
      {request && (
        <div className="fixed inset-0 z-[70]" data-inquiry-root>
          <div
            aria-hidden
            onClick={close}
            className={`absolute inset-0 bg-ink/55 backdrop-blur-[2px] transition-opacity duration-[var(--duration-ui,320ms)] starting:opacity-0 motion-reduce:transition-none ${
              closing ? "opacity-0" : "opacity-100"
            }`}
          />
          {Panel ? (
            <Panel key={request.id} request={request} closing={closing} close={close} />
          ) : failed ? (
            <PanelUnavailable close={close} />
          ) : null}
        </div>
      )}
    </InquiryCtx.Provider>
  );
}

/** Shown only if the panel's code could not be fetched (offline, or a stale page after a release). */
function PanelUnavailable({ close }: { close: () => void }) {
  const sheet = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const restore = inertOutside([sheet.current?.parentElement]);
    const onKey = (e: KeyboardEvent) => trapTab(e, [sheet.current]);
    document.addEventListener("keydown", onKey);
    heading.current?.focus();
    return () => {
      restore();
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <div
      ref={sheet}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-unavailable"
      className="absolute inset-y-0 right-0 flex w-full max-w-[600px] flex-col bg-paper px-6 py-8 md:px-10"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="ml-auto inline-flex size-11 items-center justify-center rounded-full border border-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <X className="size-5" aria-hidden />
      </button>
      <h2 ref={heading} id="inquiry-unavailable" tabIndex={-1} className="display mt-10 text-[clamp(2.4rem,6vw,3.4rem)] outline-none">
        Start a Conversation
      </h2>
      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-stone">
        This form didn’t load. Please email{" "}
        <a href={`mailto:${site.email}`} className="font-medium text-ink underline underline-offset-[3px]">
          {site.email}
        </a>
        .
      </p>
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
  preset,
  program,
  intro,
  arrow = true,
}: {
  type?: Choice;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  tone?: "light" | "dark";
  className?: string;
  /** Limit the general picker to these topics (only when `type` is omitted). */
  choices?: Choice[];
  /** Starting values for the form, by field name. */
  preset?: Record<string, string>;
  /**
   * Opens the speaking form with this program preselected, e.g.
   * <InquiryButton program="GLP-1s in Your Chair">…</InquiryButton>. Implies type "speaking".
   */
  program?: string;
  /** The page's own approved line for the panel intro, e.g. the section text beside the button. */
  intro?: string;
  /** Set false for a plain text link without the arrow. */
  arrow?: boolean;
}) {
  const { open, preload } = useInquiry();
  const dark = tone === "dark";
  const ring = `focus-visible:outline-2 focus-visible:outline-offset-[3px] ${dark ? "focus-visible:outline-white" : "focus-visible:outline-ink"}`;
  const styles = {
    solid: `min-h-12 max-w-full gap-3 whitespace-nowrap rounded-full px-6 motion-safe:active:scale-[0.98] max-[359px]:whitespace-normal ${
      dark ? "bg-white text-ink hover:bg-ivory" : "bg-ink text-white hover:bg-charcoal"
    }`,
    outline: `min-h-12 max-w-full gap-3 whitespace-nowrap rounded-full border px-6 motion-safe:active:scale-[0.98] max-[359px]:whitespace-normal ${
      dark ? "border-white/40 text-white hover:border-white hover:bg-white/10" : "border-ink/30 text-ink hover:border-ink hover:bg-ink/[0.04]"
    }`,
    text: "min-h-11 gap-2",
  }[variant];
  const onClick = (e: MouseEvent<HTMLButtonElement>) =>
    open(type ?? (program ? "speaking" : undefined), { choices, preset, program, intro, returnFocus: e.currentTarget });
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={preload}
      onFocus={preload}
      aria-haspopup="dialog"
      className={`group inline-flex items-center text-left text-[15px] font-medium transition-[background-color,border-color,color,transform] duration-[var(--duration-hover,180ms)] ${ring} ${styles} ${className}`}
    >
      <span className={variant === "text" ? "link-draw pb-0.5" : ""}>{children}</span>
      {arrow && (
        <ArrowRight className="size-4 shrink-0 transition-transform duration-[var(--duration-hover,180ms)] group-hover:translate-x-1" aria-hidden />
      )}
    </button>
  );
}
