import Image from "next/image";
import Link from "next/link";
import { nav, pageOrder, site, type PhotoSlot } from "@/content/site";
import { meet } from "@/content/meet";
import { speaking } from "@/content/speaking";
import { education } from "@/content/education";
import { industry } from "@/content/industry";
import { insights } from "@/content/insights";
import { Magnetic } from "../motion/InView";
import { WordRise } from "../motion/Text";
import { SwapArrow } from "../ui/Links";

/** Each page's opening photograph, read from its content file: the preview shown on hover. */
const openings: Record<string, PhotoSlot | undefined> = {
  "/meet-dr-joy": meet.hero.portrait,
  "/speaking": speaking.hero.photo,
  "/hands-on-education": education.hero.photo,
  "/industry-collaborations": industry.hero.photo,
  "/insights": insights.hero.photo,
};

/**
 * Editorial wayfinding at the foot of each page: the next page, set large.
 * The order never leads back to Home as a "next" step: after the last page
 * (Insights) it continues with the first page after Home, Meet Dr. Joy.
 * `current` may be any page in the order (an article under /insights passes
 * the page before Insights to point back to it).
 *
 * The name rises word by word when it is seen, the hairline above it draws,
 * and the arrow leans toward the pointer. On hover or keyboard focus the next
 * page's opening photograph is uncovered beside it (pointer devices from
 * 1024px; on touch it is simply a large link). Following it turns to the next
 * page like the next spread (the "next-page" transition in styles/chrome.css).
 */
export function NextPage({ current }: { current: string }) {
  const i = pageOrder.findIndex((p) => p.href === current);
  const following = pageOrder[(i + 1) % pageOrder.length];
  const next = following.href === "/" ? pageOrder[1] : following;
  const number = String(nav.findIndex((p) => p.href === next.href) + 1).padStart(2, "0");
  const slot = openings[next.href];
  const src = slot?.src && site.photoStyle === "bw" && slot.srcBw ? slot.srcBw : slot?.src;
  return (
    <Link href={next.href} transitionTypes={["next-page"]} data-inview="" data-magnetic="0.04" className="next-page group">
      <span aria-hidden className="rule-draw absolute inset-x-0 top-0 block h-px bg-gold-deep/70" />
      <div className="mx-auto flex max-w-[90rem] items-end justify-between gap-6 px-5 pt-14 pb-12 md:gap-10 md:px-10 md:pt-24 md:pb-20">
        <div className="min-w-0 flex-1">
          <p className="label flex items-center gap-3 text-stone">
            Next
            <span aria-hidden className="label-rule h-px w-8" />
            <span aria-hidden className="tabular-nums">
              {number}
            </span>
            {/* On phones the arrow sits with the label, so long page names keep the full width. */}
            <span aria-hidden className="next-circle ml-auto inline-flex size-12 items-center justify-center rounded-full border border-gold-deep/80 text-ink md:hidden">
              <SwapArrow className="size-4.5" />
            </span>
          </p>
          <p className="next-title display mt-6 text-[clamp(2.75rem,14.5vw,5rem)] md:mt-8 md:text-[clamp(5rem,10.5vw,10.5rem)]">
            <WordRise>{next.label}</WordRise>
          </p>
        </div>
        {src && slot && (
          <span aria-hidden className="next-preview relative aspect-[4/5] w-[clamp(12rem,19vw,17rem)] shrink-0 overflow-hidden bg-sand">
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1441px) 19vw, 272px"
              className="object-cover"
              style={{ objectPosition: slot.focus ?? "50% 35%" }}
            />
          </span>
        )}
        <span aria-hidden className="hidden shrink-0 md:block">
          <Magnetic strength={0.3}>
            <span className="next-circle inline-flex size-20 items-center justify-center rounded-full border border-gold-deep/80 lg:size-24">
              <SwapArrow className="size-6" />
            </span>
          </Magnetic>
        </span>
      </div>
    </Link>
  );
}
