import { home } from "@/content/home";
import { InView, Magnetic } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";

/**
 * "Let's start a conversation.": the page's last word, set as large as the
 * screen allows. The words rise one after another over the JD monogram,
 * pressed into the ivory in pale gold like the embossed mark on the brand
 * board; the one action leans toward the pointer. Styles: home.css ("Finale").
 */
export function Finale() {
  const { closing } = home;
  // Two hand-set lines: the last word takes the second line, in italic.
  const words = closing.heading.split(" ");
  const last = words.pop() ?? "";
  const lead = words.join(" ");
  return (
    <section className="finale relative isolate overflow-clip bg-ivory" aria-labelledby="closing-heading">
      <div aria-hidden data-view className="finale-mark-frame pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <InView className="finale-mark">
          {/* The still, embossed copy, and over it the copy the sheen crosses (home.css, "Finale"). */}
          <div className="finale-mark-emboss" />
          <div className="finale-mark-shape" />
        </InView>
      </div>
      <div className="mx-auto flex max-w-[90rem] flex-col items-center px-5 py-28 text-center md:px-10 md:py-40 lg:min-h-[100svh] lg:justify-center lg:py-20">
        <InView as="span" className="block">
          <span aria-hidden className="rule-draw block h-px w-16 bg-gold-deep" />
        </InView>
        <h2 id="closing-heading" className="finale-heading display mt-8 text-[clamp(2.9rem,min(15.5vw,21svh),11.75rem)] leading-[0.86] md:mt-10">
          <span className="block">
            <WordRise>{lead}</WordRise>
          </span>{" "}
          <em className="block">
            <WordRise start={words.length}>{last}</WordRise>
          </em>
        </h2>
        <InView className="rise" delay={0.25}>
          <p className="mx-auto mt-10 max-w-[34rem] text-[1.0625rem] leading-relaxed text-charcoal md:mt-12 md:text-[1.125rem]">{closing.body}</p>
        </InView>
        <InView className="rise mt-10" delay={0.35}>
          <Magnetic strength={0.25}>
            <InquiryButton className="!min-h-14 !px-8 !text-[1rem]">{closing.cta}</InquiryButton>
          </Magnetic>
        </InView>
      </div>
    </section>
  );
}
