"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { consultingChoice, inquiryTypes, interestChoices, type InquiryType } from "@/content/integrations";
import { currentEvent, education } from "@/content/education";
import { instrumentalLink, PendingTag } from "@/components/ui/Links";
import { InquiryForm, successMessage } from "./InquiryForm";
import { inertOutside, trapTab } from "./modal";
import type { Choice, PanelProps } from "./InquiryProvider";

/*
 * The inquiry slide-over: a modal dialog with the topic picker, the routes
 * that leave the site (Instrumental, a live P3 event page) and the forms.
 * Loaded on demand by InquiryProvider.
 *
 * Focus: on open and after every change of view (topic picked, All topics,
 * sent) the body scrolls to the top and focus goes to the view's heading;
 * going back to the picker focuses the topic just left. Tab stays inside the
 * panel and the page behind is inert. Escape and closing are handled by the
 * provider, which returns focus to the button that opened the panel.
 */

const ring = "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink";
const pill =
  "group inline-flex min-h-12 items-center gap-3 whitespace-nowrap rounded-full px-6 text-[0.9375rem] font-medium transition-[background-color,border-color,transform] duration-[var(--duration-hover,180ms)]";

/** The featured P3 event, while its registration page is live (it comes down after its `endsOn` day, US Eastern). */
function liveEvent() {
  return currentEvent();
}

