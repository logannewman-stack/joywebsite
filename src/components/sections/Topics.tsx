import { site } from "@/content/site";
import { Reveal } from "../Reveal";
import { ButtonPrimary, Eyebrow, IconTile, TextLink } from "../ui";

export function Topics() {
  const { topics } = site;
  return (
    <section id="speaking" className="bg-grid relative isolate scroll-mt-20 overflow-hidden py-24 md:py-36">
      <div className="glow bottom-0 left-1/2 -z-10 size-[900px] -translate-x-1/2 translate-y-1/2 opacity-50" />

      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>{topics.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1] font-bold text-white">{topics.heading}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-porcelain/75">{topics.sub}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {topics.items.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.1}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-coal/80 p-8 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-violet/50">
                <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-hi to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <IconTile name={t.icon} />
                  <span className="eyebrow text-mute">Keynote 0{i + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-[26px] leading-[1.1] font-semibold text-violet-soft">{t.title}</h3>
                <p className="mt-2 text-[15px] font-bold text-white/90 italic">{t.tagline}</p>
                <p className="mt-5 flex-1 text-[15px] leading-relaxed text-porcelain/70">{t.text}</p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <ButtonPrimary href="#contact" className="!text-[14px]">
                    Check availability
                  </ButtonPrimary>
                  <TextLink href="#contact">Learn more</TextLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
