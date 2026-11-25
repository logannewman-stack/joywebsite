import type { ReactNode } from "react";
import { education, eventEndsAt, isListed, type FeaturedEvent } from "@/content/education";
import { EventStructuredData } from "@/components/ui/StructuredData";
import type { PhotoSlot } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Links";
import { ImageReveal } from "@/components/ui/Reveal";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { InView, Magnetic } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { WordRise } from "@/components/motion/Text";
import { typeset } from "@/components/ui/Typeset";
import { EventWindow } from "./EventWindow";
import { hasEnded } from "./eventStatus";

/**
 * P3 Events, the page's black section: the next event with its Register
 * button while its landing page is live, otherwise the interest list. Both
 * share one layout, so the page looks the same either way and only the data
 * changes.
 *
 * `lift`: from md the photograph is upright and starts above the section, so
 * it carries across the edge from the section before into the black. Pass it
 * only when a plain white section with its usual bottom padding comes before
 * this one.
 */
export async function P3Events({ lift = false }: { lift?: boolean }) {
  const { events } = education;
  const ev = events.featured;
  const interest = (
    <Panel photo={events.photo} lift={lift}>
      <InterestList />
    </Panel>
  );

  // Once the server knows the event is over, it never ships its link again.
  // Until then, EventWindow takes it down in the browser the moment it ends.
  let body: ReactNode = interest;
  if (ev && isListed(ev) && !(await hasEnded(eventEndsAt(ev)))) {
    body = (
      <>
        <EventWindow
          endsAt={eventEndsAt(ev)}
          live={
            <Panel photo={ev.photo?.src ? ev.photo : events.photo} lift={lift}>
              <EventDetails ev={ev} />
            </Panel>
          }
          fallback={interest}
        />
        {/* Search engines see the event only while it is live. */}
        <EventStructuredData />
      </>
    );
  }

  return (
    <section id="events" data-header="dark" className="grain grain-light bg-ink text-white">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">{body}</div>
    </section>
  );
}

/**
 * The words on the left: the section heading, then the event (or the notice)
 * under a thin line. The photograph on the right, five of the twelve
 * columns; on phones it follows the words. The section heading sits with the
 * words, so each version carries it; only one version is ever displayed.
 * Motion: the heading's words rise, the line under it draws from the left,
 * the words under the line follow one after another, and the photograph
 * uncovers, settles from slightly large and drifts a little in its frame.
 */
function Panel({ photo, lift, children }: { photo: PhotoSlot; lift: boolean; children: ReactNode }) {
  return (
    <div className="md:grid md:grid-cols-12 md:items-center md:gap-x-6">
      <div className="md:col-span-6">
        <InView>
          <h2 className="display t-h1">
            <WordRise>{education.events.heading}</WordRise>
          </h2>
        </InView>
        <InView delay={0.12} className="relative mt-8 pt-8 md:mt-10 md:pt-10">
          <span aria-hidden className="rule-draw absolute inset-x-0 top-0 block h-px bg-line-dark" />
          <div className="stagger">{children}</div>
        </InView>
      </div>
      {/* Lifted, the photograph starts 5rem above the section: its top margin takes back the section's top padding and that much more. */}
      <InView className={`mt-12 w-[min(100%,24rem)] md:col-span-5 md:col-start-8 md:w-auto ${lift ? "md:-mt-48 md:self-start" : "md:mt-0"}`}>
        <ImageReveal>
          <Parallax amount={5} className={`aspect-[5/4] w-full ${lift ? "md:aspect-[4/5]" : ""}`}>
            <Photo slot={photo} tone="dark" className="settle h-full w-full" sizes="(max-width: 767px) min(100vw - 40px, 384px), (max-width: 1440px) 37vw, 32vw" />
          </Parallax>
        </ImageReveal>
      </InView>
    </div>
  );
}

/** The section's one action leans a few pixels toward the pointer. Its own block, so the entrance and the lean never share an element. */
function Action({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8">
      <Magnetic strength={0.2}>{children}</Magnetic>
    </div>
  );
}

/** No live event yet: the notice as an item title, a line of text, then the interest list. */
function InterestList() {
  const { fallback } = education.events;
  return (
    <>
      <h3 className="display t-h3 max-w-[30rem]">{fallback.heading}</h3>
      <p className="t-body mt-3 max-w-[33rem] text-ash">{fallback.text}</p>
      <Action>
        <InquiryButton type="p3_interest" tone="dark">
          {fallback.cta}
        </InquiryButton>
      </Action>
    </>
  );
}

/** The next event: when and where as a small label, its name, a line about it, then Register. */
function EventDetails({ ev }: { ev: FeaturedEvent }) {
  return (
    <>
      <p className="label text-ash">
        {ev.startsOn ? <time dateTime={ev.startsOn}>{ev.date}</time> : ev.date} · {ev.location}
      </p>
      <h3 className="display t-h2 mt-4">{typeset(ev.name)}</h3>
      <p className="t-body mt-4 max-w-[33rem] text-ash">{ev.details}</p>
      <Action>
        <ButtonLink href={ev.registrationUrl} tone="dark">
          {education.events.cta}
        </ButtonLink>
      </Action>
    </>
  );
}
