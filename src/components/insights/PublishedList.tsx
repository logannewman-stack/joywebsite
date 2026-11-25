import type { CSSProperties } from "react";
import type { Publication } from "@/content/insights";
import { notes } from "@/content/site";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { ArrowCircle } from "@/components/industry/ArrowCircle";
import { ConfirmTag } from "./records";

type Vars = CSSProperties & Record<`--${string}`, string>;

/** A hairline under a row that draws in, each a little after the one above. */

/**
 * Published Articles: an editorial index of work in dental publications, each
 * linking to the original. Book contributions sit apart under Published Work.
 *
 * The rows rise one after another, set apart by space alone (no lines). A row
 * with a link answers as one on hover and focus: a soft wash rises behind it,
 * the title leans in, the number darkens and the arrow travels.
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
      <div className="mx-auto grid max-w-(--wrap) grid-cols-1 gap-y-12 px-5 py-24 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-x-6 lg:pt-32 lg:pb-36">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <h2 className="display text-[clamp(2.6rem,4.6vw,4.4rem)]">
            <WordRise>{heading}</WordRise>
          </h2>
          <InView>
            <p className="rise mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-stone" style={{ "--d": "0.12s" } as Vars}>
              {intro}
            </p>
            {notes && toConfirm > 0 && (
              <p className="rise label mt-6 inline-block rounded-full border border-ink/25 px-2.5 py-1 !text-[0.59375rem] text-stone" style={{ "--d": "0.2s" } as Vars}>
                Review: {toConfirm} {toConfirm === 1 ? "record" : "records"} to confirm
              </p>
            )}
          </InView>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {articles.length > 0 && (
            <InView>
              <ol className="stagger">
                {articles.map((a, i) => (
                  <li key={a.title} className="relative">
                    <Row item={a} index={i} cta={cta} />
                  </li>
                ))}
              </ol>
            </InView>
          )}

          {books.length > 0 && (
            <InView className={articles.length > 0 ? "mt-16 md:mt-20" : ""}>
              <h3 className="rise label text-stone">{booksHeading}</h3>
              <ul className="stagger">
                {books.map((b) => (
                  <li key={b.title} className="relative">
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
    <span className="grid grid-cols-[2rem_1fr] gap-x-4 py-6 md:grid-cols-[2.5rem_1fr_auto] md:gap-x-6 md:py-8">
      <span
        className={`label pt-2 text-stone tabular-nums ${linked ? "transition-colors duration-(--duration-ui) group-hover:text-ink group-focus-visible:text-ink" : ""}`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={`min-w-0 ${linked ? "lean" : ""}`}>
        <span className="block font-display text-[1.5rem] leading-[1.12] md:text-[1.875rem]">{item.title}</span>
        {item.subtitle && <span className="mt-1.5 block font-display text-[1.0625rem] leading-snug text-stone italic md:text-[1.125rem]">{item.subtitle}</span>}
        <span className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-[1.0625rem] text-ink/80 italic">{item.publication}</span>
          {item.date && <span className="label text-stone tabular-nums">{item.date}</span>}
        </span>
        {!item.verified && <ConfirmTag className="mt-3" />}
      </span>
      {linked && (
        <span className="col-start-2 mt-5 flex items-center gap-3 md:col-start-auto md:mt-0 md:self-center">
          <span className="text-[0.875rem] font-medium whitespace-nowrap">{cta}</span>
          <ArrowCircle direction="up-right" className="size-10 md:size-11" iconClassName="size-4" />
        </span>
      )}
    </span>
  );
  if (!linked)
    return (
      <>
        {inner}
      </>
    );
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="group relative block">
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
      <span aria-hidden className="rule-over" />
    </a>
  );
}

function BookRow({ item }: { item: Publication }) {
  const title = <span className="block font-display text-[1.375rem] leading-tight italic md:text-[1.5rem]">{item.title}</span>;
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
        <span className="mt-1.5 block text-[0.90625rem] text-stone">
          {item.publication}
          {item.date && <span className="whitespace-nowrap"> · {item.date}</span>}
        </span>
      </span>
      {!item.verified && <ConfirmTag />}
    </div>
  );
}
