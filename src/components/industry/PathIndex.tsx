import { InView } from "@/components/motion/InView";
import { ArrowCircle } from "./ArrowCircle";

/**
 * The two ways to work together, named with their approved headings and
 * numbered as a list, so the page's two inquiry categories are clear from the
 * first screen. Each row jumps to its section.
 *
 * It is set as a ledger: a thin line above each row and under the last. The
 * rows come in one after another. On hover or focus a row answers as one: the
 * title leans in, the number darkens and the arrow travels down as its ring
 * fills.
 */
export function PathIndex({ items, className = "" }: { items: { label: string; href: string }[]; className?: string }) {
  return (
    <nav aria-label="On this page" className={className}>
      <InView delay={0.3}>
        <ol className="stagger">
          {items.map((item, i) => (
            <li key={item.href} className="border-t border-line last:border-b">
              <a href={item.href} className="group flex min-h-14 items-center gap-5 py-3">
                <span className="label w-6 shrink-0 text-stone tabular-nums transition-colors duration-(--duration-ui) group-hover:text-ink group-focus-visible:text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lean display t-h3 flex-1">{item.label}</span>
                <ArrowCircle direction="down" className="size-8 shrink-0" iconClassName="size-3.5" />
              </a>
            </li>
          ))}
        </ol>
      </InView>
    </nav>
  );
}
