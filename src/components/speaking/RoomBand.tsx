import { links, notes, site } from "@/content/site";
import { speaking } from "@/content/speaking";
import { Photo } from "@/components/ui/Photo";
import { ReviewSlot } from "@/components/ui/Links";
import { SpeakerReel } from "./SpeakerReel";

/**
 * A photograph of a real room: the stage and the audience, as a wide band the
 * width of the page column. It closes the first chapter, under the course
 * list (no line between them).
 *
 * With motion on, the band arrives with its own movement (speaking.css, "Room
 * band"): it opens from a narrower frame to the full column as it comes up
 * the screen, and the photograph drifts a little slower than the page and
 * grows slightly. On a desktop it then holds under the header while the next
 * chapter slides up over it. Without motion it is a plain photograph in the
 * flow of the page.
 *
 * It is also where the speaker reel plays once links.speakerReel is set;
 * until then review mode marks the slot, and at launch the band is just the
 * photo.
 */
export function RoomBand() {
  const { photo } = speaking.room;
  const reel = links.speakerReel;
  return (
    // The scroll engine writes --v on this block before React hydrates.
    <div data-view className="sp-room mx-auto max-w-(--wrap) px-5 pb-20 md:px-10 md:pb-28" suppressHydrationWarning>
      <div className="sp-room-frame">
        <div className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[12/5]">
          <div className="sp-room-photo h-full w-full">
            {/* Phones show a 4:5 crop of the 3:2 photo, so it is drawn wider than the screen. */}
            <Photo slot={photo} className="h-full w-full" sizes="(max-width: 639px) 170vw, (max-width: 1440px) calc(100vw - 40px), 79vw" />
          </div>
        </div>
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
  );
}
