import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { InView, Magnetic } from "@/components/motion/InView";
import { WordRise } from "@/components/motion/Text";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * "Let's start a conversation.": the page's closing, a white section. The
 * heading takes the left half of the page column; the paragraph and the one
 * action stand beside it. Behind them the JD monogram is pressed into the
 * white, in the palest grey, like the embossed mark on the brand board: it
 * drifts a little slower than the page and a soft sheen crosses it as the
 * section scrolls past (home.css, "Closing"). The heading's words rise when
 * it is seen, the paragraph and the button follow, and the button leans
 * toward the pointer.
 */
export function Finale() {
  const { closing } = home;
  return (
    <section className="finale relative isolate overflow-clip bg-paper" aria-labelledby="closing-heading">
      <div aria-hidden data-view className="finale-mark-frame pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <InView className="finale-mark">
          {/* The still, embossed copy, and over it the copy the sheen crosses. */}
          <div className="finale-mark-emboss" />
          <div className="finale-mark-shape" />
        </InView>
      </div>
      <div className="mx-auto max-w-(--wrap) px-5 py-24 md:px-10 md:py-36 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <h2 id="closing-heading" className="display t-h1 lg:col-span-6">
          <WordRise>{closing.heading}</WordRise>
        </h2>
        <InView className="mt-6 max-w-[34rem] md:mt-8 lg:col-span-6 lg:col-start-7 lg:mt-0">
          <p className="rise t-lead text-ink" style={{ "--d": "0.15s" } as Vars}>
            {closing.body}
          </p>
          <div className="rise mt-8" style={{ "--d": "0.25s" } as Vars}>
            <Magnetic strength={0.2}>
              <InquiryButton>{closing.cta}</InquiryButton>
            </Magnetic>
          </div>
        </InView>
      </div>
    </section>
  );
}
