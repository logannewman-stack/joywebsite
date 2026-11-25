import type { CSSProperties } from "react";
import type { Publication } from "@/content/insights";
import { notes } from "@/content/site";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { ArrowCircle } from "@/components/industry/ArrowCircle";
import { ConfirmTag } from "./records";

type Vars = CSSProperties & Record<`--${string}`, string>;

/**
 * Published Articles: an index of work in dental publications, each linking
 * to the original. Book contributions sit apart under Published Work.
 *
 * The heading holds the left of the page column (it stays in view on desktop
 * while the index scrolls past); the index is the right two thirds. Each row
 * is set between thin lines: its number, the title, the rest of the headline,
 * then the publication and the date in grey. The rows rise one after another.
 * A row with a link answers as one on hover and focus: a soft wash rises
 * behind it, the title leans in, the number darkens and the arrow circle
 * fills.
 */
export function PublishedList({
  heading,
  intro,
  booksHeading,
  cta,
  articles,
  books,
}: {
  heading: string;
  intro: string;
  booksHeading: string;
  cta: string;
  articles: Publication[];
  books: Publication[];
}) {
  const toConfirm = [...articles, ...books].filter((a) => !a.verified).length;
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:col-span-4 lg:self-start">
          <h2 className="display t-h1">
            <WordRise>{heading}</WordRise>
          </h2>
          <InView>
            <p className="rise t-body mt-5 max-w-[22rem] text-stone" style={{ "--d": "0.12s" } as Vars}>
              {intro}
            </p>
            {notes && toConfirm > 0 && (
              <p className="rise label mt-6 inline-block rounded-full border border-ink/25 px-2.5 py-1 !text-[0.59375rem] text-stone" style={{ "--d": "0.2s" } as Vars}>
                Review: {toConfirm} {toConfirm === 1 ? "record" : "records"} to confirm
              </p>
            )}
          </InView>
        </div>

        <div className="mt-10 md:mt-12 lg:col-span-8 lg:col-start-5 lg:mt-2">
          {articles.length > 0 && (
            <InView>
              <ol className="stagger">
                {articles.map((a, i) => (
                  <li key={a.title} className="relative border-t border-line last:border-b">
                    <Row item={a} index={i} cta={cta} />
                  </li>
                ))}
              </ol>
            </InView>
          )}

          {books.length > 0 && (
            <InView className={articles.length > 0 ? "mt-14 md:mt-16" : ""}>
              <h3 className="rise label text-stone">{booksHeading}</h3>
              <ul className="stagger mt-5">
                {books.map((b) => (
                  <li key={b.title} className="relative border-t border-line last:border-b">
                    <BookRow item={b} />
                  </li>
                ))}
              </ul>
            </InView>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ item, index, cta }: { item: Publication; index: number; cta: string }) {
  const linked = Boolean(item.url);
  const inner = (
    <span className="grid grid-cols-[2rem_1fr] gap-x-4 py-6 md:grid-cols-[2.5rem_1fr_auto] md:gap-x-6 md:py-7">
      <span
        className={`label pt-1.5 text-stone tabular-nums ${linked ? "transition-colors duration-(--duration-ui) group-hover:text-ink group-focus-visible:text-ink" : ""}`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={`min-w-0 ${linked ? "lean" : ""}`}>
        <span className="display t-h3 block">{item.title}</span>
        {item.subtitle && <span className="t-body mt-1.5 block text-stone">{item.subtitle}</span>}
        <span className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-stone">
          <span className="text-[0.9375rem] font-medium">{item.publication}</span>
          {item.date && <span className="label tabular-nums">{item.date}</span>}
        </span>
        {!item.verified && <ConfirmTag className="mt-3" />}
      </span>
      {linked && (
        <span className="col-start-2 mt-4 flex items-center gap-3 md:col-start-auto md:mt-0 md:self-center">
          <span className="text-[0.875rem] font-medium whitespace-nowrap">{cta}</span>
          <ArrowCircle direction="up-right" className="size-9" iconClassName="size-3.5" />
        </span>
      )}
    </span>
  );
  if (!linked) return inner;
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="group relative block">
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
      <span aria-hidden className="rule-over" />
    </a>
  );
}

function BookRow({ item }: { item: Publication }) {
  const title = <span className="display t-h3 block">{item.title}</span>;
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-5 md:py-6">
      <span className="min-w-0">
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-draw">
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          title
        )}
        <span className="mt-1.5 block text-[0.9375rem] text-stone">
          {item.publication}
          {item.date && <span className="whitespace-nowrap"> · {item.date}</span>}
        </span>
      </span>
      {!item.verified && <ConfirmTag />}
    </div>
  );
}
