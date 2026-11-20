import Image from "next/image";
import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Reveal } from "../Reveal";
import { ButtonPrimary, IconTile } from "../ui";

export function Proof() {
  const { proof, benefits } = site;
  return (
    <section className="bg-grid relative isolate overflow-hidden py-24 md:py-36">
      <div className="glow -top-20 right-[-10%] -z-10 size-[700px] opacity-40" />
      <div className="glow bottom-[10%] left-[-15%] -z-10 size-[600px] opacity-30" />

      {/* text left / image right */}
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 md:grid-cols-[1fr_1.05fr] md:gap-20 md:px-10">
        <div className="flex flex-col gap-6">
          {proof.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-lg leading-relaxed text-porcelain/80 md:text-xl">
                <Rich text={p} />
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal y={50}>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[22px] border border-white/10">
            <Image src={proof.image} alt={proof.imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-deep/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/15 bg-ink/60 py-2 pr-4 pl-2 backdrop-blur-lg">
              <span className="font-display text-2xl font-bold text-violet-hi">{proof.badge.value}</span>
              <span className="eyebrow !text-[10px] text-white/80">{proof.badge.label}</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* benefits */}
      <div className="mx-auto mt-32 max-w-[1200px] px-5 text-center md:mt-44 md:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-4xl font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] font-bold text-white">
            <Rich text={benefits.heading} highlightClass="text-violet-hi" />
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {benefits.items.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-violet/50 hover:bg-white/[0.05]">
                <div className="glow -top-24 -right-24 size-56 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <IconTile name={b.icon} />
                <h3 className="mt-8 font-display text-[22px] leading-tight font-semibold text-violet-soft">{b.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-porcelain/70">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14 flex justify-center">
          <ButtonPrimary href={site.cta.href}>{site.cta.label}</ButtonPrimary>
        </Reveal>
      </div>
    </section>
  );
}
