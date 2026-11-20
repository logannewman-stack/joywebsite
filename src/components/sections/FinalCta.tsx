import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Reveal } from "../Reveal";
import { ButtonPrimary } from "../ui";

export function FinalCta() {
  const { finalCta } = site;
  return (
    <section className="stage-beams grain relative isolate overflow-hidden py-28 text-center md:py-40">
      <div className="mx-auto max-w-[1000px] px-5 md:px-10">
        <Reveal>
          <h2 className="font-display text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.98] font-bold tracking-[-0.02em] text-white">
            <Rich text={finalCta.heading} accentClass="font-serif italic font-normal text-violet-soft text-[1.1em]" />
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed font-semibold text-white/85 md:text-xl">
            <Rich text={finalCta.sub} highlightClass="text-violet-hi font-bold underline decoration-2 underline-offset-4" />
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <ButtonPrimary href={site.cta.href}>{site.cta.label}</ButtonPrimary>
        </Reveal>
      </div>
    </section>
  );
}
