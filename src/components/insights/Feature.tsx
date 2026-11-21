import { ButtonLink } from "@/components/ui/Links";
import { Reveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";
import { ConfirmTag } from "./records";

export type FeatureItem = {
  title: string;
  subtitle?: string;
  publication?: string;
  date?: string;
  excerpt?: string;
  href: string;
  /** Opens the original at the publisher in a new tab. */
  external: boolean;
  verified: boolean;
};

/**
 * The single strongest article, set as the page's lead story: the publication
 * as a masthead, the headline at display scale, and one clear way to read it
 * at the original publisher.
 */
export function Feature({ item, cta }: { item: FeatureItem; cta: string }) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28 lg:py-36">
        <article className="grid grid-cols-1 gap-y-10 border-t border-ink pt-8 md:pt-10 lg:grid-cols-12 lg:gap-x-6">
          <Reveal className="lg:col-span-5">
            {item.publication && <p className="font-serif text-[clamp(1.6rem,2.3vw,2.25rem)] leading-tight italic">{item.publication}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {item.date && <p className="label text-stone tabular-nums">{item.date}</p>}
              {!item.verified && <ConfirmTag />}
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
            <h2 className="display max-w-[9em] text-[clamp(2.9rem,6vw,6.2rem)] leading-[0.94]">{typeset(item.title)}</h2>
            {item.subtitle && (
              <p className="mt-6 max-w-[34ch] font-serif text-[clamp(1.35rem,1.9vw,1.8rem)] leading-snug text-stone italic">{item.subtitle}</p>
            )}
            {item.excerpt && <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-stone">{item.excerpt}</p>}
            <ButtonLink href={item.href} className="mt-10">
              {cta}
            </ButtonLink>
          </Reveal>
        </article>
      </div>
    </section>
  );
}
