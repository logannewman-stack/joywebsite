import Link from "next/link";
import { Mail, Plus } from "lucide-react";
import { links, notes, site } from "@/content/site";
import { speaking } from "@/content/speaking";
import type { CSSProperties } from "react";
import { ButtonLink, ReviewSlot, SwapArrow, focusRing, press, solidFill, textLink } from "@/components/ui/Links";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";

const rowLink = `${textLink} ${focusRing.light}`;

/**
 * Meeting Planner Resources. With links.speakerResources set, the approved
 * button goes straight there. Until then it opens a short list of what
 * exists today, in the order the approved line names it: nothing is linked
 * that carries retired wording, and nothing promised is a dead end.
 */
export function PlannerResources() {
  const { heading, text, cta } = speaking.resources;
  return (
    <section id="resources" className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <h2 className="display t-h1 lg:col-span-5">
          <WordRise>{heading}</WordRise>
        </h2>
        <InView className="mt-6 lg:col-span-6 lg:col-start-7 lg:mt-0">
          <p className="rise t-lead max-w-[33rem]" style={{ "--d": "0.15s" } as CSSProperties}>
            {text}
          </p>
          <div className="rise mt-8" style={{ "--d": "0.23s" } as CSSProperties}>
            {links.speakerResources ? <ButtonLink href={links.speakerResources}>{cta}</ButtonLink> : <Kit />}
          </div>
          {!links.speakerResources && notes && (
            <ReviewSlot className="mt-8 !min-h-0 !justify-start !px-4 !py-3 text-left">
              Speaker packet and bio PDF held: the supplied files carry retired P3 wording. Until a clean packet is supplied, the
              packet and headshots are sent on request.
            </ReviewSlot>
          )}
        </InView>
      </div>
    </section>
  );
}

/** The four resources as rows between thin lines: the name on the left, where to get it on the right. */
function Kit() {
  const { cta, kit } = speaking.resources;
  const mail = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
  const onRequest = (subject: string, item: string) => (
    <>
      <span className="label mr-4 text-stone">{kit.onRequest}</span>
      <a href={mail(subject)} className={rowLink}>
        <Mail className="size-4" aria-hidden />
        <span className="link-draw pb-0.5">{site.email}</span>
        <span className="sr-only">{` (email to request the ${item.toLowerCase()})`}</span>
      </a>
    </>
  );
  const rows = [
    { name: kit.packet, action: onRequest(`${kit.packet} request`, kit.packet) },
    {
      name: kit.biography,
      action: (
        <Link href="/meet-dr-joy" className={rowLink}>
          <span className="link-draw pb-0.5">Meet Dr. Joy</span>
          <SwapArrow />
        </Link>
      ),
    },
    { name: kit.headshots, action: onRequest(`${kit.headshots} request`, kit.headshots) },
    {
      name: kit.courses,
      action: (
        <a href="#topics" className={rowLink}>
          <span className="link-draw pb-0.5">{speaking.hero.primary.label}</span>
          <SwapArrow direction="up" />
        </a>
      ),
    },
  ];
  return (
    <details className="group/kit">
      <summary
        className={`group inline-flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-full px-6 text-[0.9375rem] font-medium whitespace-nowrap select-none ${press} ${solidFill.light} ${focusRing.light} [&::-webkit-details-marker]:hidden`}
      >
        {cta}
        <Plus className="size-4 transition-transform duration-(--duration-ui) group-open/kit:rotate-45" aria-hidden />
      </summary>
      <dl className="mt-8 border-b border-line">
        {rows.map((r) => (
          <div key={r.name} className="grid gap-x-6 border-t border-line py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <dt className="display t-h3 max-sm:pt-2">{r.name}</dt>
            <dd className="flex flex-wrap items-center">{r.action}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
