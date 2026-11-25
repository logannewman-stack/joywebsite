import { InView } from "@/components/motion/InView";
import { ArrowCircle } from "./ArrowCircle";

/**
 * The two ways to work together, named with their approved headings and
 * numbered as a list, so the page's two inquiry categories are clear from the
 * first screen. Each row jumps to its section.
 *
 * The rules draw themselves in (the index rule in gold) and the rows follow.
 * On hover or focus a row answers as one: an ink rule draws over the
 * hairline, the label leans in, the number darkens and the arrow travels
 * down in its gold ring.
 */
export function PathIndex({ items, className = "" }: { items: { label: string; href: string }[]; className?: string }) {
  return (
    <nav aria-label="On this page" className={className}>
      <InView delay={0.3}>
        <ol className="stagger">
          {items.map((item, i) => (
            <li key={item.href}>
              <a href={item.href} className="group relative flex min-h-[3.75rem] items-center gap-5 py-3">
                <span className="label w-6 shrink-0 text-stone tabular-nums transition-colors duration-(--duration-ui) group-hover:text-ink group-focus-visible:text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lean flex-1 font-display text-[clamp(1.45rem,2vw,1.8rem)] leading-tight">{item.label}</span>
                <ArrowCircle direction="down" className="size-9 shrink-0" iconClassName="size-4" />
                <span aria-hidden className="rule-over" />
              </a>
            </li>
          ))}
        </ol>
      </InView>
    </nav>
  );
}
