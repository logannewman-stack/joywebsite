import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { notes } from "@/content/site";
import { InView } from "@/components/motion/InView";
import { typeset } from "@/components/ui/Typeset";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { DetailsLink } from "./DetailsLink";
import { keepCompounds } from "@/components/ui/keepCompounds";

type Course = { title: string; text: string; pdf: string | null };

/** Delay for an entrance inside an InView (sets --d, in seconds). */
const d = (seconds: number) => ({ "--d": `${seconds.toFixed(2)}s` }) as CSSProperties;

const rule = "rule-draw absolute inset-x-0 block h-px bg-line";

/**
 * Featured Clinical Courses as a living program: one row per course between
 * thin lines, so the list scans like a contents page rather than a card grid.
 * Each row has its number, the title with its one-line description under it,
 * and on the right the course-detail PDF and the inquiry link. The PDF links
 * start on one edge and the inquiry links end on another, row after row.
 *
 * Rows enter one after another as they are seen, each under a line that draws
 * itself from the left. With a mouse or the keyboard a row answers as one
 * object (styles in speaking.css, under "Course index"): a soft grey band
 * sweeps in behind it, its number gives way to an arrow, the title and its
 * description lean in, the two actions go from grey to ink, and the titles of
 * the other rows step back. On touch screens nothing waits for hover: the
 * actions are ink.
 */
export function CourseIndex({ courses, className = "" }: { courses: Course[]; className?: string }) {
  return (
    <div className={className}>
      <ol className="sp-courses">
        {courses.map((c, i) => {
          // Rows that arrive together (an anchor jump shows several at once) still enter in order.
          const base = Math.min(i, 5) * 0.06;
          return (
            <InView as="li" key={c.title} className="sp-course relative">
              <span aria-hidden className="sp-course-band" />
              <span aria-hidden className={`${rule} top-0`} style={d(base)} />
              <div className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-6 md:grid-cols-[3rem_minmax(0,1fr)] md:py-7 lg:grid-cols-12 lg:gap-x-6">
                {/* The number sits on the title's baseline. */}
                <span className="rise label pt-[0.3125rem] text-stone tabular-nums lg:col-span-1" style={d(base)} aria-hidden>
                  <span className="sp-course-mark">
                    <span className="sp-course-digits">{String(i + 1).padStart(2, "0")}</span>
                    <ArrowRight className="sp-course-arrow" />
                  </span>
                </span>
                <div className="rise lg:col-span-7" style={d(base + 0.05)}>
                  <div className="sp-course-lean">
                    <h3 className="sp-course-title display t-h3">{typeset(c.title)}</h3>
                    <p className="t-body mt-2 max-w-[36rem] text-stone">{keepCompounds(c.text)}</p>
                  </div>
                </div>
                {/* Two cells: the PDF link starts the first, the inquiry link ends the second. On desktop the links' text sits on the title's line. */}
                <div className="rise col-start-2 mt-2 lg:col-span-4 lg:col-start-9 lg:-mt-2" style={d(base + 0.12)}>
                  <div className="sp-course-actions grid grid-cols-[auto_auto] items-center justify-start gap-x-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:justify-normal lg:gap-x-6">
                    {c.pdf ? (
                      <DetailsLink pdf={c.pdf} title={c.title} className="justify-self-start" metaClassName="max-sm:hidden lg:max-xl:hidden" />
                    ) : (
                      notes && (
                        <p className="label inline-block justify-self-start border border-dashed border-ink/25 px-2.5 py-1 leading-relaxed text-stone lg:mt-2">
                          Course details: updated PDF pending
                        </p>
                      )
                    )}
                    <InquiryButton program={c.title} variant="text" className="lg:col-start-2">
                      Inquire<span className="sr-only"> about {c.title}</span>
                    </InquiryButton>
                  </div>
                </div>
              </div>
              {/* The line that closes the list. */}
              {i === courses.length - 1 && <span aria-hidden className={`${rule} bottom-0`} style={d(base + 0.2)} />}
            </InView>
          );
        })}
      </ol>
    </div>
  );
}
