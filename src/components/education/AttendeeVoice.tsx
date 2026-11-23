import type { ReactNode } from "react";
import { notes, site } from "@/content/site";
import { education } from "@/content/education";
import { Quote } from "@/components/ui/Quote";
import { Label, ReviewSlot } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";
import { InView } from "@/components/motion/InView";
import { WordLight } from "@/components/motion/Text";
import { VideoFacade } from "./VideoFacade";

const heading = "From a P3 participant";

/** What the section will show, decided in one place (the page also asks whether it shows anything). */
function plan() {
  const a = education.attendee;
  const cleared = !!a && (a.permission === "granted" || site.showPlaceholders);
  const hasQuote = cleared && !!a?.quote;
  const videoUrl = cleared ? a?.videoUrl : undefined;
  return { a, hasQuote, videoUrl };
}

/** Whether AttendeeVoice renders a section: a quote, a video, or (in review mode) their labelled slots. */
export function attendeeVoiceShown(): boolean {
  const { hasQuote, videoUrl } = plan();
  return hasQuote || !!videoUrl || notes;
}

/**
 * The quote's opening sentence, when it is short enough to stand as a
 * statement, and the rest of the quote. Wording and order are untouched: the
 * two parts are only set at different sizes. A period after a title
 * ("Dr. Joy") does not end the sentence. Returns null for a quote of one
 * sentence, or one that opens with a long sentence.
 */
function opening(quote: string): { lead: string; rest: string } | null {
  const end = /[.!?]["”’)]*\s+(?=["“‘(]?[A-Z])/g;
  let m: RegExpExecArray | null;
  while ((m = end.exec(quote))) {
    if (/\b(?:Dr|Mr|Mrs|Ms|St|Prof|Jr|Sr)\.$/.test(quote.slice(0, m.index + 1))) continue;
    const cut = m.index + m[0].length;
    const lead = quote.slice(0, cut).trim();
    const rest = quote.slice(cut).trim();
    return lead.length <= 44 && rest ? { lead, rest } : null;
  }
  return null;
}

function PendingTag() {
  if (!notes) return null;
  return <p className="label rounded-full border border-ink/25 px-2 py-0.5 !text-[0.5625rem] whitespace-nowrap text-stone">Permission to republish pending</p>;
}

/**
 * The featured attendee testimonial and/or approved short video, on the ivory
 * of the workshop above it. Both follow the testimonial's permission: shown
 * with a "pending" tag in review mode, and only once granted at launch.
 *
 * The quote's opening sentence is set as a statement, and its words brighten
 * one after another as it scrolls into view; the rest of the quote reads at
 * reading size beside it (below it, under lg), with the name under that. The
 * video keeps the statement's column. A quote without a short opening
 * sentence falls back to the shared Quote. Styles: education.css ("From a P3
 * participant").
 */
export function AttendeeVoice() {
  const { a, hasQuote, videoUrl } = plan();

  if (!a) {
    return notes ? (
      <section className="bg-ivory">
        <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10">
          <ReviewSlot>Featured attendee testimonial or approved short video (permission required)</ReviewSlot>
        </div>
      </section>
    ) : null;
  }

  const pending = a.permission !== "granted";
  const video: ReactNode = videoUrl ? (
    <VideoFacade
      url={videoUrl}
      label={heading}
      shape={a.videoShape}
      poster={a.videoPoster && <Photo slot={a.videoPoster} tone="dark" className="size-full" sizes="(min-width: 1024px) 60vw, 100vw" />}
    />
  ) : notes ? (
    <ReviewSlot className="max-w-xl">Approved short attendee video, if one is supplied (permission required)</ReviewSlot>
  ) : null;

  const parts = hasQuote ? opening(a.quote) : null;
  if (parts) {
    return (
      <section className="edu-voice bg-ivory">
        <div className="mx-auto max-w-[90rem] px-5 pt-10 pb-24 md:px-10 md:pt-12 md:pb-32 lg:pt-24 lg:pb-40">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <InView className="lg:col-span-11 lg:col-start-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                <h2 className="label text-stone">{heading}</h2>
                {pending && <PendingTag />}
              </div>
            </InView>
          </div>
          <figure className="edu-voice-quote mt-10 md:mt-14 lg:mt-16">
            <blockquote>
              <p className="edu-voice-lead display relative max-w-[7em] text-[clamp(2.9rem,13vw,7rem)] lg:max-w-none lg:text-[clamp(5rem,8.4vw,7.56rem)]">
                {/* The opening mark: over the statement below lg, hanging in the first column from lg. */}
                <span aria-hidden className="edu-voice-mark text-gold-deep">
                  “
                </span>
                <WordLight from={0.14} to={0.44} dim={0.5}>
                  {parts.lead}
                </WordLight>
              </p>
              <InView as="p" className="edu-voice-rest rise mt-7 max-w-[44ch] font-serif text-[clamp(1.3rem,1.9vw,1.65rem)] leading-[1.32] text-pretty md:mt-9 lg:mt-0 lg:max-w-none">
                {typeset(parts.rest)}
              </InView>
            </blockquote>
            <InView as="figcaption" className="edu-voice-by rise mt-9 flex flex-col gap-1">
              <span className="text-[1rem] font-medium">{a.name}</span>
              {a.role && <span className="text-[0.9375rem] text-stone">{a.role}</span>}
            </InView>
          </figure>
          {video && (
            // Under the statement, in its column: clear of the photograph that rises into the section's lower right.
            <div className="mt-12 md:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-6">
              <Reveal className="lg:col-span-6 lg:col-start-2">{video}</Reveal>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      {hasQuote && <Quote heading={heading} quote={a.quote} name={a.name} role={a.role} permission={a.permission} tone="light" />}
      {video && (
        // Sits in the quote's column, pulled up into the quote's bottom space
        // (relative, so it paints above the quote section it overlaps).
        <section className={`relative bg-ivory ${hasQuote ? "-mt-10 md:-mt-20" : ""}`}>
          <div
            className={`mx-auto grid max-w-[90rem] px-5 md:px-10 ${
              hasQuote ? "pb-24 md:grid-cols-12 md:gap-x-6 md:pb-32" : "gap-10 py-24 md:py-36 lg:grid-cols-12"
            }`}
          >
            {!hasQuote && (
              <div className="lg:col-span-3">
                <Label as="h2" className="text-stone">
                  {heading}
                </Label>
                {pending && notes && <p className="label mt-3 inline-block border border-ink/25 px-2 py-1 !text-[0.5625rem] whitespace-nowrap text-stone">Permission to republish pending</p>}
              </div>
            )}
            {/* Under a quote, the video keeps the quote's own columns. */}
            <Reveal className={hasQuote ? "md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-3" : "lg:col-span-9 lg:col-start-4"}>{video}</Reveal>
          </div>
        </section>
      )}
    </>
  );
}
