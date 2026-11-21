import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageOrder } from "@/content/site";

/** Editorial wayfinding at the foot of each page: the next page, set large. */
export function NextPage({ current }: { current: string }) {
  const i = pageOrder.findIndex((p) => p.href === current);
  const next = pageOrder[(i + 1) % pageOrder.length];
  return (
    <Link href={next.href} className="group block border-t border-line bg-paper">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-5 py-14 md:px-10 md:py-20">
        <div>
          <p className="label text-stone">Next</p>
          <p className="display mt-3 text-[clamp(2.8rem,8vw,7rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
            {next.label}
          </p>
        </div>
        <span className="mb-3 inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white md:size-20">
          <ArrowRight className="size-5 md:size-6" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
