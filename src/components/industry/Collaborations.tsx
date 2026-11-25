import Image from "next/image";
import type { CSSProperties } from "react";
import { notes } from "@/content/site";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";

type Vars = CSSProperties & Record<`--${string}`, string>;

/** The row never holds more than five marks: this is not a logo wall. */
const MAX = 5;

/** On phones the row becomes two columns; an odd last cell takes the full width. Each cell carries the line under its row. */
function cell(i: number, n: number) {
  const lastOdd = n % 2 === 1 && i === n - 1;
  return [
    "relative flex h-28 items-center justify-center border-b border-line md:h-36",
    lastOdd ? "col-span-2" : "",
    "sm:col-span-1 sm:flex-1",
  ].join(" ");
}

/**
 * Selected Industry Collaborations: a short, single row of cleared
 * manufacturer logos with room around each, shown in their own one-color
 * artwork between two thin lines, like one row of a ledger. Never a wall: at
 * most five. Hidden at launch until logos are cleared; in review mode the row
 * is held by five numbered slots, so the finished composition can be judged
 * before any logo arrives.
 */
export function Collaborations({ heading, logos }: { heading: string; logos: { name: string; src: string }[] }) {
  if (logos.length === 0 && !notes) return null;
  const shown = logos.slice(0, MAX);
  const empty = shown.length === 0;
  const count = empty ? MAX : shown.length;
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">
        <h2 className="display t-h1">
          <WordRise>{heading}</WordRise>
        </h2>
        <InView className="mt-10 md:mt-14">
          <ul className="stagger grid grid-cols-2 border-t border-line sm:flex">
            {empty
              ? Array.from({ length: MAX }, (_, i) => (
                  <li key={i} className={`${cell(i, count)} flex-col gap-3`}>
                    <span aria-hidden className="block h-7 w-20 rounded-[2px] border border-dashed border-ink/30 md:h-8 md:w-24" />
                    <span className="label text-stone tabular-nums">Logo {String(i + 1).padStart(2, "0")}</span>
                  </li>
                ))
              : shown.map((l, i) => (
                  <li key={l.name} className={cell(i, count)}>
                    <Image src={l.src} alt={l.name} fill sizes="(max-width: 639px) 45vw, (max-width: 1440px) 230px, 16vw" className="object-contain px-8 py-9 md:px-10 md:py-11" />
                  </li>
                ))}
          </ul>
          {empty && (
            <p className="rise label mt-5 leading-relaxed text-balance text-stone" style={{ "--d": "0.35s" } as Vars}>
              Review: approved manufacturer logos only, up to five in one row, after clearance
            </p>
          )}
        </InView>
      </div>
    </section>
  );
}
