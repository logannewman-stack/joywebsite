import Image from "next/image";
import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Reveal } from "../Reveal";
import { Eyebrow } from "../ui";

export function Method() {
  const { method } = site;
  return (
    <section id="method" className="relative isolate scroll-mt-20 overflow-hidden bg-coal py-24 md:py-36">
      <div className="bg-grid absolute inset-0 -z-10 opacity-70" />
      <div className="glow top-[45%] left-1/2 -z-10 size-[900px] -translate-x-1/2 opacity-35" />

      {/* image left / text right */}
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 md:grid-cols-[1fr_1fr] md:gap-20 md:px-10">
        <Reveal y={50}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-white/10 md:aspect-[5/6]">
            <Image src={method.image} alt={method.imageAlt} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-violet/20" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <Eyebrow>{method.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1] font-bold text-white">{method.heading}</h2>
          </Reveal>
          <div className="mt-8 flex flex-col gap-4">
            {method.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 + i * 0.05}>
                <p
                  className={
                    p.length < 30
                      ? "font-serif text-[28px] leading-tight text-violet-soft italic"
                      : "text-lg leading-relaxed text-porcelain/80"
                  }
                >
                  <Rich text={p} />
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* J O Y blocks */}
      <div className="mx-auto mt-28 grid max-w-[1100px] gap-5 px-5 md:mt-40 md:grid-cols-3 md:items-start md:px-10">
        {method.letters.map((l, i) => (
          <Reveal key={l.letter} delay={i * 0.12} y={60} className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-32" : ""}>
            <article className="group overflow-hidden rounded-[22px] border border-white/[0.08] bg-ink/70 backdrop-blur transition-colors duration-500 hover:border-violet/60">
              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[radial-gradient(80%_90%_at_50%_100%,rgba(124,58,237,0.45),rgba(124,58,237,0.06)_70%)]">
                <span className="font-display text-[9.5rem] leading-none font-bold text-violet-hi transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                  {l.letter}
                </span>
                <span className="eyebrow absolute top-4 left-5 text-white/50">0{i + 1}</span>
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl font-semibold text-white">{l.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-porcelain/70">{l.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
