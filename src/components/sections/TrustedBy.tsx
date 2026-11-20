import { site } from "@/content/site";
import { Reveal } from "../Reveal";

const wordmark: Record<string, string> = {
  display: "font-display font-bold text-[26px] tracking-tight",
  serif: "font-serif italic text-[30px]",
  mono: "font-mono font-semibold text-[19px] tracking-[0.14em]",
  sans: "font-sans font-bold text-[25px] tracking-[-0.03em]",
  wide: "font-display font-semibold text-[18px] tracking-[0.32em]",
};

function LogoRow({ reverse = false }: { reverse?: boolean }) {
  const logos = site.trustedBy.logos;
  const half = reverse ? logos.slice(6) : logos.slice(0, 6);
  const items = [...half, ...half, ...half, ...half];
  return (
    <div className="mask-x flex overflow-hidden">
      <ul
        className={`flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} [--marquee-duration:45s] hover:[animation-play-state:paused]`}
      >
        {items.map((l, i) => (
          <li
            key={i}
            aria-hidden={i >= half.length}
            className={`whitespace-nowrap text-ink/70 transition-colors duration-300 hover:text-violet ${wordmark[l.style]}`}
          >
            {l.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrustedBy() {
  const words = [...site.marquee, ...site.marquee];
  return (
    <section className="relative overflow-hidden bg-porcelain pt-20 pb-6 text-ink md:pt-24">
      <Reveal>
        <p className="text-center text-lg font-bold">{site.trustedBy.heading}</p>
      </Reveal>
      <div className="mt-12 flex flex-col gap-10 md:gap-12">
        <LogoRow />
        <LogoRow reverse />
      </div>

      {/* roles marquee */}
      <div className="mt-20 flex overflow-hidden border-t border-ink/10 py-8 md:mt-24">
        <ul className="animate-marquee flex shrink-0 items-center [--marquee-duration:60s]">
          {[...words, ...words].map((w, i) => (
            <li key={i} className="flex items-center" aria-hidden={i >= site.marquee.length}>
              <span
                className={`px-8 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-semibold tracking-tight whitespace-nowrap ${
                  i % 2 ? "text-outline-dark" : "text-ink"
                }`}
              >
                {w}
              </span>
              <span className="size-2.5 rotate-45 bg-violet" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
