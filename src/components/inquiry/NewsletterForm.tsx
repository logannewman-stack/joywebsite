"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { links } from "@/content/site";
import { SwapArrow } from "@/components/ui/Links";
import { EMAIL_MESSAGE, emailInputProps, flagField, FormAlert, Honeypot, mailtoFrom, sendInquiry, type Status } from "./feedback";

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
    if (result === "invalid_email") {
      setStatus("idle");
      flagField(form, "email", EMAIL_MESSAGE);
      return;
    }
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
        className={`flex items-start gap-3 text-[1rem] leading-relaxed outline-none ${dark ? "text-white" : "text-ink"}`}
      >
        <span className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full ${dark ? "bg-gold text-ink" : "bg-ink text-white"}`}>
          <Check className="size-3.5" aria-hidden />
        </span>
        You’re subscribed. Watch your inbox for a welcome note.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <Honeypot />
      <label htmlFor={`${id}-email`} className={`block text-[0.875rem] font-medium ${dark ? "text-ash" : "text-stone"}`}>
        Email address
      </label>
      <div
        data-field="email"
        data-label="Email"
        // A soft filled pill holding the field and its button (no underline). Focus rings it.
        className={`mt-2 flex items-center gap-3 rounded-full pl-5 pr-1 transition-[background-color,box-shadow] duration-[var(--duration-hover,180ms)] ${
          dark
            ? "bg-white/[0.08] hover:bg-white/[0.11] focus-within:bg-white/[0.11] focus-within:shadow-[inset_0_0_0_1.5px_#fff]"
            : "bg-ink/[0.05] hover:bg-ink/[0.07] focus-within:bg-ink/[0.07] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-ink)]"
        }`}
      >
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          required
          autoComplete="email"
          {...emailInputProps}
          // w-full keeps the field from widening narrow layouts (a percentage width gives it no minimum).
          className={`w-full min-w-0 flex-1 bg-transparent py-3 text-[1.0625rem] outline-none ${dark ? "text-white" : "text-ink"}`}
        />
        <button
          type="submit"
          aria-disabled={sending || undefined}
          className={`press group my-1 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[0.90625rem] font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-[3px] aria-disabled:cursor-progress ${
            dark
              ? "bg-white text-ink hover:bg-gold-soft focus-visible:outline-white"
              : "bg-ink text-white hover:bg-charcoal focus-visible:outline-ink"
          }`}
        >
          {sending ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
          {sending ? "Sending" : cta}
          {!sending && <SwapArrow />}
        </button>
      </div>
      {links.privacy && (
        <p className={`mt-1 text-[0.84375rem] ${dark ? "text-ash" : "text-stone"}`}>
          <a href={links.privacy} className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-[3px]">
            Privacy Policy
          </a>
        </p>
      )}
      <div className="mt-4 empty:hidden">
        <FormAlert ref={alertRef} status={status} mailto={mailto} tone={tone} />
      </div>
    </form>
  );
}
