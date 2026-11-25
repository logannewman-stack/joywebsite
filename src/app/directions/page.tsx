import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: site.showPlaceholders ? "Opening-screen directions" : "Page not found",
  robots: { index: false, follow: false },
};

type Key = "a" | "b" | "c";

const directions: {
  key: Key;
  name: string;
  tag: string;
  idea: string;
  image: string;
  strengths: string[];
  tradeoffs: string[];
}[] = [
  {
    key: "a",
    name: "Editorial White",
    tag: "Quietest",
    idea: "The brief’s own starting point, executed with restraint. A white page, an oversized serif headline, and one strong portrait set off-axis. Typography does the work; the photograph confirms the person.",
    image: "JVH-155: black suit, arms crossed. The black jacket separates cleanly on white, and the composition leaves the left side for the headline. The portrait now runs the full height of the opening screen; on phones it follows the headline. A black-and-white version is ready.",
    strengths: [
      "Most readable and fastest to load, especially on phones.",
      "Lets the color photography in the four pathways below carry the energy.",
      "Calm, confident and durable; it will not date quickly.",
    ],
    tradeoffs: [
      "The quietest first impression of the three.",
      "On a phone the portrait follows the headline, so only part of it is on the first screen.",
      "Less sense of stage presence than Direction B.",
    ],
  },
  {
    key: "b",
    name: "Black Stage",
    tag: "Recommended",
    idea: "The drama of Alexandria Ohlinger’s photo-led opening: a large photograph on a black stage, bleeding off the right edge, with the headline set over the black.",
    image: "JVH-111: black suit, seated on dark steps, direct and warm. The grey steps separate the black jacket from the black stage; phones get a taller crop of the same frame. A black-and-white version is ready. The layered cutout (JVH-130) stays available as an option until a retouched matte exists.",
    strengths: [
      "The most memorable and personal first screen.",
      "She is on the first screen at every size, phones included.",
      "The black stage and white type set the first impression the brief asks for; her photograph brings the color.",
    ],
    tradeoffs: [
      "A black opening on a mostly white site needs a clear move into the first white section.",
      "It shows her rather than the room; stage presence comes from the Speaking photographs.",
    ],
  },
  {
    key: "c",
    name: "Ivory & the Room",
    tag: "Warmest",
    idea: "Warmth first. An ivory ground, a color photograph from a real workshop room, and blush used once, as a single block behind the image.",
    image: "54707956836: teaching a hands-on session in a warm, naturally lit room; she is mid-gesture rather than posed.",
    strengths: [
      "The most approachable and immediately human.",
      "Shows the work in context from the first second.",
      "Blush reads as personal without becoming the page color.",
    ],
    tradeoffs: [
      "Least distinctive; closer to many speaker sites.",
      "She is small in the frame, and on a phone the photograph starts low on the first screen.",
      "Mid-gesture, so the expression is less composed than a portrait.",
    ],
  },
];

