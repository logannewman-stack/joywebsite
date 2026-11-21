import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { home } from "@/content/home";
import { Photo } from "@/components/ui/Photo";
import { Scene, SceneCount, SceneLine, ScenePanel, SceneStep, SceneSteps, SceneTrack } from "@/components/motion/Scene";
import { Parallax } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";
import { InView, Magnetic } from "@/components/motion/InView";
import { Hl, LineRise, WordLight, WordRise, highlight } from "@/components/motion/Text";

export const metadata: Metadata = {
  title: site.showPlaceholders ? "Motion lab" : "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Internal reference for the motion system: every primitive in
 * src/components/motion, with placeholder words. Review mode only.
 */
export default function MotionLab() {
  if (!site.showPlaceholders) notFound();
  const photo = home.pathways[0].photo;
  const sample = "Motion lab sample sentence that runs long enough to show the words brightening one after another as the page scrolls.";
  return (
    <>
      <section className="bg-paper px-5 pt-[calc(4.75rem+4rem)] pb-24 md:px-10">
        <p className="label text-stone">Internal: motion system reference</p>
        <h1 className="display mt-6 text-[clamp(3rem,7vw,7rem)]">
          <WordRise immediate>Words rise on load</WordRise>
        </h1>
        <InView className="mt-24 max-w-3xl">
          <h2 className="display text-[clamp(2.4rem,5vw,4.6rem)]">
            <WordRise>Words rise when seen,</WordRise>{" "}
            <em>
              <WordRise start={4}>with italics continuing.</WordRise>
            </em>
          </h2>
          <span className="rule-draw mt-8 block h-px bg-ink" />
          <ul className="stagger mt-8 grid gap-4 text-[1.0625rem] sm:grid-cols-3">
            <li>Staggered item one</li>
            <li>Staggered item two</li>
            <li>Staggered item three</li>
          </ul>
          <p className="rise mt-10 text-[1.1875rem] leading-relaxed" style={{ "--d": "0.2s" } as React.CSSProperties}>
            A paragraph that rises, with a <Hl tone="light">marker highlight</Hl> that draws itself in.
          </p>
          <p className="mt-10 font-serif text-[clamp(1.6rem,3vw,2.6rem)] leading-tight">
            <LineRise lines={["Hand-set line one", "and hand-set line two"]} />
          </p>
          <p className="mt-10">
            <Magnetic>
              <span className="inline-flex size-24 items-center justify-center rounded-full bg-ink text-white">Magnetic</span>
            </Magnetic>
          </p>
        </InView>
      </section>

      <section className="bg-ivory px-5 py-24 md:px-10">
        <p className="label text-stone">WordLight (view)</p>
        <p className="display mt-6 max-w-5xl text-[clamp(2rem,4.4vw,4rem)] leading-[1.05]">
          <WordLight dim={0.5}>{sample}</WordLight>
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Parallax className="aspect-[4/5]">
            <Photo slot={photo} className="h-full w-full" sizes="50vw" />
          </Parallax>
          <Parallax className="aspect-[4/5]" amount={14}>
            <Photo slot={home.pathways[1].photo} className="h-full w-full" sizes="50vw" />
          </Parallax>
        </div>
      </section>

      <Scene steps={3} length={3} dark className="bg-ink text-white" pinClassName="flex flex-col justify-center px-5 md:px-10">
        <p className="label text-ash">
          Scene with steps <SceneCount total={3} className="ml-4" />
        </p>
        <SceneLine className="mt-4 max-w-xs text-white" />
        <SceneSteps className="mt-10 flex flex-col gap-10">
          {["First statement of the scene.", "Second statement, replacing the first.", "Third and final statement."].map((s, i) => (
            <SceneStep key={s} index={i}>
              <p className="display max-w-4xl text-[clamp(2.4rem,6vw,6rem)]">{highlight(s, ["statement"])}</p>
            </SceneStep>
          ))}
        </SceneSteps>
      </Scene>

      <Scene from="lg" length={3} className="bg-paper" pinClassName="flex flex-col justify-center">
        <p className="label px-5 text-stone md:px-10">Scene with a horizontal track (pins from lg)</p>
        <SceneTrack className="mt-10 flex flex-col gap-6 px-5 md:px-10 pinned:flex-row pinned:gap-10">
          {[0, 1, 2, 3].map((i) => (
            <ScenePanel key={i} className="pinned:w-[46vw]">
              <div className="aspect-[4/3] bg-sand" />
              <p className="display mt-4 text-4xl">Panel {i + 1}</p>
              <a href="#top" className="mt-2 inline-block underline">
                A focusable link
              </a>
            </ScenePanel>
          ))}
        </SceneTrack>
        <SceneLine className="mx-5 mt-10 text-ink md:mx-10" />
      </Scene>

      <section className="bg-ivory py-24">
        <p className="label px-5 text-stone md:px-10">Marquee (moves with scroll), then auto with a Pause control</p>
        <Marquee className="display mt-8 text-[clamp(2.4rem,6vw,5.6rem)]">
          {["Venue one", "Venue two", "Venue three", "Venue four", "Venue five", "Venue six"].map((v) => (
            <span key={v} className="mr-10 whitespace-nowrap">
              {v} <span className="ml-10 text-blush-deep">●</span>
            </span>
          ))}
        </Marquee>
        <Marquee auto reverse className="display mt-8 px-5 text-[clamp(1.6rem,3vw,2.6rem)] md:px-10">
          {["Venue one", "Venue two", "Venue three", "Venue four", "Venue five", "Venue six"].map((v) => (
            <span key={v} className="mr-10 whitespace-nowrap">
              {v}
            </span>
          ))}
        </Marquee>
      </section>
      <section className="scene-wl bg-paper px-5 py-40 md:px-10">
        <p className="label text-stone">End of the lab</p>
      </section>
    </>
  );
}
