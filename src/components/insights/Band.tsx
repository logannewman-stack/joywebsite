import type { PhotoSlot } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { ImageReveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/motion/Parallax";

/**
 * The conversation after a session, as a wide pause in the page: one
 * photograph the width of the page column, drifting a little in its frame.
 * It runs on from the section above (no line between them); that section's
 * bottom padding is the space over it.
 */
export function Band({ slot }: { slot: PhotoSlot }) {
  return (
    <section className="no-rule bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 pb-20 md:px-10 md:pb-28">
        <ImageReveal>
          <Parallax amount={4} className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[12/5]">
            <Photo
              slot={slot}
              className="h-full w-full"
              // A 3:2 photo in a taller box is cropped at the sides, so phones need a wider file.
              sizes="(max-width: 639px) 188vw, (max-width: 1440px) calc(100vw - 40px), 79vw"
            />
          </Parallax>
        </ImageReveal>
      </div>
    </section>
  );
}
