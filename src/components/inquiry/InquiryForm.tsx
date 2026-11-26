"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { inquiryTypes, optIns, programChoices, type InquiryType } from "@/content/integrations";
import { links } from "@/content/site";
import { SwapArrow } from "@/components/ui/Links";
import { CheckGroup, Consent, Field, Select, TextArea } from "./fields";
import { useInlineValidation } from "./validation";
import {
  collect,
  EMAIL_MESSAGE,
  emailInputProps,
  flagField,
  FormAlert,
  Honeypot,
  mailtoFrom,
  PHONE_MESSAGE,
  sendInquiry,
  type Status,
} from "./feedback";

// Existing imports keep working; new code should import these from their own modules.
export { NewsletterForm } from "./NewsletterForm";
export { sendInquiry, StatusMessage } from "./feedback";

type Preset = Record<string, string>;
type Draft = Record<string, string | string[]>;

/**
 * What a visitor has typed, per inquiry type, for the rest of the visit. Closing
 * the panel, a stray click outside it, Escape or "All topics" never throws a
 * half-written inquiry away; a successful send clears it.
 */
const drafts = new Map<InquiryType, Draft>();
const asList = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

const eventFields = (formats: string[], preset: Preset, programs = false) => (
  <>
    <Field label="Organization" name="organization" required autoComplete="organization" defaultValue={preset.organization} />
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Event or program name" name="event_name" defaultValue={preset.event_name} />
      <Field label="Event date(s)" name="event_dates" defaultValue={preset.event_dates} />
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Location" name="event_location" placeholder="City or virtual" defaultValue={preset.event_location} />
      <Field label="Audience size and type" name="audience" placeholder="e.g. 300 hygienists" defaultValue={preset.audience} />
    </div>
    {programs && (
      <Select
        label="Program of interest"
        name="program"
        options={programChoices}
        defaultValue={preset.program}
      />
    )}
    <Select label="Format" name="format" options={formats} defaultValue={preset.format} />
  </>
);

/** The fields each inquiry type asks for. Kept short; everything else goes in the message. */
function TypeFields({ type, preset, draft, programFirst }: { type: InquiryType; preset: Preset; draft: Draft; programFirst: boolean }) {
  switch (type) {
    case "speaking":
      return eventFields(["Keynote", "Clinical course", "Team or organization program", "Not sure yet"], preset, !programFirst);
    case "p3_conference":
      return eventFields(["P3 Interactive", "P3 Mini", "Not sure yet"], preset);
    case "partnership":
      return (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Company" name="company" required autoComplete="organization" defaultValue={preset.company} />
            <Field label="Your role" name="job_title" autoComplete="organization-title" defaultValue={preset.job_title} />
          </div>
          <Field label="Product or category" name="product" defaultValue={preset.product} />
          <CheckGroup
            legend="Interested in"
            name="partnership_interest"
            defaultValues={asList(draft.partnership_interest)}
            options={["Sponsored education", "Speaking engagements", "Hands-on programs", "Professional content", "Clinical advisory"]}
          />
        </>
      );
    case "clinical_launch":
      return (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Company" name="company" required autoComplete="organization" defaultValue={preset.company} />
            <Field label="Your role" name="job_title" autoComplete="organization-title" defaultValue={preset.job_title} />
          </div>
          <Field label="Product" name="product" defaultValue={preset.product} />
          <Select
            label="Where is the product today?"
            name="launch_stage"
            defaultValue={preset.launch_stage}
            options={["Before launch", "Launching soon", "Already in market", "Not sure yet"]}
          />
        </>
      );
    case "general":
      return <Field label="Organization" name="organization" autoComplete="organization" defaultValue={preset.organization} />;
    default:
      return null;
  }
}

/** Neutral, factual note under each form. Wording for Dr. Joy to approve is in the handoff notes. */
function PrivacyNote({ interest }: { interest: boolean }) {
  return (
    <p className="text-[0.84375rem] leading-relaxed text-stone">
      {interest
        ? "Your details add you to the P3 interest list. Sponsor communications and text messages are sent only if you check those boxes."
        : "Your details are used to respond to your inquiry."}
      {links.privacy && (
        <>
          {" "}
          See the{" "}
          <a href={links.privacy} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-[3px] hover:text-ink">
            privacy policy<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </>
      )}
    </p>
  );
}