/** Opens one direction on its own page, at full screen. */
function OpenLink({ dir, children, className = "" }: { dir: Key; children: ReactNode; className?: string }) {
  return (
    <a
      href={`/directions/${dir}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex min-h-11 items-center gap-1.5 text-[0.875rem] font-medium ${className}`}
    >
      <span className="link-draw">{children}</span>
      <ArrowUpRight className="size-4 transition-transform duration-(--duration-ui) ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export default function DirectionsPage() {
  // Review only: gone at launch.
  if (!site.showPlaceholders) notFound();
  const current = site.homeHero.toUpperCase();
  const others = directions
    .map((d) => d.key.toUpperCase())
    .filter((k) => k !== current)
    .join(" or ");

  return (
    <>
      <section className="border-b border-line bg-paper pt-[4.75rem]">
        <div className="mx-auto max-w-(--wrap) px-5 py-16 md:px-10 md:py-24">
          <p className="label text-stone">For review · Not part of the public site</p>
          <h1 className="display t-hero mt-6 max-w-4xl">Three directions for the opening screen.</h1>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <p className="text-[1rem] leading-relaxed text-stone">
              Each direction uses the approved Home copy unchanged. Photographs are from the supplied shoot and event folders; the original
              filename is noted under each direction.
            </p>
            <p className="text-[1rem] leading-relaxed text-stone">
              Home uses <strong className="font-medium text-ink">Direction {current}</strong>. Moving to {others} is a quick change once you
              choose.
            </p>
            <nav aria-label="Directions" className="flex flex-col gap-2">
              {directions.map((d) => (
                <a key={d.key} href={`#direction-${d.key}`} className="link-draw self-start text-[1rem] font-medium">
                  {d.key.toUpperCase()}. {d.name}
                  {d.key === "b" && <span className="label ml-2 text-stone">{d.tag}</span>}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* The first screen on a phone, side by side. */}
      <section className="border-b border-line bg-paper" aria-labelledby="phones-heading">
        <div className="mx-auto max-w-(--wrap) px-5 py-14 md:px-10 md:py-20">
          <h2 id="phones-heading" className="label text-stone">
            On a phone
          </h2>
          {/* relative: keeps the visually hidden link text inside this scrolling row (it is absolutely positioned). */}
          <div className="relative -mx-5 mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0 lg:justify-between">
            {directions.map((d) => (
              <figure key={d.key} className="shrink-0 snap-start">
                <div
                  inert
                  className="box-content h-[38rem] w-[17.5625rem] overflow-hidden rounded-[1.875rem] border-[0.375rem] border-ink bg-ink shadow-[0_24px_60px_-30px_rgba(11,11,11,0.45)]"
                >
                  <iframe
                    src={`/directions/${d.key}`}
                    title={`Direction ${d.key.toUpperCase()}, ${d.name}, on a phone`}
                    loading="lazy"
                    className="block h-[52.75rem] w-[24.375rem] origin-top-left scale-[0.72] border-0 bg-paper"
                  />
                </div>
                <figcaption className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-[0.9375rem] font-medium">
                    {d.key.toUpperCase()}. {d.name}
                    {d.key === site.homeHero && <span className="label ml-2 text-stone">Home</span>}
                  </span>
                  <OpenLink dir={d.key}>Open</OpenLink>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {directions.map(({ key, name, tag, idea, image, strengths, tradeoffs }) => (
        <section key={key} id={`direction-${key}`} aria-labelledby={`direction-${key}-heading`}>
          <div className="border-b border-ink bg-paper">
            <div className="mx-auto flex max-w-(--wrap) flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 md:px-10">
              <h2 id={`direction-${key}-heading`} className="label">
                Direction {key.toUpperCase()} · {name}
              </h2>
              <div className="flex items-center gap-6">
                <p className={`label ${key === "b" ? "text-ink" : "text-stone"}`}>
                  {tag}
                  {key === site.homeHero && " · Home uses this"}
                </p>
                <OpenLink dir={key}>Open full screen</OpenLink>
              </div>
            </div>
          </div>
          {/* The real opening screen at this width (desktop and tablet). Phones are compared above. */}
          <div inert className="hidden bg-ink md:block">
            <iframe
              src={`/directions/${key}`}
              title={`Direction ${key.toUpperCase()}, ${name}, opening screen`}
              loading="lazy"
              className="mx-auto block aspect-[16/10] w-full max-w-(--wrap) border-0 bg-paper"
            />
          </div>
          <div className="border-b border-line bg-paper">
            <div className="mx-auto grid max-w-(--wrap) gap-10 px-5 py-14 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-20">
              <div className="md:col-span-5">
                <p className="label text-stone">Rationale</p>
                <p className="t-lead mt-4">{idea}</p>
                <p className="label mt-8 text-stone">Image selection</p>
                <p className="mt-3 text-[1rem] leading-relaxed">{image}</p>
              </div>
              <div className="md:col-span-3 md:col-start-7">
                <p className="label text-stone">Strengths</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {strengths.map((s) => (
                    <li key={s} className="border-t border-line pt-3 text-[0.96875rem] leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3">
                <p className="label text-stone">Tradeoffs</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {tradeoffs.map((s) => (
                    <li key={s} className="border-t border-line pt-3 text-[0.96875rem] leading-relaxed text-stone">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
