"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { inquiryTypes, optIns, type InquiryType } from "@/content/integrations";
import { links, site } from "@/content/site";
import { CheckGroup, Consent, Field, Honeypot, Select, TextArea } from "./fields";

type Status = "idle" | "sending" | "ok" | "not_configured" | "error";

/** Collects a form into a plain object; repeated names become arrays. */
function collect(form: HTMLFormElement) {
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
    return "error";
  } catch {
    return "error";
  }
}

export function StatusMessage({ status, tone = "light" }: { status: Status; tone?: "light" | "dark" }) {
  if (status === "not_configured") {
    return (
      <p role="status" className={`text-[14px] ${tone === "dark" ? "text-blush" : "text-stone"}`}>
        {site.showPlaceholders
          ? "This form isn’t connected yet. Set GHL_WEBHOOK_URL to send submissions to GoHighLevel."
          : "Sorry, this form is temporarily unavailable. Please try again soon."}
      </p>
    );
  }
  if (status === "error") {
    return (
      <p role="alert" className={`text-[14px] ${tone === "dark" ? "text-blush" : "text-ink"}`}>
        Something went wrong sending your message. Please try again.
      </p>
    );
  }
  return null;
}

function SubmitButton({ status, children }: { status: Status; children: string }) {
  return (
    <button
      type="submit"
      disabled={status === "sending"}
      className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-ink px-6 text-[15px] font-medium text-white transition-colors hover:bg-ink-soft disabled:opacity-60 sm:w-auto"
    >
      {status === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {status === "sending" ? "Sending" : children}
      {status !== "sending" && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />}
    </button>
  );
}

const eventFields = (formatOptions: string[]) => (
  <>
    <Field label="Organization" name="organization" required autoComplete="organization" />
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Event or program name" name="event_name" />
      <Field label="Event date(s)" name="event_dates" />
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Location" name="event_location" placeholder="City or virtual" />
      <Field label="Audience size and type" name="audience" placeholder="e.g. 300 hygienists" />
    </div>
    <Select label="Format" name="format" options={formatOptions} />
  </>
);

/** The fields each inquiry type asks for. Kept short; everything else goes in the message. */
function TypeFields({ type }: { type: InquiryType }) {
  switch (type) {
    case "speaking":
      return eventFields(["Keynote", "Clinical course", "Team or organization program", "Not sure yet"]);
    case "p3_conference":
      return eventFields(["P3 Interactive", "P3 Mini", "Not sure yet"]);
    case "partnership":
      return (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Company" name="company" required autoComplete="organization" />
            <Field label="Your role" name="job_title" autoComplete="organization-title" />
          </div>
          <Field label="Product or category" name="product" />
          <CheckGroup
            legend="Interested in"
            name="partnership_interest"
            options={["Sponsored education", "Speaking engagements", "Hands-on programs", "Professional content", "Clinical advisory"]}
          />
        </>
      );
    case "clinical_launch":
      return (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Company" name="company" required autoComplete="organization" />
            <Field label="Your role" name="job_title" autoComplete="organization-title" />
          </div>
          <Field label="Product" name="product" />
          <Select label="Where is the product today?" name="launch_stage" options={["Before launch", "Launching soon", "Already in market", "Not sure yet"]} />
        </>
      );
    case "general":
      return <Field label="Organization" name="organization" autoComplete="organization" />;
    default:
      return null;
  }
}

export function InquiryForm({ type, onSent }: { type: InquiryType; onSent?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const meta = inquiryTypes[type];
  const isInterest = type === "p3_interest";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Texting needs a number to text.
    const sms = form.elements.namedItem("sms_opt_in") as HTMLInputElement | null;
    const phone = form.elements.namedItem("phone") as HTMLInputElement | null;
    if (sms?.checked && phone && !phone.value.trim()) {
      phone.setCustomValidity("Add a mobile number to receive text messages.");
      phone.reportValidity();
      return;
    }
    phone?.setCustomValidity("");
    setStatus("sending");
    const result = await sendInquiry(type, form);
    setStatus(result);
    if (result === "ok") onSent?.();
  };

  if (status === "ok") {
    return (
      <div role="status" className="py-10">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-blush text-ink">
          <Check className="size-5" aria-hidden />
        </span>
        <p className="display mt-6 text-4xl">Thank you.</p>
        <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-stone">
          {isInterest
            ? "You’re on the P3 interest list. You’ll hear as soon as event details and registration are announced."
            : "Your message is on its way. You’ll hear back soon."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      // Any edit clears the "add a mobile number" message so the form can be resubmitted.
      onChange={(e) => (e.currentTarget.elements.namedItem("phone") as HTMLInputElement | null)?.setCustomValidity("")}
      className="relative flex flex-col gap-6"
    >
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="First name" name="first_name" required autoComplete="given-name" />
        <Field label="Last name" name="last_name" required autoComplete="family-name" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label={isInterest ? "Mobile phone" : "Phone"} name="phone" type="tel" autoComplete="tel" />
      </div>

      <TypeFields type={type} />

      {!isInterest && (
        <TextArea
          label={type === "general" ? "What are you working on?" : "Anything else I should know?"}
          name="message"
          required={type === "general"}
        />
      )}

      {isInterest && (
        <div className="flex flex-col gap-3 border-t border-line pt-5">
          <Consent name="sponsor_opt_in">{optIns.sponsor}</Consent>
          <Consent name="sms_opt_in">{optIns.sms}</Consent>
        </div>
      )}

      <p className="text-[12.5px] leading-relaxed text-stone">
        Your details are used only to respond to this {isInterest ? "request" : "inquiry"}.
        {links.privacy && (
          <>
            {" "}
            See the{" "}
            <a href={links.privacy} className="underline underline-offset-2">
              privacy policy
            </a>
            .
          </>
        )}
      </p>

      <StatusMessage status={status} />
      <div>
        <SubmitButton status={status}>{isInterest ? meta.title : "Send"}</SubmitButton>
      </div>
    </form>
  );
}

/** Single-field signup for the From Dr. Joy newsletter. */
export function NewsletterForm({ tone = "light", cta = "Subscribe" }: { tone?: "light" | "dark"; cta?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const dark = tone === "dark";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setStatus(await sendInquiry("newsletter", e.currentTarget));
  };

  if (status === "ok") {
    return (
      <p role="status" className={`flex items-center gap-2 text-[15px] ${dark ? "text-blush" : "text-ink"}`}>
        <Check className="size-4" aria-hidden /> You’re subscribed. Watch your inbox for a welcome note.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <Honeypot />
      <div className={`flex items-end gap-3 border-b ${dark ? "border-white/30 focus-within:border-white" : "border-ink/30 focus-within:border-ink"}`}>
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Email address"
            className={`w-full bg-transparent py-3 text-[16px] outline-none ${dark ? "text-white placeholder:text-white/45" : "text-ink placeholder:text-ink/40"}`}
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className={`group mb-1.5 inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors disabled:opacity-60 ${
            dark ? "bg-white text-ink hover:bg-ivory" : "bg-ink text-white hover:bg-ink-soft"
          }`}
        >
          {status === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : cta}
          {status !== "sending" && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />}
        </button>
      </div>
      <div className="mt-3">
        <StatusMessage status={status} tone={tone} />
      </div>
    </form>
  );
}
