import type { CSSProperties } from "react";
import { notes } from "@/content/site";
import { InView } from "@/components/motion/InView";
import { typeset } from "@/components/ui/Typeset";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";
import { DetailsLink } from "./DetailsLink";

type Course = { title: string; text: string; pdf: string | null };

/** Delay for an entrance inside an InView (sets --d, in seconds). */
const d = (seconds: number) => ({ "--d": `${seconds.toFixed(2)}s` }) as CSSProperties;

/**
 * Featured Clinical Courses as a program: one row per course between thin
 * lines, so the list scans like a contents page rather than a card grid.
 * Each row has its number, the title with its one-line description under it,
 * and on the right the course-detail PDF and the inquiry link. The PDF links
 * start on one edge and the inquiry links end on another, row after row.
 *
 * Rows enter one after another as they are seen. With a mouse, the titles of
 * the other rows step back to grey while one row is pointed at, so its links
 * at the far end of the row are easy to follow (speaking.css, "Course index").
 */
export function CourseIndex({ courses, className = "" }: { courses: Course[]; className?: string }) {
  return (
    <div className={className}>
      <ol className="sp-courses border-b border-line">
        {courses.map((c, i) => {
          // Rows that arrive together (an anchor jump shows several at once) still enter in order.
          const base = Math.min(i, 5) * 0.06;
          return (
            <InView as="li" key={c.title} className="sp-course border-t border-line">
              <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-6 md:grid-cols-[3rem_minmax(0,1fr)] md:py-7 lg:grid-cols-12 lg:gap-x-6">
                {/* The number sits on the title's baseline. */}
                <span className="rise label pt-[0.3125rem] text-stone tabular-nums lg:col-span-1" style={d(base)} aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="rise lg:col-span-7" style={d(base + 0.05)}>
                  <h3 className="sp-course-title display t-h3">{typeset(c.title)}</h3>
                  <p className="t-body mt-2 max-w-[36rem] text-stone">{c.text}</p>
                </div>
                {/* Two cells: the PDF link starts the first, the inquiry link ends the second. On desktop the links' text sits on the title's line. */}
                <div
                  className="rise col-start-2 mt-2 grid grid-cols-[auto_auto] items-center justify-start gap-x-7 lg:col-span-4 lg:col-start-9 lg:-mt-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:justify-normal lg:gap-x-6"
                  style={d(base + 0.12)}
                >
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
            </InView>
          );
        })}
      </ol>
    </div>
  );
}
