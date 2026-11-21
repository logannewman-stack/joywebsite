import { ArrowDown } from "lucide-react";

/** The label's underline draws in when the row is hovered or focused. */
const underline =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat [box-decoration-break:clone] transition-[background-size] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]";

/**
 * The two ways to work together, named with their approved headings and
 * numbered as a list, so the page's two inquiry categories are clear from the
 * first screen. Each row jumps to its section.
 */
export function PathIndex({ items, className = "" }: { items: { label: string; href: string }[]; className?: string }) {
  return (
    <nav aria-label="On this page" className={className}>
      <ol className="border-t border-ink">
        {items.map((item, i) => (
          <li key={item.href} className="border-b border-line">
            <a href={item.href} className="group flex min-h-14 items-center gap-5 py-3">
              <span className="label w-6 shrink-0 text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-serif text-[clamp(1.4rem,1.9vw,1.7rem)] leading-tight">
                <span className={underline}>{item.label}</span>
              </span>
              <ArrowDown className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-y-1" aria-hidden />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
