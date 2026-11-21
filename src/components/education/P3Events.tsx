import { Fragment, type ReactNode } from "react";
import { education, eventEndsAt, isListed, type FeaturedEvent } from "@/content/education";
import { EventStructuredData } from "@/components/ui/StructuredData";
import type { PhotoSlot } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Links";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { InView, Magnetic } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { WordRise } from "@/components/motion/Text";
import { typeset } from "@/components/ui/Typeset";
import { EventWindow } from "./EventWindow";
import { hasEnded } from "./eventStatus";

/**
 * P3 Events: the next event with its Register button while its landing page
 * is live, otherwise the interest list. Both share one layout, so the page
 * looks the same either way and only the data changes.
 *
 * `lift`: from lg the photograph starts above the section, so it carries
 * across the edge from the section before into the black. Pass it only when
 * a plain white or ivory section comes before this one.
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
      <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-32">{body}</div>
    </section>
  );
}

/** "P3 Events": its words rise one after another, the P3 in italic, as in the family name "Dr. Joy's P3". */
function risingP3(text: string): ReactNode {
  let word = 0;
  return text.split(/\b(P3)\b/).map((part, i) => {
    const t = part.trim();
    if (!t) return null;
    const start = word;
    word += t.split(/\s+/).length;
    const words = <WordRise start={start}>{t}</WordRise>;
    return (
      <Fragment key={i}>
        {start > 0 && " "}
        {part === "P3" ? <em>{words}</em> : words}
      </Fragment>
    );
  });
}

/**
 * Photo and words side by side. The section heading sits with the words, so
 * each version carries it; only one version is ever displayed.
 */
function Panel({ photo, lift, children }: { photo: PhotoSlot; lift: boolean; children: ReactNode }) {
  // Phones: heading, photo, words. From lg: the photo on the right, and the
  // heading and words centered beside it (the 1fr rows above and below take
  // up the photo's extra height). The heading is the section's masthead, on
  // the same step as "Dr. Joy's P3"; the event, or the notice, reads under it.
  // Motion: the blush rule draws and the heading rises; the photograph drifts
  // inside its frame and settles; the words follow one after another.
  return (
    <div className="grid gap-10 md:gap-12 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-6 lg:gap-y-0">
      <InView className="lg:col-span-6 lg:col-start-1 lg:row-start-2">
        <span aria-hidden className="rule-draw block h-px w-12 bg-blush" />
        <h2 className="display mt-8 text-[clamp(3.6rem,19vw,6.4rem)] leading-[0.88] lg:text-[clamp(5.2rem,10.4vw,9.36rem)]">
          {risingP3(education.events.heading)}
        </h2>
      </InView>
      <InView className={`lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1 ${lift ? "lg:-mt-52" : ""}`}>
        <Parallax amount={10} className="aspect-[4/3] w-full md:aspect-[3/2] lg:aspect-[4/5]">
          <Photo
            slot={photo}
            tone="dark"
            className="settle h-full w-full"
            sizes="(min-width: 1441px) 45vw, (min-width: 1024px) 46vw, (min-width: 768px) calc(115vw - 5rem), calc(115vw - 2.5rem)"
          />
        </Parallax>
      </InView>
      <InView delay={0.12} className="stagger lg:col-span-6 lg:col-start-1 lg:row-start-3 lg:mt-10">
        {children}
      </InView>
    </div>
  );
}

/** The section's one action leans a few pixels toward the pointer. Its own block, so the entrance and the lean never share an element. */
function Action({ children }: { children: ReactNode }) {
  return (
    <div className="mt-9">
      <Magnetic strength={0.2}>{children}</Magnetic>
    </div>
  );
}

/** No live event yet: the notice is a serif lede under the masthead, then the interest list. */
function InterestList() {
  const { fallback } = education.events;
  return (
    <>
      <h3 className="max-w-[26ch] font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-snug text-balance">{fallback.heading}</h3>
      <p className="mt-5 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ash">{fallback.text}</p>
      <Action>
        <InquiryButton type="p3_interest" tone="dark">
          {fallback.cta}
        </InquiryButton>
      </Action>
    </>
  );
}

/** The next event: its name on the same step as "P3 Special Events", then when, where and Register. */
function EventDetails({ ev }: { ev: FeaturedEvent }) {
  return (
    <>
      <h3 className="display text-[clamp(2.2rem,3.4vw,3.06rem)]">{typeset(ev.name)}</h3>
      <p className="mt-4 text-[1.125rem] text-blush">
        {ev.startsOn ? <time dateTime={ev.startsOn}>{ev.date}</time> : ev.date} · {ev.location}
      </p>
      <p className="mt-5 max-w-[46ch] text-[1.03125rem] leading-relaxed text-ash">{ev.details}</p>
      <Action>
        <ButtonLink href={ev.registrationUrl} tone="dark">
          {education.events.cta}
        </ButtonLink>
      </Action>
    </>
  );
}
