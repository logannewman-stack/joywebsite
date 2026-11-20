import Image from "next/image";
import { Rich } from "../Rich";
import { QuoteMark } from "../ui";
import { Reveal } from "../Reveal";

export function Testimonial({
  quote,
  name,
  role,
  image,
  id,
}: {
  quote: string;
  name: string;
  role: string;
  image?: string;
  id?: string;
}) {
  return (
    <section id={id} className="grain relative isolate overflow-hidden bg-coal py-24 md:py-32">
      {image && (
        <>
          <Image src={image} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30 grayscale" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-coal via-coal/80 to-coal" />
        </>
      )}
      <div className="glow top-1/2 left-1/2 -z-10 size-[700px] -translate-x-1/2 -translate-y-1/2 opacity-40" />

      <div className="relative mx-auto max-w-[1060px] px-5 text-center md:px-10">
        <Reveal>
          <QuoteMark className="mx-auto mb-8 h-10 w-auto text-violet-hi md:h-12" />
        </Reveal>
        <Reveal delay={0.05}>
          <blockquote className="relative text-[clamp(1.45rem,2.9vw,2.4rem)] leading-[1.25] font-medium tracking-[-0.01em] text-white">
            &ldquo;<Rich text={quote} highlightClass="text-violet-hi font-semibold" />&rdquo;
          </blockquote>
        </Reveal>
        <Reveal delay={0.15}>
          <figcaption className="mt-10 flex flex-col items-center gap-1.5">
            <span className="mb-3 h-px w-10 bg-violet-hi" />
            <span className="text-base font-semibold text-white">{name}</span>
            <span className="eyebrow text-mute">{role}</span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
