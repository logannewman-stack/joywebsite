import { home } from "@/content/home";
import { Photo } from "../ui/Photo";
import { ArrowLink } from "../ui/Links";
import { Reveal } from "../ui/Reveal";
import { typeset } from "../ui/Typeset";

/*
 * The four pathways as an editorial spread: each one leads with its color
 * photograph at every width (one column on phones, two on tablets, four on
 * wide screens, with the even columns set lower). The whole card is one
 * link, so pointer, touch and keyboard users get the same target; hover and
 * keyboard focus both ease the photograph in. Nothing floats over the words.
 */

// Photo widths: 4:5 crops in a 1/2/4-column grid inside a 1440px container (40px gutters, 32px gaps).
const sizes = "(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(50vw - 56px), (max-width: 1440px) calc(25vw - 44px), 21.9vw";

export function Pathways() {
  return (
    <ol className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20 xl:grid-cols-4">
      {home.pathways.map((p, i) => (
        <li
          key={p.kicker}
          className="group relative self-start md:even:mt-24 xl:even:mt-28 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[0.625rem] has-[:focus-visible]:outline-ink"
        >
          <Reveal delay={(i % 4) * 0.06}>
            <div className="overflow-hidden bg-sand">
              <Photo
                slot={p.photo}
                sizes={sizes}
                className="aspect-[4/5] w-full transition-transform duration-[var(--duration-image,850ms)] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-has-[:focus-visible]:scale-[1.04] motion-reduce:transition-none"
              />
            </div>
            <div className="mt-6 flex items-baseline gap-3 border-t border-ink pt-4">
              <span className="label text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="label">{p.kicker}</h3>
            </div>
            <p className="display mt-5 text-[clamp(1.85rem,2.4vw,2.25rem)] leading-[1.04] xl:text-[clamp(1.75rem,2vw,2.1rem)]">{typeset(p.heading)}</p>
            <p className="mt-4 text-[0.96875rem] leading-relaxed text-stone">{p.body}</p>
            {/* The link's ::after covers the card, so the photo and words are part of one target. */}
            <ArrowLink
              href={p.link.href}
              className="mt-5 focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
            >
              {p.link.label}
            </ArrowLink>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
