import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageOrder } from "@/content/site";
import { typeset } from "../ui/Typeset";

/**
 * Editorial wayfinding at the foot of each page: the next page, set large.
 * The order never leads back to Home as a "next" step: after the last page
 * (Insights) it continues with the first page after Home, Meet Dr. Joy.
 * `current` may be any page in the order (an article under /insights passes
 * the page before Insights to point back to it).
 */
export function NextPage({ current }: { current: string }) {
  const i = pageOrder.findIndex((p) => p.href === current);
  const following = pageOrder[(i + 1) % pageOrder.length];
  const next = following.href === "/" ? pageOrder[1] : following;
  return (
    <Link href={next.href} className="group block border-t border-line bg-paper">
      <div className="mx-auto flex max-w-[90rem] items-end justify-between gap-6 px-5 py-14 md:px-10 md:py-20">
        <div className="min-w-0">
          <p className="label flex items-center gap-2 text-stone">
            Next
            {/* On phones the arrow sits with the label, so long page names keep the full width. */}
            <ArrowRight className="size-3.5 sm:hidden" aria-hidden />
          </p>
          <p className="display mt-3 text-[clamp(2.6rem,8vw,7rem)] transition-transform duration-(--duration-ui) ease-expo group-hover:translate-x-1.5">
            {typeset(next.label)}
          </p>
        </div>
        <span className="mb-3 hidden size-14 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors duration-(--duration-hover) group-hover:border-ink group-hover:bg-ink group-hover:text-white group-active:bg-charcoal sm:inline-flex md:size-20">
          <ArrowRight className="size-5 md:size-6" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
