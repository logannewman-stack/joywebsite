import type { CSSProperties, ReactNode } from "react";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { typeset } from "@/components/ui/Typeset";

type Group = { title: string; items: string[] };
type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** "Role, Organization" → ["Role", "Organization"] at the first comma, or the last one. */
function split(item: string, at: "first" | "last"): [string, string] {
  const cut = at === "first" ? item.indexOf(", ") : item.lastIndexOf(", ");
  return cut > 0 ? [item.slice(0, cut), item.slice(cut + 2)] : [item, ""];
}

/** Keeps the approved comma for screen readers, search and copy-paste where the layout breaks the line there. */
const Comma = () => <span className="sr-only">, </span>;

/**
 * One group of the chapter. On desktop its title holds its place in the left
 * margin (plain position: sticky) while the list scrolls past on the right.
 * The blush rule above it draws itself when the group is first seen.
 */
function GroupBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative pt-5 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pt-7">
      <InView className="absolute inset-x-0 top-0">
        <span aria-hidden className="rule-draw block h-px bg-blush/45" />
      </InView>
      <div className="lg:col-span-4">
        <InView className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
          <h3 className="label rise text-white/70">{title}</h3>
        </InView>
      </div>
      <ul className="mt-3 lg:col-span-8 lg:-mt-7">{children}</ul>
    </div>
  );
}

/**
 * A list row that enters when it is seen: its words lift in and the hairline
 * under it draws from the left. Rows that arrive together (a jump down the
 * page) follow one another by a few hundredths of a second.
 */
function Row({ index, children }: { index: number; children: ReactNode }) {
  return (
    <InView as="li" className="relative" delay={Math.min(index, 4) * 0.05}>
      <div className="rise">{children}</div>
      <span aria-hidden className="rule-draw absolute inset-x-0 bottom-0 block h-px bg-line-dark" />
    </InView>
  );
}

/**
 * Education, Leadership, and Service: the page's black chapter. Approved
 * wording and order are unchanged; only emphasis changes. Degrees are set in
 * the display serif; leadership roles read as a ledger with the organization
 * carrying the weight; "What I've Built" closes the chapter as an ivory band.
 *
 * The section's background starts as a veil (clear to black) that lies over
 * the foot of the staircase photograph above it, so the photograph carries
 * the page into black. See "Staircase and credentials" in meet.css.
 */
export function Credentials({ heading, groups }: { heading: string; groups: Group[] }) {
  const [education, leadership, built] = groups;
  return (
    <section data-header="dark" className="meet-creds grain grain-light text-white">
      <div className="mx-auto max-w-[90rem] px-5 pt-6 md:px-10 md:pt-10">
        <h2 className="display max-w-[11em] text-[clamp(2.75rem,6vw,6rem)] leading-[0.95]">
          <WordRise>{heading}</WordRise>
        </h2>

        <div className="mt-14 flex flex-col gap-16 md:mt-20 lg:mt-24 lg:gap-24">
          <GroupBlock title={education.title}>
            {education.items.map((item, i) => {
              const [degree, school] = split(item, "last");
              return (
                <Row key={item} index={i}>
                  <div className="py-5 text-pretty md:py-6 lg:py-7">
                    <span className="display block text-[clamp(1.75rem,3.1vw,3.1rem)] leading-[1.05] text-white">{degree}</span>
                    <Comma />
                    <span className="mt-2 block text-[0.875rem] leading-snug text-ash lg:mt-3 lg:text-[0.9375rem]">{school}</span>
                  </div>
                </Row>
              );
            })}
          </GroupBlock>

          <GroupBlock title={leadership.title}>
            {leadership.items.map((item, i) => {
              const [role, organization] = split(item, "first");
              return (
                <Row key={item} index={i}>
                  <div className="py-3.5 text-[1rem] leading-snug text-pretty md:py-[1.05rem] md:text-[1.0625rem] lg:grid lg:grid-cols-8 lg:items-baseline lg:gap-x-6 lg:py-5">
                    <span className="text-ash lg:col-span-3 lg:text-[1rem]">
                      {role}
                      <span className="lg:sr-only">,</span>
                    </span>{" "}
                    <span className="text-white lg:col-span-5 lg:font-serif lg:text-[1.875rem] lg:leading-[1.1] lg:tracking-[-0.01em]">{organization}</span>
                  </div>
                </Row>
              );
            })}
          </GroupBlock>
        </div>
      </div>

      {/* What I've Built: the chapter closes on an ivory band that draws across the black. */}
      <InView className="meet-built relative mt-20 md:mt-28 lg:mt-32">
        <span aria-hidden className="rule-draw absolute inset-0 block bg-ivory" />
        <div className="relative mx-auto max-w-[90rem] px-5 py-14 text-ink md:px-10 md:py-20 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:py-24">
          <h3 className="label rise text-stone lg:col-span-4" style={{ "--d": "0.3s" } as Vars}>
            {built.title}
          </h3>
          <ul
            className="stagger mt-8 grid gap-y-8 sm:grid-cols-2 sm:gap-x-10 lg:col-span-8 lg:mt-0 lg:gap-x-6 lg:gap-y-14"
            style={{ "--d": "0.38s" } as Vars}
          >
            {built.items.map((item) => {
              const [name, role] = split(item, "last");
              return (
                <li key={item} className="text-pretty">
                  <span className="display block text-[clamp(2rem,3.4vw,3.4rem)] leading-[1.02]">{typeset(name)}</span>
                  <Comma />
                  <span className="label mt-3 block text-stone">{role}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </InView>
      <div className="h-16 md:h-24" aria-hidden />
    </section>
  );
}
