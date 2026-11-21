import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";

type Group = { title: string; items: string[] };

/** "Role, Organization" → ["Role", "Organization"] at the first comma, or the last one. */
function split(item: string, at: "first" | "last"): [string, string] {
  const cut = at === "first" ? item.indexOf(", ") : item.lastIndexOf(", ");
  return cut > 0 ? [item.slice(0, cut), item.slice(cut + 2)] : [item, ""];
}

/** Keeps the approved comma for screen readers, search and copy-paste where the layout breaks the line there. */
const Comma = () => <span className="sr-only">, </span>;

function GroupBlock({
  title,
  className = "",
  listClassName = "",
  delay = 0,
  children,
}: {
  title: string;
  className?: string;
  listClassName?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <h3 className="label border-b border-blush/45 pb-4 text-white/70">{title}</h3>
      <ul className={listClassName}>{children}</ul>
    </Reveal>
  );
}

/**
 * Education, Leadership, and Service, set on black. Approved wording and
 * order are unchanged; only emphasis changes: degrees and ventures are set in
 * the display serif, leadership roles read as one line with the organization
 * carrying the weight.
 */
export function Credentials({ heading, groups }: { heading: string; groups: Group[] }) {
  const [education, leadership, built] = groups;
  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32">
      <Reveal>
        <h2 className="display max-w-[11em] text-[clamp(2.75rem,5.4vw,5.25rem)] leading-[0.95]">{heading}</h2>
      </Reveal>

      <div className="mt-14 grid gap-x-10 gap-y-16 md:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-20">
        <GroupBlock title={education.title} className="lg:col-span-5">
          {education.items.map((item) => {
            const [degree, school] = split(item, "last");
            return (
              <li key={item} className="border-b border-line-dark py-5 text-pretty md:py-6">
                <span className="display block text-[clamp(1.75rem,2.35vw,2.2rem)] leading-[1.05] text-white">{degree}</span>
                <Comma />
                <span className="mt-2 block text-[14px] leading-snug text-ash">{school}</span>
              </li>
            );
          })}
        </GroupBlock>

        <GroupBlock title={leadership.title} delay={0.06} className="lg:col-span-6 lg:col-start-7">
          {leadership.items.map((item) => {
            const [role, organization] = split(item, "first");
            return (
              <li key={item} className="border-b border-line-dark py-3.5 text-[16px] leading-snug text-pretty md:py-[1.05rem] md:text-[17px]">
                <span className="text-ash">{role},</span> <span className="text-white">{organization}</span>
              </li>
            );
          })}
        </GroupBlock>

        <GroupBlock title={built.title} delay={0.12} className="md:col-span-2 lg:col-span-12" listClassName="md:grid md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-6">
          {built.items.map((item) => {
            const [name, role] = split(item, "last");
            return (
              <li key={item} className="border-b border-line-dark py-5 text-pretty md:py-6 lg:border-b-0 lg:pt-8 lg:pb-0">
                <span className="display block text-[clamp(2rem,3vw,2.9rem)] leading-[1.02] text-white">{typeset(name)}</span>
                <Comma />
                <span className="label mt-3 block text-ash">{role}</span>
              </li>
            );
          })}
        </GroupBlock>
      </div>
    </div>
  );
}
