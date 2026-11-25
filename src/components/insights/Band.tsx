import type { PhotoSlot } from "@/content/site";
import { Photo } from "@/components/ui/Photo";

/**
 * The conversation after a session, as a wide pause in the page: one
 * photograph the width of the page column. It runs on from the section above
 * (no line between them); that section's bottom padding is the space over it.
 *
 * It arrives inset and opens to the column's width as it is scrolled into
 * place, while the picture inside settles from slightly large and drifts. On
 * desktop it then holds in the middle of the screen while the black chapter
 * below slides up over it, pushing in a little and dimming as it is covered
 * (styles: .insights-band in insights.css). Without JavaScript, with reduced
 * motion and in print it is simply the photograph in the column.
 */
export function Band({ slot }: { slot: PhotoSlot }) {
  return (
    // The scroll engine writes --v on the section before React hydrates.
    <section data-view className="insights-band no-rule bg-paper pb-20 md:pb-28" suppressHydrationWarning>
      <div className="insights-band-frame mx-auto max-w-(--wrap) px-5 md:px-10">
        <div className="insights-band-photo relative aspect-[4/5] w-full overflow-clip sm:aspect-[16/9] lg:aspect-auto">
          <div className="insights-band-inner absolute inset-0">
            <Photo
              slot={slot}
              className="h-full w-full"
              // A 3:2 photo in a taller box is cropped at the sides, so phones need a wider file.
              sizes="(max-width: 639px) 188vw, (max-width: 1440px) 100vw, 86vw"
            />
          </div>
          <div aria-hidden className="insights-band-dim pointer-events-none absolute inset-0 bg-ink opacity-0" />
        </div>
      </div>
    </section>
  );
}
