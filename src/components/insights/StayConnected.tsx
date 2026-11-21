import type { CSSProperties } from "react";
import { NewsletterForm } from "@/components/inquiry/NewsletterForm";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";

type Vars = CSSProperties & Record<`--${string}`, string>;

/**
 * The page's one signup and its black moment. It wears the footer's From
 * Dr. Joy treatment (a gold rule above the label, the roman nameplate, the
 * ash note), so the newsletter has one design across the site. The visible
 * label and the nameplate form a single heading ("Stay Connected, From Dr.
 * Joy"), so it reads differently from the "From Dr. Joy" articles heading,
 * and its nameplate stays smaller than the page's H1.
 *
 * The chapter arrives with intent: the gold rule draws, the nameplate rises
 * word by word, and the note and the form settle in after it. Beside them the
 * JD monogram is pressed into the black, as on her card, and drifts a little
 * with the page (decorative; styles: .stay-seal in insights.css).
 */
export function StayConnected({ heading, name, text, cta }: { heading: string; name: string; text: string; cta: string }) {
  return (
    <section data-header="dark" className="grain grain-light relative overflow-clip bg-ink text-white">
      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-x-6 lg:py-40">
        <div className="lg:col-span-6">
          <InView>
            <span aria-hidden className="rule-draw mb-6 block h-px w-12 bg-gold" />
            <h2>
              <span className="rise label block text-ash" style={{ "--d": "0.1s" } as Vars}>
                {heading}
                <span className="sr-only">: </span>
              </span>
              <span className="display mt-5 block text-[clamp(2.75rem,5.6vw,5.25rem)]">
                <WordRise delay={0.15}>{name}</WordRise>
              </span>
            </h2>
          </InView>
          <InView className="mt-10 md:mt-12" delay={0.2}>
            <p className="rise max-w-[28rem] text-[1.0625rem] leading-relaxed !text-balance text-ash">{text}</p>
            <div className="rise mt-8 max-w-md" style={{ "--d": "0.32s" } as Vars}>
              <NewsletterForm tone="dark" cta={cta} />
            </div>
          </InView>
        </div>
        {/* The monogram, pressed into the black like the mark on her card */}
        <div aria-hidden data-view className="stay-seal pointer-events-none absolute top-24 right-5 w-[4.5rem] md:top-32 md:right-10 md:w-28 lg:static lg:col-span-4 lg:col-start-8 lg:w-full lg:max-w-[24rem] lg:self-center lg:justify-self-center">
          <span className="stay-mark" />
        </div>
      </div>
    </section>
  );
}
