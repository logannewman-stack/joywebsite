import type { ReactNode } from "react";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { typeset } from "@/components/ui/Typeset";

type Group = { title: string; items: string[] };

/** "Role, Organization" → ["Role", "Organization"] at the first comma, or the last one. */
function split(item: string, at: "first" | "last"): [string, string] {
  const cut = at === "first" ? item.indexOf(", ") : item.lastIndexOf(", ");
  return cut > 0 ? [item.slice(0, cut), item.slice(cut + 2)] : [item, ""];
}

/** Keeps the approved comma for screen readers, search and copy-paste where the layout breaks the line there. */
const Comma = () => <span className="sr-only">, </span>;

/**
 * One group of the chapter, under a thin line. On desktop its title holds its
 * place in the left margin (plain position: sticky) while the list scrolls
 * past on the right.
 */
function GroupBlock({ title, children, gap = "gap-6 lg:gap-7" }: { title: string; children: ReactNode; gap?: string }) {
  return (
    <div className="border-t border-line-dark pt-6 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pt-8">
      <div className="lg:col-span-4">
        <InView className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
          <h3 className="label rise text-ash">{title}</h3>
        </InView>
      </div>
      <ul className={`mt-5 flex flex-col lg:col-span-8 lg:mt-0 ${gap}`}>{children}</ul>
    </div>
  );
}

/** A list row that lifts in when it is seen. Rows that arrive together follow one another by a few hundredths of a second. */
function Row({ index, children }: { index: number; children: ReactNode }) {
  return (
    <InView as="li" delay={Math.min(index, 4) * 0.05}>
      <div className="rise text-pretty">{children}</div>
    </InView>
  );
}

/** A name in the heading face with a quieter line under it: a degree and its school, a venture and her part in it. */
function Titled({ title, detail }: { title: string; detail: string }) {
  return (
    <>
      <span className="display t-h3 block text-white">{typeset(title)}</span>
      <Comma />
      {/* The approved text is lower case where it follows a comma ("Jell-Ed, co-founder"); on its own line it takes a capital, in style only. */}
      <span className="mt-1.5 block text-[0.9375rem] leading-snug text-ash first-letter:uppercase">{detail}</span>
    </>
  );
}

/**
 * Education, Leadership, and Service: the page's black chapter. Approved
 * wording and order are unchanged. Three groups, each under a thin line with
 * its label in the left margin: degrees and what she has built are set as a
 * name with a quieter line under it; leadership roles read as a ledger, the
 * role in grey and the organization in white.
 */
export function Credentials({ heading, groups }: { heading: string; groups: Group[] }) {
  const [education, leadership, built] = groups;
  return (
    <section data-header="dark" className="meet-creds grain grain-light bg-ink text-white">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">
        <h2 className="display t-h1 max-w-[14em]">
          <WordRise>{heading}</WordRise>
        </h2>

        <div className="mt-12 flex flex-col gap-12 md:mt-16 md:gap-16">
          <GroupBlock title={education.title}>
            {education.items.map((item, i) => {
              const [degree, school] = split(item, "last");
              return (
                <Row key={item} index={i}>
                  <Titled title={degree} detail={school} />
                </Row>
              );
            })}
          </GroupBlock>

          <GroupBlock title={leadership.title} gap="gap-4 lg:gap-[1.125rem]">
            {leadership.items.map((item, i) => {
              const [role, organization] = split(item, "first");
              return (
                <Row key={item} index={i}>
                  <div className="t-body sm:grid sm:grid-cols-8 sm:items-baseline sm:gap-x-6">
                    <span className="text-ash sm:col-span-3">
                      {role}
                      <span className="sm:sr-only">,</span>
                    </span>{" "}
                    <span className="font-medium text-white sm:col-span-5">{organization}</span>
                  </div>
                </Row>
              );
            })}
          </GroupBlock>

          <GroupBlock title={built.title}>
            {built.items.map((item, i) => {
              const [name, role] = split(item, "last");
              return (
                <Row key={item} index={i}>
                  <Titled title={name} detail={role} />
                </Row>
              );
            })}
          </GroupBlock>
        </div>
      </div>
    </section>
  );
}
