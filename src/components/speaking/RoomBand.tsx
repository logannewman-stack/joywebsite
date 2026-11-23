import { links, notes, site } from "@/content/site";
import { speaking } from "@/content/speaking";
import { Photo } from "@/components/ui/Photo";
import { ReviewSlot } from "@/components/ui/Links";
import { SpeakerReel } from "./SpeakerReel";

/**
 * Full-bleed photograph of a real room: the stage and the audience, close to
 * a full screen tall on desktop. The photo drifts slower than the page and
 * grows slightly as the band passes (speaking.css, "Room band"). It is also
 * where the speaker reel plays once links.speakerReel is set; until then
 * review mode marks the slot, and at launch the band is just the photo.
 */
export function RoomBand() {
  const { photo } = speaking.room;
  const reel = links.speakerReel;
  return (
    <div data-header="dark" data-view className="sp-room relative overflow-clip bg-ink">
      <div className="relative aspect-[4/5] w-full sm:aspect-[3/2] md:aspect-[2/1] lg:aspect-auto lg:h-[min(86svh,54rem)] lg:min-h-[30rem]">
        <div className="sp-room-photo absolute inset-0">
          {/* Phones show a 4:5 crop of the 3:2 photo, so it is drawn about twice as wide as the screen; the slight zoom as it drifts takes the rest. */}
          <Photo slot={photo} className="h-full w-full" sizes="(max-width: 639px) 210vw, (max-width: 767px) 110vw, 100vw" />
        </div>
      </div>
      {reel ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/75 to-transparent" />
          {/* Covers the band so the player, once started, fills it. */}
          <div className="absolute inset-0 flex items-end p-5 md:p-10">
            <SpeakerReel url={reel} label="Speaker reel" title={`Speaker reel: ${site.name}`} />
          </div>
        </>
      ) : (
        notes && (
          <div className="absolute bottom-3 left-3 md:bottom-8 md:left-10">
            <ReviewSlot tone="dark" className="!min-h-0 !px-3 !py-2 bg-ink/55 backdrop-blur-sm md:!px-4 md:!py-3">
              Speaker reel: link pending
            </ReviewSlot>
          </div>
        )
      )}
    </div>
  );
}
