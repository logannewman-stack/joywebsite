import Link from "next/link";
import { ArrowRight, ArrowUp, Mail, Plus } from "lucide-react";
import { links, notes, site } from "@/content/site";
import { speaking } from "@/content/speaking";
import type { CSSProperties } from "react";
import { ButtonLink, ReviewSlot, focusRing } from "@/components/ui/Links";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";

const textLink = `group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium ${focusRing.light}`;

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
      <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-x-6">
        <h2 className="display text-[clamp(2.6rem,4.8vw,4.6rem)] lg:col-span-6">
          <WordRise>{heading}</WordRise>
        </h2>
        <InView className="lg:col-span-6 lg:col-start-7 lg:pt-3">
          <p className="rise max-w-[44ch] text-[1.0625rem] leading-relaxed text-stone" style={{ "--d": "0.15s" } as CSSProperties}>
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

function Kit() {
  const { cta, kit } = speaking.resources;
  const mail = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
  const onRequest = (subject: string, item: string) => (
    <>
      <span className="label mr-4 text-stone">{kit.onRequest}</span>
      <a href={mail(subject)} className={textLink}>
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
        <Link href="/meet-dr-joy" className={textLink}>
          <span className="link-draw pb-0.5">Meet Dr. Joy</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      ),
    },
    { name: kit.headshots, action: onRequest(`${kit.headshots} request`, kit.headshots) },
    {
      name: kit.courses,
      action: (
        <a href="#topics" className={textLink}>
          <span className="link-draw pb-0.5">{speaking.hero.primary.label}</span>
          <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
        </a>
      ),
    },
  ];
  return (
    <details className="group/kit">
      <summary
        className={`group inline-flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-full bg-ink px-6 text-[0.9375rem] font-medium whitespace-nowrap text-white transition-colors duration-300 select-none hover:bg-charcoal ${focusRing.light} [&::-webkit-details-marker]:hidden`}
      >
        {cta}
        <Plus className="size-4 transition-transform duration-300 group-open/kit:rotate-45" aria-hidden />
      </summary>
      <dl className="mt-8">
        {rows.map((r) => (
          <div key={r.name} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
            <dt className="font-serif text-[1.3125rem] leading-tight">{r.name}</dt>
            <dd className="flex flex-wrap items-center">{r.action}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