export default function InquiryPanel({ request, closing, close }: PanelProps) {
  const [choice, setChoice] = useState<Choice | null>(request.type);
  const [left, setLeft] = useState<Choice | null>(null); // the topic just left, refocused in the picker
  const [sent, setSent] = useState<InquiryType | null>(null);
  const [allTopics, setAllTopics] = useState(false); // a limited picker expanded to every topic
  const sheet = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const event = choice === "p3_interest" ? liveEvent() : null;
  const limited = !!request.choices && !allTopics;
  // A page's own intro line applies to the view the panel opened on.
  const ownIntro = request.intro && choice === request.type && !sent && !allTopics ? request.intro : null;
  const title = sent
    ? "Thank you."
    : choice === null
      ? inquiryTypes.general.title
      : choice === "consulting"
        ? "Consulting"
        : event
          ? education.events.heading
          : inquiryTypes[choice].title;
  const intro =
    ownIntro ??
    (sent
      ? successMessage(sent)
      : choice === null
        ? inquiryTypes.general.intro
        : choice === "consulting"
          ? consultingChoice.note
          : event
            ? null
            : inquiryTypes[choice].intro);

  // Modal while open: the page behind is inert and Tab cycles inside the panel.
  // Released as soon as closing starts, so focus can return to the page.
  useEffect(() => {
    if (closing) return;
    const restore = inertOutside([sheet.current?.parentElement]);
    const onKey = (e: KeyboardEvent) => trapTab(e, [sheet.current]);
    document.addEventListener("keydown", onKey);
    return () => {
      restore();
      document.removeEventListener("keydown", onKey);
    };
  }, [closing]);

  // Each view starts at the top with focus on its heading.
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
    const previous = choice === null && left ? sheet.current?.querySelector<HTMLElement>(`[data-choice="${left}"]`) : null;
    if (previous) previous.focus();
    else heading.current?.focus({ preventScroll: true });
  }, [choice, left, sent, allTopics]);

  const pick = (c: Choice) => {
    setLeft(null);
    setChoice(c);
  };
  const back = () => {
    setLeft(choice);
    setChoice(null);
  };

  return (
    <div
      ref={sheet}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-title"
      aria-describedby={intro ? "inquiry-intro" : undefined}
      inert={closing}
      className={`absolute inset-y-0 right-0 flex w-full max-w-[37.5rem] flex-col bg-paper shadow-[0_0_80px_rgba(11,11,11,0.18)] transition-transform starting:translate-x-full motion-reduce:transition-none ${
        closing
          ? "translate-x-full duration-[320ms] ease-[cubic-bezier(0.7,0,0.84,0)]"
          : "translate-x-0 duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      }`}
    >
      <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line px-6 md:px-10">
        {(choice !== null || limited) && !sent ? (
          <button
            type="button"
            onClick={choice !== null ? back : () => setAllTopics(true)}
            className={`-ml-1 inline-flex min-h-11 items-center gap-2 px-1 text-[0.875rem] font-medium text-stone transition-colors duration-[var(--duration-hover,180ms)] hover:text-ink ${ring}`}
          >
            <ArrowLeft className="size-4" aria-hidden /> All topics
          </button>
        ) : (
          <span className="label text-stone">Inquiry</span>
        )}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className={`inline-flex size-11 items-center justify-center rounded-full border border-line transition-[border-color,background-color,transform] duration-[var(--duration-hover,180ms)] hover:border-ink active:scale-95 motion-reduce:active:scale-100 ${ring}`}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div ref={body} className="flex-1 overflow-y-auto overscroll-contain px-6 pt-10 pb-16 md:px-10 md:pt-12">
        {sent && (
          <span className="mb-8 inline-flex size-12 items-center justify-center rounded-full bg-blush text-ink">
            <Check className="size-5" aria-hidden />
          </span>
        )}
        <h2 ref={heading} id="inquiry-title" tabIndex={-1} className="display text-[clamp(2.4rem,6vw,3.4rem)] outline-none">
          {title}
        </h2>
        {intro && (
          <p id="inquiry-intro" className="mt-4 max-w-md text-[1.03125rem] leading-relaxed text-stone">
            {intro}
          </p>
        )}

        <div className="mt-10">
          {sent ? (
            <button type="button" onClick={close} className={`${pill} border border-ink/30 text-ink hover:border-ink hover:bg-ink/[0.04] active:scale-[0.98] ${ring}`}>
              Close
            </button>
          ) : choice === null ? (
            <Picker choices={limited && request.choices ? request.choices : interestChoices} onPick={pick} />
          ) : choice === "consulting" ? (
            <ConsultingRoute />
          ) : event ? (
            <EventRoute event={event} />
          ) : (
            <InquiryForm
              key={choice}
              type={choice}
              preset={choice === request.type ? request.preset : undefined}
              onSent={() => setSent(choice)}
            />
          )}
        </div>

        {/* Read out after a successful send; present from the start so screen readers notice the change. */}
        <p aria-live="polite" className="sr-only">
          {sent ? successMessage(sent) : ""}
        </p>
      </div>
    </div>
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
              data-choice={c}
              onClick={() => onPick(c)}
              className="group flex min-h-16 w-full items-center gap-5 py-4 text-left transition-colors duration-[var(--duration-hover,180ms)] hover:bg-ivory focus-visible:bg-ivory focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ink active:bg-sand/60"
            >
              <span className="label w-6 shrink-0 text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-serif text-[1.375rem] leading-tight">
                {c === "consulting" ? consultingChoice.label : inquiryTypes[c].label}
              </span>
              <ArrowRight
                className="mr-1 size-4 shrink-0 transition-transform duration-[var(--duration-hover,180ms)] group-hover:translate-x-1"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

function ConsultingRoute() {
  const link = instrumentalLink();
  if (link.pending) {
    // Review mode only (the launch build requires the URL): nothing to follow yet, so no "#" link.
    return (
      <span
        role="link"
        aria-disabled="true"
        tabIndex={0}
        title="Instrumental website link to come"
        className={`${pill} cursor-not-allowed bg-ink/80 text-white ${ring}`}
      >
        Visit Instrumental
        <ArrowUpRight className="size-4" aria-hidden />
        <PendingTag className="!ml-0" />
      </span>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={`${pill} bg-ink text-white hover:bg-charcoal active:scale-[0.98] ${ring}`}>
      Visit Instrumental
      <ArrowUpRight
        className="size-4 transition-transform duration-[var(--duration-hover,180ms)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function EventRoute({ event }: { event: NonNullable<ReturnType<typeof liveEvent>> }) {
  return (
    <div className="border-t border-line pt-6">
      <p className="font-serif text-3xl leading-tight">{event.name}</p>
      <p className="mt-2 text-[1rem] text-stone">
        {event.date} · {event.location}
      </p>
      {event.details && <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-stone">{event.details}</p>}
      <a
        href={event.registrationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${pill} mt-8 bg-ink text-white hover:bg-charcoal active:scale-[0.98] ${ring}`}
      >
        {education.events.cta}
        <ArrowUpRight className="size-4" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
