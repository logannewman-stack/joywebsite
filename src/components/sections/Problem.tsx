import Image from "next/image";
import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Reveal } from "../Reveal";

export function Problem() {
  const { problem } = site;
  return (
    <section className="relative isolate overflow-hidden">
      {/* split background: dark grid above, porcelain below */}
      <div className="bg-grid absolute inset-x-0 top-0 -z-10 h-[62%] md:h-[58%]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[38%] bg-porcelain md:h-[42%]" />
      <div className="glow top-[10%] right-[5%] -z-10 size-[520px] opacity-50" />

      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 pt-24 pb-20 md:grid-cols-[0.9fr_1.1fr] md:grid-rows-[auto_auto] md:gap-x-16 md:px-10 md:pt-32 md:pb-28">
        <Reveal className="md:col-start-2 md:row-start-1 md:self-center">
          <h2 className="font-display text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.02] font-bold text-white">
            {problem.heading}
          </h2>
        </Reveal>

        <Reveal className="md:col-start-1 md:row-span-2 md:row-start-1" y={50}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-white/10 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.8)]">
            <Image src={problem.image} alt={problem.imageAlt} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-deep/50 to-transparent mix-blend-multiply" />
          </div>
        </Reveal>

        <Reveal className="md:col-start-2 md:row-start-2 md:self-end" delay={0.1}>
          <p className="font-display text-[clamp(2.6rem,6vw,5.4rem)] leading-[1] font-bold tracking-[-0.02em] text-ink">
            <Rich text={problem.turn} accentClass="font-serif italic font-normal text-violet text-[1.1em]" />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
