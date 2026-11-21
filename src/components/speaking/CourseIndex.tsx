import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";
import { DetailsLink } from "./DetailsLink";

type Course = { title: string; text: string; pdf: string | null };

/**
 * Featured Clinical Courses as an editorial index: one ruled row per course,
 * number, title, description and the course-detail PDF on shared columns,
 * so the list scans like a contents page rather than a card grid.
 */
export function CourseIndex({ courses, className = "" }: { courses: Course[]; className?: string }) {
  return (
    <ol className={`border-t border-ink ${className}`}>
      {courses.map((c, i) => (
        <li key={c.title} className="border-b border-line">
          <Reveal y={10} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-8 md:grid-cols-[3.5rem_minmax(0,1fr)] md:py-10 lg:grid-cols-12 lg:gap-x-6">
            <span className="label pt-[0.55rem] text-stone tabular-nums md:pt-[0.9rem] lg:col-span-1" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="display text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.02] lg:col-span-6">{typeset(c.title)}</h3>
            <div className="col-start-2 mt-4 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0 lg:pt-[0.45rem]">
              <p className="max-w-[46ch] text-[16px] leading-relaxed text-stone">{c.text}</p>
              {c.pdf ? (
                <DetailsLink pdf={c.pdf} title={c.title} className="mt-3" />
              ) : (
                site.showPlaceholders && (
                  <p className="label mt-4 inline-block border border-dashed border-ink/25 px-2.5 py-1 !text-[9.5px] leading-relaxed text-stone">
                    Course details: updated PDF pending
                  </p>
                )
              )}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
