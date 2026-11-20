import { site } from "@/content/site";
import { Reveal } from "../Reveal";

export function Statements() {
  const { statements } = site;
  return (
    <section className="stage-beams grain relative isolate overflow-hidden py-28 text-center md:py-40">
      {/* dust in the light */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.5),transparent),radial-gradient(1px_1px_at_70%_20%,rgba(255,255,255,0.4),transparent),radial-gradient(1.5px_1.5px_at_40%_60%,rgba(255,255,255,0.35),transparent),radial-gradient(1px_1px_at_85%_55%,rgba(255,255,255,0.4),transparent),radial-gradient(1px_1px_at_10%_75%,rgba(255,255,255,0.3),transparent)]" />

      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <Reveal>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-semibold whitespace-pre-line text-white/90 md:text-[22px]">
            {statements.intro}
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-4 md:mt-20 md:gap-6">
          {statements.lines.map((l, i) => (
            <Reveal key={l.accent} delay={i * 0.12}>
              <p className="font-display text-[clamp(2rem,5.4vw,4.4rem)] leading-[1] font-bold tracking-[-0.01em] text-white uppercase">
                <span className="text-violet-hi">{l.accent}</span>, {l.rest}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
