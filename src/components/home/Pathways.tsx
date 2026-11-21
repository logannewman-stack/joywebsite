"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ArrowLink } from "../ui/Links";
import { Reveal } from "../ui/Reveal";

/**
 * The four pathways as an editorial index. On a mouse, hovering a row floats
 * its photograph beside the cursor; on touch, each row shows its photo inline.
 */
export function Pathways() {
  const list = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });

  const onMove = (e: MouseEvent) => {
    const r = list.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div ref={list} className="relative" onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
      {/* floating preview, pointer devices only */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-20 hidden h-[300px] w-[240px] -translate-x-1/2 -translate-y-1/2 overflow-hidden [@media(hover:hover)_and_(min-width:1024px)]:block"
        style={{ x: sx, y: sy }}
        aria-hidden
      >
        <AnimatePresence>
          {active !== null && home.pathways[active].photo.src && (
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={home.pathways[active].photo.src!} alt="" fill sizes="240px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ol className="border-t border-ink">
        {home.pathways.map((p, i) => (
          <li
            key={p.kicker}
            className="group relative border-b border-line"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <Reveal delay={i * 0.06}>
              <div className="grid gap-6 py-10 md:grid-cols-12 md:gap-x-6 md:py-14">
                <div className="flex items-baseline gap-4 md:col-span-3">
                  <span className="label text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="label">{p.kicker}</h3>
                </div>
                <p className="display text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:col-span-5 lg:group-hover:translate-x-3">
                  {p.heading}
                </p>
                <div className="md:col-span-4">
                  <Photo slot={p.photo} className="mb-6 aspect-[16/10] w-full lg:hidden" sizes="100vw" />
                  <p className="text-[16px] leading-relaxed text-stone">{p.body}</p>
                  <ArrowLink href={p.link.href} className="mt-4">
                    {p.link.label}
                  </ArrowLink>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
