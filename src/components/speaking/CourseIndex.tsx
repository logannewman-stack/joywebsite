import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { InView } from "@/components/motion/InView";
import { typeset } from "@/components/ui/Typeset";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { DetailsLink } from "./DetailsLink";

type Course = { title: string; text: string; pdf: string | null };

/** Delay for an entrance inside an InView (sets --d, in seconds). */
const d = (seconds: number) => ({ "--d": `${seconds.toFixed(2)}s` }) as CSSProperties;

/**
 * Featured Clinical Courses as a living program: one ruled row per course,
 * number, title, description and the course-detail PDF on shared columns, so
 * the list scans like a contents page rather than a card grid.
 *
 * Rows enter one after another as they are seen, each rule drawing itself.
 * With a mouse or the keyboard a row answers as one object (styles in
 * speaking.css, under "Course index"): a soft band sweeps in behind it, its
 * rule fills with gold, its number gives way to a gold arrow, the title leans
 * in and the two actions go from grey to ink. On touch screens nothing waits
 * for hover: the actions are ink.
 */
export function CourseIndex({ courses, className = "" }: { courses: Course[]; className?: string }) {
  return (
    <div className={className}>
      <InView>
        <span aria-hidden className="rule-draw block h-px bg-gold-deep" />
      </InView>
      <ol className="sp-courses">
        {courses.map((c, i) => {
          // Rows that arrive together (an anchor jump shows several at once) still enter in order.
          const base = Math.min(i, 5) * 0.06;
          return (
            <InView as="li" key={c.title} className="sp-course relative">
              <span aria-hidden className="sp-course-band" />
              {/* --t is the title size; the number and the description sit on the title's first baseline (0.81em down). */}
              <div className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-8 [--t:clamp(2rem,3.5vw,3.15rem)] md:grid-cols-[3.5rem_minmax(0,1fr)] md:py-10 lg:grid-cols-12 lg:gap-x-6">
                <span className="rise label pt-[calc(var(--t)*0.81_-_0.8125rem)] text-stone tabular-nums lg:col-span-1" style={d(base)} aria-hidden>
                  <span className="sp-course-mark">
                    <span className="sp-course-digits">{String(i + 1).padStart(2, "0")}</span>
                    <ArrowRight className="sp-course-arrow" />
                  </span>
                </span>
                <h3 className="rise display text-[length:var(--t)] leading-[1.02] lg:col-span-6" style={d(base + 0.05)}>
                  <span className="sp-course-title">{typeset(c.title)}</span>
                </h3>
                <div
                  className="rise col-start-2 mt-4 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0 lg:pt-[calc(var(--t)*0.81_-_1.125rem)]"
                  style={d(base + 0.12)}
                >
                  <p className="max-w-[46ch] text-[1rem] leading-relaxed text-stone">{c.text}</p>
                  <div className="sp-course-actions mt-3 flex flex-wrap items-center gap-x-5 sm:gap-x-7">
                    {c.pdf ? (
                      <DetailsLink pdf={c.pdf} title={c.title} />
                    ) : (
                      site.showPlaceholders && (
                        <p className="label inline-block border border-dashed border-ink/25 px-2.5 py-1 !text-[0.59375rem] leading-relaxed text-stone">
                          Course details: updated PDF pending
                        </p>
                      )
                    )}
                    <InquiryButton program={c.title} variant="text">
                      Inquire<span className="sr-only"> about {c.title}</span>
                    </InquiryButton>
                  </div>
                </div>
              </div>
              <span aria-hidden className="sp-course-rule rule-draw" style={d(base)} />
              <span aria-hidden className="sp-course-fill" />
            </InView>
          );
        })}
      </ol>
    </div>
  );
}