export function SubmitButton({ sending, children }: { sending: boolean; children: string }) {
  return (
    // aria-disabled instead of disabled: the button keeps focus while sending.
    <button
      type="submit"
      aria-disabled={sending || undefined}
      className="press group inline-flex min-h-12 w-full max-w-full items-center justify-center gap-3 rounded-full bg-ink px-7 text-[0.9375rem] font-medium whitespace-nowrap text-white max-[359px]:whitespace-normal hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink aria-disabled:cursor-progress aria-disabled:bg-charcoal sm:w-auto"
    >
      {sending ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
      {sending ? "Sending" : children}
      {!sending && <SwapArrow />}
    </button>
  );
}

export function InquiryForm({
  type,
  onSent,
  preset = {},
}: {
  type: InquiryType;
  /** Called after a successful send. Without it the form shows its own thank-you. */
  onSent?: () => void;
  /** Starting values by field name, e.g. { program: "GLP-1s in Your Chair" }. */
  preset?: Preset;
}) {
  const [draft] = useState<Draft>(() => drafts.get(type) ?? {});
  const seed: Preset = { ...Object.fromEntries(Object.entries(draft).filter((e): e is [string, string] => typeof e[1] === "string")), ...preset };
  // A program chosen from its own Inquire button leads the form, so the choice is in view.
  const programFirst = type === "speaking" && Boolean(preset.program);
  const [status, setStatus] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0);
  const [mailto, setMailto] = useState("");
  const [sms, setSms] = useState(draft.sms_opt_in === "on");
  const alertRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const formRef = useInlineValidation();
  const meta = inquiryTypes[type];
  const isInterest = type === "p3_interest";

  // A failed send moves focus to the message, so it is read out and in view.
  useEffect(() => {
    if (status === "error" || status === "not_configured") alertRef.current?.focus();
    if (status === "ok") doneRef.current?.focus();
  }, [status, attempt]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    setStatus("sending");
    const result = await sendInquiry(type, form);
    if (result === "invalid_email" || result === "phone_required") {
      setStatus("idle");
      flagField(form, result === "invalid_email" ? "email" : "phone", result === "invalid_email" ? EMAIL_MESSAGE : PHONE_MESSAGE);
      return;
    }
    if (result === "ok") drafts.delete(type);
    if (result === "ok" && onSent) {
      onSent();
      return;
    }
    if (result !== "ok") setMailto(mailtoFrom(form, meta.title));
    setStatus(result);
    setAttempt((n) => n + 1);
  };

  if (status === "ok") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="py-6 outline-none">
        <span className="inline-flex size-12 items-center justify-center rounded-full border border-ink text-ink">
          <Check className="size-5" aria-hidden />
        </span>
        <p className="display t-h1 mt-6">Thank you.</p>
        <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-stone">{successMessage(type)}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onInput={(e) => drafts.set(type, collect(e.currentTarget))}
      onChange={(e) => drafts.set(type, collect(e.currentTarget))}
      className="panel-settle-list relative flex flex-col gap-7"
    >
      <Honeypot />
      {programFirst && <Select label="Program of interest" name="program" options={programChoices} defaultValue={seed.program} />}
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
        <Field label="First name" name="first_name" required autoComplete="given-name" defaultValue={seed.first_name} />
        <Field label="Last name" name="last_name" required autoComplete="family-name" defaultValue={seed.last_name} />
      </div>
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
        <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={seed.email} inputProps={emailInputProps} />
        <Field
          label={isInterest ? "Mobile phone" : "Phone"}
          name="phone"
          type="tel"
          autoComplete="tel"
          required={isInterest && sms}
          hint={isInterest && sms ? "Required for texts" : undefined}
          defaultValue={seed.phone}
          inputProps={{
            // Texting needs a number to text.
            onInvalid: (e) => {
              if (sms && e.currentTarget.validity.valueMissing) e.currentTarget.setCustomValidity(PHONE_MESSAGE);
            },
            onInput: (e) => e.currentTarget.setCustomValidity(""),
          }}
        />
      </div>

      <TypeFields type={type} preset={seed} draft={draft} programFirst={programFirst} />

      {!isInterest && (
        <TextArea
          label={type === "general" ? "What are you working on?" : "Anything else I should know?"}
          name="message"
          required={type === "general"}
          defaultValue={seed.message}
        />
      )}

      {isInterest && (
        <div className="flex flex-col gap-4 pt-6">
          <Consent name="sponsor_opt_in" label="Sponsor communications" defaultChecked={draft.sponsor_opt_in === "on"}>
            {optIns.sponsor}
          </Consent>
          <Consent
            name="sms_opt_in"
            label="Text messages"
            defaultChecked={sms}
            onChange={(e) => {
              setSms(e.currentTarget.checked);
              if (!e.currentTarget.checked) (e.currentTarget.form?.elements.namedItem("phone") as HTMLInputElement | null)?.setCustomValidity("");
            }}
          >
            {optIns.sms}
          </Consent>
        </div>
      )}

      <PrivacyNote interest={isInterest} />

      <FormAlert ref={alertRef} status={status} mailto={mailto} />

      <div>
        <SubmitButton sending={status === "sending"}>{isInterest ? meta.title : "Send"}</SubmitButton>
      </div>
    </form>
  );
}

export function successMessage(type: InquiryType) {
  return type === "p3_interest"
    ? "You’re on the P3 interest list. You’ll hear as soon as event details and registration are announced."
    : "Your message is on its way. You’ll hear back soon.";
}
