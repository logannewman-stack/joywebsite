import type { ReactNode } from "react";
import { notes, site } from "@/content/site";
import { education } from "@/content/education";
import { Quote } from "@/components/ui/Quote";
import { Label, ReviewSlot } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { VideoFacade } from "./VideoFacade";

const heading = "From a P3 participant";

/**
 * The featured attendee testimonial and/or approved short video. Both follow
 * the testimonial's permission: shown with a "pending" tag in review mode,
 * and only once granted at launch.
 *
 * The testimonial is the site's shared Quote on white: its opening sentence
 * as a heading, the rest at reading size, the name under it. An approved
 * video follows in the quote's own columns, at reading width, with no line
 * between the two.
 */
export function AttendeeVoice() {
  const a = education.attendee;

  if (!a) {
    return notes ? (
      <section className="bg-paper">
        <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">
          <ReviewSlot>Featured attendee testimonial or approved short video (permission required)</ReviewSlot>
        </div>
      </section>
    ) : null;
  }

  const cleared = a.permission === "granted" || site.showPlaceholders;
  const hasQuote = cleared && !!a.quote;
  const videoUrl = cleared ? a.videoUrl : undefined;
  const pending = a.permission !== "granted";
  const video: ReactNode = videoUrl ? (
    <VideoFacade
      url={videoUrl}
      label={heading}
      shape={a.videoShape}
      poster={a.videoPoster && <Photo slot={a.videoPoster} tone="dark" className="size-full" sizes="(min-width: 768px) 608px, 100vw" />}
    />
  ) : notes ? (
    <ReviewSlot>Approved short attendee video, if one is supplied (permission required)</ReviewSlot>
  ) : null;

  return (
    <>
      {hasQuote && <Quote heading={heading} quote={a.quote} name={a.name} role={a.role} permission={a.permission} tone="light" />}
      {video && (
        // Under a quote the video runs on from it: no line between them, and it is
        // pulled a little way up into the quote's bottom space (relative, so it
        // paints above the quote section it overlaps).
        <section className={`bg-paper ${hasQuote ? "no-rule relative -mt-6 md:-mt-12" : ""}`}>
          <div className={`mx-auto grid max-w-(--wrap) px-5 md:grid-cols-12 md:gap-x-6 md:px-10 ${hasQuote ? "pb-20 md:pb-28" : "py-20 md:py-28"}`}>
            <div className="md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-3">
              {!hasQuote && (
                <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 md:mb-14">
                  <Label as="h2" className="text-stone">
                    {heading}
                  </Label>
                  {pending && notes && (
                    <p className="label rounded-full border border-ink/25 px-2 py-0.5 !text-[0.5625rem] whitespace-nowrap text-stone">Permission to republish pending</p>
                  )}
                </div>
              )}
              <Reveal className="max-w-[38rem]">{video}</Reveal>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
