import Image from "next/image";
import { notes, site } from "@/content/site";
import { speaking } from "@/content/speaking";
import { InView } from "@/components/motion/InView";

/** Shown at launch only once the list is confirmed (or cleared logos exist). */
export function showSpokenAt() {
  const { logos, verified } = speaking.spokenAt;
  return logos.length > 0 || verified || site.showPlaceholders;
}

/**
 * Where I've Spoken. Until conference logos are cleared, the venues are set
 * as type only: one quiet list of names in the approved order, in two
 * columns beside the section's label (one column on phones). Nothing moves
 * with the scroll. Review mode tags the list as unconfirmed.
 */
export function SpokenAt() {
  if (!showSpokenAt()) return null;
  const { heading, logos, verified, venues } = speaking.spokenAt;
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <InView className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-4 lg:block lg:pt-1.5">
          <h2 className="label rise text-stone">{heading}</h2>
          {!verified && notes && (
            <p className="label inline-block border border-ink/25 px-2 py-1 leading-relaxed text-stone lg:mt-4">
              From Testimonials.pdf (partial listing): confirm before launch
            </p>
          )}
        </InView>

        {logos.length > 0 ? (
          <ul className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-10 lg:col-span-8 lg:col-start-5 lg:mt-0">
            {logos.map((l) => (
              <li key={l.name} className="relative h-10 w-32">
                <Image src={l.src} alt={l.name} fill sizes="(max-width: 1440px) 128px, 8.9vw" className="object-contain grayscale" />
              </li>
            ))}
          </ul>
        ) : (
          <InView className="mt-8 lg:col-span-8 lg:col-start-5 lg:mt-0">
            {/* role: an unstyled list still reads as a list of 23 in every screen reader. */}
            <ul role="list" className="rise t-body sm:columns-2 sm:gap-x-6">
              {venues.map((v) => (
                <li key={v} className="break-inside-avoid pb-3 text-pretty">
                  {v}
                </li>
              ))}
            </ul>
          </InView>
        )}
      </div>
    </section>
  );
}
