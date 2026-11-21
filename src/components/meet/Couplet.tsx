import type { PhotoSlot } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { ImageReveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { bindI } from "./text";

/**
 * "In lecture halls, I studied." / "In the operatory, I tested and refined."
 *
 * A scroll-scrubbed turn in the story. The first line glides in from the
 * left and the second answers from the right; they have met, stepped one
 * under the other, by the time the block reaches the middle of the screen,
 * and the clinical close-up drifts up between them. One clock drives all
 * three: the block's own --v. The motion is in meet.css ("The couplet");
 * without it the two lines simply sit in order around the photograph.
 */
export function Couplet({ lines, photo }: { lines: string[]; photo: PhotoSlot }) {
  const size = "display text-[clamp(2.6rem,6.8vw,7.4rem)] leading-[0.98] lg:text-[clamp(2.6rem,7.4vw,7.4rem)]";
  return (
    <section className="meet-couplet overflow-x-clip bg-ivory">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-24 md:px-10 md:pt-40 md:pb-44">
        <div data-view="" className="meet-couplet-stage">
          <p className={`meet-line meet-line-a relative z-10 ${size}`}>{bindI(lines[0])}</p>
          <div className="mt-8 md:mt-12 md:grid md:grid-cols-12 md:items-end md:gap-x-6">
            <div className="meet-couplet-photo w-[72%] md:col-span-5 md:w-auto">
              <ImageReveal>
                <Parallax amount={7} className="aspect-[5/4] w-full">
                  <Photo slot={photo} className="h-full w-full" sizes="(max-width: 767px) 72vw, 42vw" />
                </Parallax>
              </ImageReveal>
            </div>
            <p className={`meet-line meet-line-b relative z-10 mt-8 text-right md:col-span-7 md:mt-0 ${size}`}>
              <em>{bindI(lines[1])}</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
