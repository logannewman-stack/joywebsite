import { ArrowUpRight } from "lucide-react";
import type { Publication } from "@/content/insights";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { ConfirmTag } from "./records";

/**
 * Published Articles: an editorial index of work in dental publications, each
 * linking to the original. Book contributions sit apart under Published Work.
 */
export function PublishedList({
  heading,
  intro,
  booksHeading,
  cta,
  articles,
  books,
  rule = false,
}: {
  heading: string;
  intro: string;
  booksHeading: string;
  cta: string;
  articles: Publication[];
  books: Publication[];
  /** A hairline above, when the section follows another white section. */
  rule?: boolean;
}) {
  const toConfirm = [...articles, ...books].filter((a) => !a.verified).length;
  return (
    <section className="bg-paper">
      {rule && (
        <div className="mx-auto max-w-[1440px] px-5 md:px-10" aria-hidden>
          <div className="h-px bg-line" />
        </div>
      )}
      <div className="mx-auto grid grid-cols-1 max-w-[1440px] gap-y-12 px-5 py-24 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-x-6 lg:pt-32 lg:pb-36">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <h2 className="display text-[clamp(2.6rem,4.6vw,4.4rem)]">{heading}</h2>
          <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-stone">{intro}</p>
          {site.showPlaceholders && toConfirm > 0 && (
            <p className="label mt-6 inline-block rounded-full border border-ink/25 px-2.5 py-1 !text-[9.5px] text-stone">
              Review: {toConfirm} {toConfirm === 1 ? "record" : "records"} to confirm
            </p>
          )}
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          {articles.length > 0 && (
            <ol className="border-t border-ink">
              {articles.map((a, i) => (
                <li key={a.title} className="border-b border-line">
                  <Row item={a} index={i} cta={cta} />
                </li>
              ))}
            </ol>
          )}

          {books.length > 0 && (
            <div className={articles.length > 0 ? "mt-16" : ""}>
              <h3 className="label text-stone">{booksHeading}</h3>
              <ul className="mt-5 border-t border-ink">
                {books.map((b) => (
                  <li key={b.title} className="border-b border-line">
                    <BookRow item={b} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** The title's underline draws in when anywhere on the row is hovered or focused. */
const drawOnRowHover =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat [box-decoration-break:clone] transition-[background-size] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]";

function Row({ item, index, cta }: { item: Publication; index: number; cta: string }) {
  const inner = (
    <span className="grid grid-cols-[2rem_1fr] gap-x-4 py-6 md:grid-cols-[2.5rem_1fr_auto] md:gap-x-6 md:py-7">
      <span className="label pt-2 text-stone tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="block font-serif text-[24px] leading-[1.12] md:text-[28px]">
          <span className={item.url ? drawOnRowHover : ""}>{item.title}</span>
        </span>
        {item.subtitle && <span className="mt-1 block font-serif text-[17px] leading-snug text-stone italic">{item.subtitle}</span>}
        <span className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-serif text-[17px] text-ink/80 italic">{item.publication}</span>
          {item.date && <span className="label text-stone tabular-nums md:hidden">{item.date}</span>}
        </span>
        {!item.verified && <ConfirmTag className="mt-3" />}
      </span>
      <span className="col-start-2 mt-4 flex flex-col gap-3 md:col-start-auto md:mt-0 md:items-end md:pt-2 md:text-right">
        {item.date && <span className="label hidden whitespace-nowrap text-stone tabular-nums md:block">{item.date}</span>}
        {item.url && (
          <span className="inline-flex items-center gap-1.5 text-[14px] font-medium whitespace-nowrap">
            {cta}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        )}
      </span>
    </span>
  );
  if (!item.url) return inner;
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block">
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function BookRow({ item }: { item: Publication }) {
  const title = <span className="block font-serif text-[22px] leading-tight italic md:text-[24px]">{item.title}</span>;
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-5">
      <span className="min-w-0">
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-draw">
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          title
        )}
        <span className="mt-1.5 block text-[14.5px] text-stone">
          {item.publication}
          {item.date && <span className="whitespace-nowrap"> · {item.date}</span>}
        </span>
      </span>
      {!item.verified && <ConfirmTag />}
    </div>
  );
}
