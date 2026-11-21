import type { ReactNode } from "react";
import { education, eventEndsAt, isListed, type FeaturedEvent } from "@/content/education";
import { EventStructuredData } from "@/components/ui/StructuredData";
import type { PhotoSlot } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Links";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { EventWindow } from "./EventWindow";
import { hasEnded } from "./eventStatus";

/**
 * P3 Events: the next event with its Register button while its landing page
 * is live, otherwise the interest list. Both share one layout, so the page
 * looks the same either way and only the data changes.
 */
export async function P3Events() {
  const { events } = education;
  const ev = events.featured;
  const interest = (
    <Panel photo={events.photo}>
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
          <Panel photo={ev.photo?.src ? ev.photo : events.photo}>
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
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">{body}</div>
    </section>
  );
}

/** "P3 Events" with its P3 in italic, as in the family name "Dr. Joy's P3". */
function italicP3(text: string): ReactNode {
  return text.split(/\b(P3)\b/).map((part, i) => (part === "P3" ? <em key={i}>P3</em> : part));
}

/**
 * Photo and words side by side. The section heading sits with the words, so
 * each version carries it; only one version is ever displayed.
 */
function Panel({ photo, children }: { photo: PhotoSlot; children: ReactNode }) {
  // Phones: heading, photo, words. From lg: the photo on the right, and the
  // heading and words centered beside it (the 1fr rows above and below take
  // up the photo's extra height). The heading is the section's masthead, on
  // the same step as "Dr. Joy's P3"; the event, or the notice, reads under it.
  return (
    <div className="grid gap-10 md:gap-12 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-6 lg:gap-y-0">
      <Reveal className="lg:col-span-6 lg:col-start-1 lg:row-start-2">
        <span aria-hidden className="block h-px w-12 bg-blush" />
        <h2 className="display mt-8 text-[clamp(3.6rem,19vw,6.4rem)] leading-[0.88] lg:text-[clamp(4.6rem,8.4vw,7.56rem)]">
          {italicP3(education.events.heading)}
        </h2>
      </Reveal>
      <ImageReveal className="lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1">
        <Photo
          slot={photo}
          tone="dark"
          className="aspect-[4/3] w-full md:aspect-[3/2] lg:aspect-[4/5]"
          sizes="(min-width: 1440px) 560px, (min-width: 1024px) 40vw, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
        />
      </ImageReveal>
      <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-1 lg:row-start-3 lg:mt-10">
        {children}
      </Reveal>
    </div>
  );
}

/** No live event yet: the notice is a serif lede under the masthead, then the interest list. */
function InterestList() {
  const { fallback } = education.events;
  return (
    <>
      <h3 className="max-w-[26ch] font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-snug text-balance">{fallback.heading}</h3>
      <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-ash">{fallback.text}</p>
      <InquiryButton type="p3_interest" tone="dark" className="mt-9">
        {fallback.cta}
      </InquiryButton>
    </>
  );
}

/** The next event: its name on the same step as "P3 Special Events", then when, where and Register. */
function EventDetails({ ev }: { ev: FeaturedEvent }) {
  return (
    <>
      <h3 className="display text-[clamp(2.2rem,3.4vw,3.06rem)]">{typeset(ev.name)}</h3>
      <p className="mt-4 text-[18px] text-blush">
        {ev.startsOn ? <time dateTime={ev.startsOn}>{ev.date}</time> : ev.date} · {ev.location}
      </p>
      <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-ash">{ev.details}</p>
      <ButtonLink href={ev.registrationUrl} tone="dark" className="mt-9">
        {education.events.cta}
      </ButtonLink>
    </>
  );
}
