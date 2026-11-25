import { links, notes, site } from "@/content/site";
import { speaking } from "@/content/speaking";
import { Photo } from "@/components/ui/Photo";
import { ReviewSlot } from "@/components/ui/Links";
import { ImageReveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { SpeakerReel } from "./SpeakerReel";

/**
 * A photograph of a real room: the stage and the audience, as a wide band the
 * width of the page column, drifting a little in its frame. It closes the
 * course list above it (no line between them). It is also where the speaker
 * reel plays once links.speakerReel is set; until then review mode marks the
 * slot, and at launch the band is just the photo.
 */
export function RoomBand() {
  const { photo } = speaking.room;
  const reel = links.speakerReel;
  return (
    <section className="no-rule bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 pb-20 md:px-10 md:pb-28">
        <div className="relative">
          <ImageReveal>
            <Parallax amount={4} className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[12/5]">
              {/* Phones show a 4:5 crop of the 3:2 photo, so it is drawn about twice as wide as the screen. */}
              <Photo slot={photo} className="h-full w-full" sizes="(max-width: 639px) 210vw, (max-width: 1440px) calc(100vw - 40px), 79vw" />
            </Parallax>
          </ImageReveal>
          {reel ? (
            <>
              {/* A dimming layer under the control's label, at the foot of the photo only. */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/75 to-transparent" />
              {/* Covers the band so the player, once started, fills it. */}
              <div className="absolute inset-0 flex items-end p-5 md:p-8">
                <SpeakerReel url={reel} label="Speaker reel" title={`Speaker reel: ${site.name}`} />
              </div>
            </>
          ) : (
            notes && (
              <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6">
                <ReviewSlot tone="dark" className="!min-h-0 !px-3 !py-2 bg-ink/55 backdrop-blur-sm md:!px-4 md:!py-3">
                  Speaker reel: link pending
                </ReviewSlot>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
