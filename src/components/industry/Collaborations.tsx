import Image from "next/image";
import { site } from "@/content/site";
import { ReviewSlot } from "@/components/ui/Links";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Selected Industry Collaborations: a short, single row of cleared
 * manufacturer logos with room around each, shown in their own one-color
 * artwork. Never a wall: at most five. Hidden at launch until logos are cleared.
 */
export function Collaborations({ heading, logos }: { heading: string; logos: { name: string; src: string }[] }) {
  if (logos.length === 0 && !site.showPlaceholders) return null;
  const shown = logos.slice(0, 5);
  return (
    <section className="bg-paper">
      <div className="mx-auto grid grid-cols-1 max-w-[1440px] gap-y-10 px-5 pt-24 md:px-10 md:pt-28 lg:grid-cols-12 lg:gap-x-6 lg:pt-36">
        <Reveal className="lg:col-span-4">
          <h2 className="display max-w-[14ch] text-[clamp(2.2rem,3.4vw,3.2rem)] leading-[1]">{heading}</h2>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-8 lg:self-end">
          {shown.length > 0 ? (
            <ul className="grid grid-cols-2 border-t border-line sm:flex sm:border-y">
              {shown.map((l) => (
                <li key={l.name} className="relative h-28 border-b border-line odd:border-r sm:flex-1 sm:border-b-0 sm:odd:border-r-0 sm:[&:not(:first-child)]:border-l md:h-32">
                  <Image src={l.src} alt={l.name} fill sizes="(max-width: 639px) 45vw, 220px" className="object-contain px-8 py-9 md:px-10 md:py-9" />
                </li>
              ))}
            </ul>
          ) : (
            <ReviewSlot className="min-h-32">
              <span className="block text-balance">Approved manufacturer logos only, up to five in one row, after clearance</span>
            </ReviewSlot>
          )}
        </Reveal>
      </div>
    </section>
  );
}
