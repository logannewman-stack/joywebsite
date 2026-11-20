import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Reveal } from "../Reveal";
import { Eyebrow } from "../ui";

export function Services() {
  const { services } = site;
  return (
    <section id="services" className="relative scroll-mt-20 bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr] md:items-end">
          <div>
            <Reveal>
              <Eyebrow light>{services.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-[clamp(2.6rem,5.6vw,5rem)] leading-[0.98] font-bold tracking-[-0.02em]">
                <Rich text={services.heading} accentClass="font-serif italic font-normal text-violet text-[1.1em]" />
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-md text-lg leading-relaxed text-mute-dark md:justify-self-end">{services.sub}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {services.items.map((s, i) => (
            <Reveal key={s.accent} delay={i * 0.1} y={50}>
              <article className="arch group relative flex h-full flex-col overflow-hidden bg-ink px-7 pt-16 pb-7 text-center text-white transition-transform duration-500 hover:-translate-y-1.5">
                <div className="glow -top-24 left-1/2 size-72 -translate-x-1/2 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative mx-auto block size-2.5 rounded-full bg-violet-hi shadow-[0_0_20px_4px_rgba(155,109,255,0.7)]" />
                <p className="eyebrow relative mt-8 text-mute">{s.audience}</p>
                <h3 className="relative mt-4 font-display text-[34px] leading-[1] font-semibold">
                  {s.title}
                  <span className="mt-1 block font-serif text-[1.15em] font-normal text-violet-soft italic">{s.accent}</span>
                </h3>
                <p className="relative mx-auto mt-5 max-w-[17rem] flex-1 text-[15px] leading-relaxed text-porcelain/70">{s.text}</p>
                <dl className="relative mt-8 text-left">
                  {s.rows.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-t border-white/10 py-3 text-[13px]">
                      <dt className="text-white/90">{k}</dt>
                      <dd className="eyebrow !text-[10px] text-mute">{v}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href="#contact"
                  className="relative mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[14px] font-semibold transition-colors hover:border-violet hover:bg-violet"
                >
                  {s.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
