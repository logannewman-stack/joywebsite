"use client";

import type { FormEvent, InputHTMLAttributes, Ref } from "react";
import { CircleAlert } from "lucide-react";
import type { InquiryType } from "@/content/integrations";
import { site } from "@/content/site";

/*
 * Sending, and what a visitor sees when sending fails. Kept free of the
 * inquiry content so the footer newsletter can use it without loading the
 * full inquiry form.
 */

export type Status = "idle" | "sending" | "ok" | "not_configured" | "error" | "invalid_email" | "phone_required";

/** The same email rule the server applies (a domain ending is required), with a plain message. */
export const EMAIL_MESSAGE = "Enter an email address like name@example.com.";
export const emailInputProps: InputHTMLAttributes<HTMLInputElement> = {
  pattern: "[^\\s@]+@[^\\s@]+\\.[^\\s@]+",
  onInvalid: (e: FormEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (el.validity.typeMismatch || el.validity.patternMismatch) el.setCustomValidity(EMAIL_MESSAGE);
  },
  onInput: (e: FormEvent<HTMLInputElement>) => e.currentTarget.setCustomValidity(""),
};
export const PHONE_MESSAGE = "Add a mobile number to receive text messages.";

/** When the server rejects a field, show it on that field, like the browser's own checks. */
export function flagField(form: HTMLFormElement, name: string, message: string) {
  const el = form.elements.namedItem(name);
  if (el instanceof HTMLInputElement) {
    el.setCustomValidity(message);
    form.reportValidity();
  }
}

/** Collects a form into a plain object; repeated names become arrays. */
export function collect(form: HTMLFormElement) {
  const out: Record<string, string | string[]> = {};
  new FormData(form).forEach((v, k) => {
    if (typeof v !== "string") return;
    const cur = out[k];
    out[k] = cur === undefined ? v : Array.isArray(cur) ? [...cur, v] : [cur, v];
  });
  return out;
}

export async function sendInquiry(type: InquiryType, form: HTMLFormElement): Promise<Status> {
  try {
    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, fields: collect(form), page: window.location.pathname }),
    });
    if (res.ok) return "ok";
    if (res.status === 503) return "not_configured";
    if (res.status === 422) {
      const { error } = (await res.json().catch(() => ({}))) as { error?: string };
      if (error === "invalid_email" || error === "phone_required") return error;
    }
    return "error";
  } catch {
    return "error";
  }
}

/**
 * A mailto link to the public address with everything the visitor typed, so
 * a form that cannot send is never a dead end. Fields are labelled with the
 * `data-label` of their wrapper (see fields.tsx).
 */
export function mailtoFrom(form: HTMLFormElement, subject: string) {
  const lines: string[] = [];
  const data = new FormData(form);
  for (const name of new Set(data.keys())) {
    if (name === "company_website") continue;
    const values = data
      .getAll(name)
      .filter((v): v is string => typeof v === "string" && v.trim() !== "")
      .map((v) => (v === "on" ? "Yes" : v.trim()));
    if (!values.length) continue;
    const label = form.querySelector<HTMLElement>(`[data-field="${name}"]`)?.dataset.label ?? name.replace(/_/g, " ");
    lines.push(`${label}: ${values.join(", ")}`);
  }
  const body = lines.join("\n").slice(0, 1600);
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * The bordered message shown when a form could not send. It always offers
 * the public email address (prefilled with what was typed). Focus it after
 * it appears so it is read out and scrolled into view.
 */
export function FormAlert({
  status,
  mailto,
  tone = "light",
  ref,
}: {
  status: Status;
  mailto?: string;
  tone?: "light" | "dark";
  ref?: Ref<HTMLDivElement>;
}) {
  if (status !== "error" && status !== "not_configured") return null;
  const dark = tone === "dark";
  const href = mailto || `mailto:${site.email}`;
  const title =
    status === "error"
      ? "Your message wasn’t sent."
      : site.showPlaceholders
        ? "Forms aren’t connected to GoHighLevel yet (review mode)."
        : "This form can’t send right now.";
  const lead = status === "error" ? "Something went wrong. Please try again, or email" : "Nothing was sent. Please email";
  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className={`flex gap-3 rounded-[2px] border p-4 text-[0.9375rem] leading-relaxed md:p-5 ${
        dark
          ? "border-white/25 bg-white/[0.06] text-white focus-visible:outline-white"
          : "border-ink/15 bg-paper text-ink focus-visible:outline-ink"
      } focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      <CircleAlert className="mt-[3px] size-[1.125rem] shrink-0" aria-hidden />
      <div>
        <p className="font-medium">{title}</p>
        <p className={`mt-1 ${dark ? "text-white/80" : "text-ink/80"}`}>
          {lead}{" "}
          <a href={href} className="font-medium text-current underline decoration-1 underline-offset-[3px] hover:decoration-2">
            {site.email}
          </a>
          {status === "error" ? "." : " instead."}
        </p>
      </div>
    </div>
  );
}

/** Kept for existing imports: the same message as FormAlert. */
export function StatusMessage({ status, tone = "light" }: { status: Status; tone?: "light" | "dark" }) {
  return <FormAlert status={status} tone={tone} />;
}

/** Hidden field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[624.9375rem] h-0 w-0 overflow-hidden">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
