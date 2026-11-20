"use client";

import { motion } from "motion/react";
import { Check, Mic } from "lucide-react";
import { site } from "@/content/site";
import { Rich } from "../Rich";
import { ButtonPrimary, Eyebrow, Portrait } from "../ui";
import { WatchButton } from "../Video";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { hero } = site;
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(90%_70%_at_30%_10%,#1d1b24_0%,#0c0c0f_70%)] pt-[76px]">
      <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(70%_60%_at_40%_40%,#000,transparent)]" />
      <div className="glow -top-40 left-[38%] -z-10 size-[620px] opacity-60" />

      <div className="mx-auto grid min-h-[calc(100svh-76px)] max-w-[1400px] items-center gap-12 px-5 md:px-10 lg:grid-cols-[1.08fr_1fr] lg:gap-6">
        {/* Copy */}
        <div className="relative z-10 pt-10 pb-4 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </motion.div>

          <h1 className="mt-7 font-display text-[clamp(3.1rem,7vw,6.4rem)] leading-[0.98] font-bold tracking-[-0.01em]">
            {hero.lines.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${
                    line.style === "accent"
                      ? "text-violet-hi"
                      : "font-serif text-[1.14em] leading-[0.9] font-normal text-white italic"
                  }`}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-[34rem] text-[17px] leading-relaxed text-porcelain/80 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
          >
            <Rich text={hero.sub} highlightClass="text-white font-semibold" />
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.72, ease }}
          >
            <ButtonPrimary href={site.cta.href}>{site.cta.label}</ButtonPrimary>
            <WatchButton>{hero.reelLabel}</WatchButton>
          </motion.div>

          <motion.dl
            className="mt-14 grid max-w-[30rem] grid-cols-3 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.95 }}
          >
            {hero.stats.map((s, i) => (
              <div key={s.label} className={`pt-5 ${i > 0 ? "border-l border-white/10 pl-5" : ""}`}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-semibold text-white md:text-[2.1rem]">{s.value}</dd>
                <dd className="eyebrow mt-1 !text-[10px] text-mute">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Portrait */}
        <motion.div
          className="relative mx-auto w-full max-w-[520px] self-end lg:mr-0"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.25, ease }}
        >
          {/* violet orb */}
          <div className="absolute -top-6 -right-10 size-[58%] rounded-full bg-[radial-gradient(circle_at_35%_35%,#b18cff,#7c3aed_55%,#4c1d95)] opacity-90 blur-[1px]" />
          <div className="absolute top-[18%] -left-[14%] size-[118%] rounded-full border border-white/[0.06]" />

          <Portrait
            src={hero.image}
            alt={`${site.name.first}, speaker and coach`}
            label="Hero portrait"
            priority
            className="arch relative aspect-[4/5] w-full border border-white/10 shadow-[0_40px_120px_-30px_rgba(124,58,237,0.6)]"
          />

          {/* floating badges */}
          <div className="animate-float absolute top-[22%] -left-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/70 py-2.5 pr-4 pl-2.5 backdrop-blur-xl md:-left-10">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-violet text-white">
              <Check className="size-4" strokeWidth={2.5} />
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-white">{hero.badges[0].title}</span>
              <span className="eyebrow block !text-[9px] text-mute">{hero.badges[0].sub}</span>
            </span>
          </div>
          <div className="animate-float absolute right-0 bottom-[16%] flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/70 py-2.5 pr-4 pl-2.5 backdrop-blur-xl [animation-delay:-3s] md:-right-6">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-violet-hi text-white">
              <Mic className="size-4" strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-white">{hero.badges[1].title}</span>
              <span className="eyebrow block !text-[9px] text-mute">{hero.badges[1].sub}</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
