import type { Metadata } from "next";
import { HeroA, HeroB, HeroC } from "@/components/home/Heroes";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Opening-screen directions",
  robots: { index: false, follow: false },
};

const directions = [
  {
    key: "a",
    Hero: HeroA,
    name: "Editorial Monochrome",
    tag: "Closest to the brief",
    idea: "The brief’s own instinct, executed with restraint. A white page, an oversized serif headline, and one black-and-white portrait set off-axis. Typography does the work; the photograph confirms the person.",
    image: "JVH-155: black suit, arms crossed, converted to black and white. The black jacket separates cleanly on white, and the composition leaves the left side for the headline. Safe to crop to 4:5 on mobile.",
    strengths: [
      "Most readable and fastest to load, especially on phones.",
      "Lets the color photography in the four pathways below carry the energy.",
      "Calm, confident and durable; it will not date quickly.",
    ],
    tradeoffs: [
      "The quietest first impression of the three.",
      "Everything rests on one excellent portrait.",
      "Less sense of stage presence than Direction B.",
    ],
  },
  {
    key: "b",
    Hero: HeroB,
    name: "Black Stage",
    tag: "Boldest",
    idea: "The drama of Alexandria Ohlinger’s photo-led opening, translated into black and white. A background-removed portrait stands in front of the headline: the one designed cutout moment the brief allows.",
    image: "JVH-130: white blazer, background removed and converted to black and white (a black jacket would disappear on black). This is an automated test cutout; a retoucher should refine the hair and jacket edges before launch. Blush carries the closing phrase.",
    strengths: [
      "The most memorable and personal first screen.",
      "Signals keynote presence before a word is read.",
      "Strongest contrast and the clearest point of view.",
    ],
    tradeoffs: [
      "Cutout quality is make-or-break and adds retouching time.",
      "Layered type needs careful crops at every screen size.",
      "A black opening on a mostly white site needs a deliberate transition.",
    ],
  },
  {
    key: "c",
    Hero: HeroC,
    name: "Ivory & Color",
    tag: "Departs from black and white",
    idea: "Warmth first. An ivory ground, a full-color photograph in a real room, and blush used once, as a single block behind the image.",
    image: "54707091267: color stage photograph in the white blazer, mid-gesture. It proves presence in a real room; the purple stage lighting is the one risk against the blush and ivory palette.",
    strengths: [
      "The most approachable and immediately human.",
      "Shows the work in context from the first second.",
      "Blush reads as personal without becoming the page color.",
    ],
    tradeoffs: [
      "Least distinctive; closer to many speaker sites.",
      "Weakens the black-and-white identity the rest of the site builds.",
      "Stage lighting colors compete with the blush and ivory palette.",
    ],
  },
] as const;

export default function DirectionsPage() {
  return (
    <>
      <section className="border-b border-line bg-paper pt-[76px]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <p className="label text-stone">For review · Not part of the public site</p>
          <h1 className="display mt-6 max-w-4xl text-[clamp(2.8rem,6vw,6rem)]">Three directions for the opening screen.</h1>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <p className="text-[16px] leading-relaxed text-stone">
              Each direction uses the approved Home copy unchanged. Photographs are from the supplied shoot and event folders; the original
              filename is noted under each direction.
            </p>
            <p className="text-[16px] leading-relaxed text-stone">
              Home currently uses <strong className="font-medium text-ink">Direction {site.homeHero.toUpperCase()}</strong>. Switching is one
              setting: <code className="text-ink">homeHero</code> in <code className="text-ink">src/content/site.ts</code>.
            </p>
            <nav aria-label="Directions" className="flex flex-col gap-2">
              {directions.map((d) => (
                <a key={d.key} href={`#direction-${d.key}`} className="link-draw self-start text-[16px] font-medium">
                  {d.key.toUpperCase()}. {d.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {directions.map(({ key, Hero, name, tag, idea, image, strengths, tradeoffs }) => (
        <div key={key} id={`direction-${key}`} className="scroll-mt-0">
          <div className="border-y border-ink bg-paper">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
              <p className="label">
                Direction {key.toUpperCase()} · {name}
              </p>
              <p className="label text-stone">{tag}</p>
            </div>
          </div>
          <div className="relative">
            <Hero id={`hero-${key}`} as="h2" />
          </div>
          <section className="border-b border-line bg-ivory" aria-label={`Direction ${key.toUpperCase()} rationale`}>
            <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:grid-cols-12 md:gap-x-6 md:px-10 md:py-20">
              <div className="md:col-span-5">
                <p className="label text-stone">Rationale</p>
                <p className="mt-4 font-serif text-[24px] leading-snug">{idea}</p>
                <p className="label mt-8 text-stone">Image selection</p>
                <p className="mt-3 text-[16px] leading-relaxed">{image}</p>
              </div>
              <div className="md:col-span-3 md:col-start-7">
                <p className="label text-stone">Strengths</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {strengths.map((s) => (
                    <li key={s} className="border-t border-line pt-3 text-[15.5px] leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3">
                <p className="label text-stone">Tradeoffs</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {tradeoffs.map((s) => (
                    <li key={s} className="border-t border-line pt-3 text-[15.5px] leading-relaxed text-stone">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      ))}
    </>
  );
}
