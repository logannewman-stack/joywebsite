import Image from "next/image";
import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Reveal } from "../Reveal";
import { WatchButton } from "../Video";

export function VideoBand() {
  const { video } = site;
  return (
    <section className="relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden py-28 text-center">
      <Image src={video.image} alt="" fill sizes="100vw" className="-z-20 scale-105 object-cover blur-[3px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(76,29,149,0.62),rgba(12,12,15,0.94))]" />
      <div className="px-5">
        <Reveal>
          <h2 className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] font-bold tracking-[-0.02em] text-white">
            <Rich text={video.heading} accentClass="font-serif italic font-normal text-violet-soft text-[1.08em]" />
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <WatchButton className="!bg-white/5">{video.button}</WatchButton>
        </Reveal>
      </div>
    </section>
  );
}
