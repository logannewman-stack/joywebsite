import type { CSSProperties } from "react";
import { NewsletterForm } from "@/components/inquiry/NewsletterForm";
import { InView } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";

type Vars = CSSProperties & Record<`--${string}`, string>;

/**
 * The page's one signup and its black chapter. It wears the footer's From
 * Dr. Joy treatment (the label, the nameplate, the grey note), so the
 * newsletter has one design across the site. The visible label and the
 * nameplate form a single heading ("Stay Connected, From Dr. Joy"), so it
 * reads differently from the "From Dr. Joy" articles heading.
 *
 * The label and the nameplate rise word by word, and the note and the form
 * settle in after them. Beside them, on desktop, the JD monogram is pressed
 * into the black, as on her card: black on black, with no colour of its own.
 * It drifts a little with the page (decorative; styles: .stay-seal in
 * insights.css).
 *
 * On the Insights page the chapter follows the band photograph and slides up
 * over it while the photograph holds (styles: .insights-band in insights.css).
 */
export function StayConnected({ heading, name, text, cta }: { heading: string; name: string; text: string; cta: string }) {
  return (
    <section data-header="dark" className="stay-connected grain grain-light bg-ink text-white">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="lg:col-span-6">
          <InView>
            <h2>
              <span className="rise label block text-ash" style={{ "--d": "0.1s" } as Vars}>
                {heading}
                <span className="sr-only">: </span>
              </span>
              <span className="display t-h1 mt-5 block">
                <WordRise delay={0.15}>{name}</WordRise>
              </span>
            </h2>
          </InView>
          <InView className="mt-6 md:mt-8" delay={0.2}>
            <p className="rise t-body max-w-[28rem] text-ash">{text}</p>
            <div className="rise mt-8 max-w-md" style={{ "--d": "0.32s" } as Vars}>
              <NewsletterForm tone="dark" cta={cta} />
            </div>
          </InView>
        </div>
        {/* The monogram, pressed into the black like the mark on her card. The scroll engine writes --v on it before React hydrates. */}
        <div aria-hidden data-view className="stay-seal pointer-events-none hidden lg:col-span-3 lg:col-start-10 lg:block" suppressHydrationWarning>
          <span className="stay-mark" />
        </div>
      </div>
    </section>
  );
}
