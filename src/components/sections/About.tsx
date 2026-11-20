import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Reveal } from "../Reveal";
import { Eyebrow, Portrait } from "../ui";

export function About() {
  const { about } = site;
  return (
    <section id="about" className="bg-grid relative isolate scroll-mt-20 overflow-hidden py-24 md:py-36">
      <div className="glow top-1/3 -left-40 -z-10 size-[640px] opacity-50" />

      <div className="mx-auto max-w-[1300px] px-5 md:px-10">
        <Reveal>
          <Eyebrow>{about.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="relative z-10 mt-6 font-display text-[clamp(3.6rem,11vw,10rem)] leading-[0.9] font-bold tracking-[-0.03em] text-violet-hi">
            {about.heading}
          </h2>
        </Reveal>

        <div className="mt-[-0.6rem] grid items-start gap-14 md:-mt-14 md:grid-cols-[0.95fr_1fr] md:gap-20">
          <Reveal y={60}>
            <Portrait
              src={about.image}
              alt={`Portrait of ${site.name.first}`}
              label="About portrait"
              className="arch aspect-[4/5] w-full max-w-[520px] border border-white/10"
            />
          </Reveal>

          <div className="flex flex-col gap-6 md:pt-36">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={`text-lg leading-relaxed md:text-xl ${i === 0 ? "text-white" : "text-porcelain/75"}`}>
                  <Rich text={p} highlightClass="text-white font-semibold" />
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <p className="mt-4 flex items-center gap-4 font-serif text-5xl text-violet-soft italic">
                <span className="h-px w-12 bg-violet-soft/60" />
                {about.signature}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
