import type { PhotoSlot } from "@/content/site";
import { Photo } from "@/components/ui/Photo";

/**
 * The conversation after a session, as the page's cinematic pause. The
 * photograph arrives inset on the page margins and opens to the full width
 * as it is scrolled into place, while the picture inside settles from
 * slightly large and drifts (styles: .insights-band in insights.css).
 * Without JavaScript or with reduced motion it is simply the full-bleed photo.
 */
export function Band({ slot }: { slot: PhotoSlot }) {
  return (
    <div className="bg-paper">
      <div data-view className="insights-band relative aspect-[4/5] w-full overflow-clip sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:h-[min(56.25vw,88svh)]">
        <div className="insights-band-inner absolute inset-0">
          <Photo
            slot={slot}
            className="h-full w-full"
            // A 3:2 photo in a taller box is cropped at the sides, so phones need a wider file.
            sizes="(max-width: 639px) 188vw, (max-width: 767px) 113vw, 100vw"
          />
        </div>
      </div>
    </div>
  );
}
