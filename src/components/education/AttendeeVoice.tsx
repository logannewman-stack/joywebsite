import { site } from "@/content/site";
import { education } from "@/content/education";
import { Quote } from "@/components/ui/Quote";
import { Label, ReviewSlot } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
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
  return hasQuote || !!videoUrl || site.showPlaceholders;
}

/**
 * The featured attendee testimonial and/or approved short video. Both follow
 * the testimonial's permission: shown with a "pending" tag in review mode,
 * and only once granted at launch. The quote's words brighten one after
 * another as it scrolls into view (Quote).
 */
export function AttendeeVoice() {
  const { a, hasQuote, videoUrl } = plan();

  if (!a) {
    return site.showPlaceholders ? (
      <section className="bg-paper">
        <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10">
          <ReviewSlot>Featured attendee testimonial or approved short video (permission required)</ReviewSlot>
        </div>
      </section>
    ) : null;
  }

  return (
    <>
      {hasQuote && <Quote heading={heading} quote={a.quote} name={a.name} role={a.role} permission={a.permission} tone="paper" />}
      {(videoUrl || site.showPlaceholders) && (
        // Sits in the quote's column, pulled up into the quote's bottom space
        // (relative, so it paints above the quote section it overlaps).
        <section className={`relative bg-paper ${hasQuote ? "-mt-10 md:-mt-20" : ""}`}>
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
                {a.permission !== "granted" && (
                  <p className="label mt-3 inline-block border border-ink/25 px-2 py-1 !text-[0.5625rem] whitespace-nowrap text-stone">Permission to republish pending</p>
                )}
              </div>
            )}
            {/* Under a quote, the video keeps the quote's own columns. */}
            <Reveal className={hasQuote ? "md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-3" : "lg:col-span-9 lg:col-start-4"}>
              {videoUrl ? (
                <VideoFacade
                  url={videoUrl}
                  label={heading}
                  shape={a.videoShape}
                  poster={a.videoPoster && <Photo slot={a.videoPoster} tone="dark" className="size-full" sizes="(min-width: 1024px) 60vw, 100vw" />}
                />
              ) : (
                <ReviewSlot className="max-w-xl">Approved short attendee video, if one is supplied (permission required)</ReviewSlot>
              )}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
