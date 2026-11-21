"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { links } from "@/content/site";
import { FormAlert, Honeypot, mailtoFrom, sendInquiry, type Status } from "./feedback";

/** Single-field signup for the From Dr. Joy newsletter. Light enough for the footer of every page. */
export function NewsletterForm({ tone = "light", cta = "Subscribe" }: { tone?: "light" | "dark"; cta?: string }) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0);
  const [mailto, setMailto] = useState("");
  const alertRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const dark = tone === "dark";
  const sending = status === "sending";

  useEffect(() => {
    if (status === "ok") doneRef.current?.focus();
    if (status === "error" || status === "not_configured") alertRef.current?.focus();
  }, [status, attempt]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    setStatus("sending");
    const result = await sendInquiry("newsletter", form);
    if (result !== "ok") setMailto(mailtoFrom(form, "Subscribe to From Dr. Joy"));
    setStatus(result);
    setAttempt((n) => n + 1);
  };

  if (status === "ok") {
    return (
      <p
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className={`flex items-start gap-3 text-[16px] leading-relaxed outline-none ${dark ? "text-white" : "text-ink"}`}
      >
        <span className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full ${dark ? "bg-blush text-ink" : "bg-ink text-white"}`}>
          <Check className="size-3.5" aria-hidden />
        </span>
        You’re subscribed. Watch your inbox for a welcome note.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <Honeypot />
      <label htmlFor={`${id}-email`} className={`block text-[14px] font-medium ${dark ? "text-ash" : "text-stone"}`}>
        Email address
      </label>
      <div
        data-field="email"
        data-label="Email"
        className={`mt-1 flex items-center gap-3 border-b transition-[border-color,box-shadow] duration-[var(--duration-hover,180ms)] ${
          dark
            ? "border-white/40 focus-within:border-white focus-within:shadow-[0_1px_0_0_#fff]"
            : "border-ink/45 focus-within:border-ink focus-within:shadow-[0_1px_0_0_var(--color-ink)]"
        }`}
      >
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          required
          autoComplete="email"
          // w-full keeps the field from widening narrow layouts (a percentage width gives it no minimum).
          className={`w-full min-w-0 flex-1 bg-transparent py-3 text-[17px] outline-none ${dark ? "text-white" : "text-ink"}`}
        />
        <button
          type="submit"
          aria-disabled={sending || undefined}
          className={`group my-1.5 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[14.5px] font-medium whitespace-nowrap transition-[background-color,transform] duration-[var(--duration-hover,180ms)] focus-visible:outline-2 focus-visible:outline-offset-[3px] active:scale-[0.98] aria-disabled:cursor-progress motion-reduce:active:scale-100 ${
            dark
              ? "bg-white text-ink hover:bg-ivory focus-visible:outline-white"
              : "bg-ink text-white hover:bg-charcoal focus-visible:outline-ink"
          }`}
        >
          {sending ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
          {sending ? "Sending" : cta}
          {!sending && <ArrowRight className="size-4 transition-transform duration-[var(--duration-hover,180ms)] group-hover:translate-x-0.5" aria-hidden />}
        </button>
      </div>
      {links.privacy && (
        <p className={`mt-3 text-[13.5px] ${dark ? "text-ash" : "text-stone"}`}>
          <a href={links.privacy} className="underline decoration-1 underline-offset-[3px]">
            Privacy policy
          </a>
        </p>
      )}
      <div className="mt-4 empty:hidden">
        <FormAlert ref={alertRef} status={status} mailto={mailto} tone={tone} />
      </div>
    </form>
  );
}
