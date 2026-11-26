import type { PhotoSlot } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { ImageReveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/motion/Parallax";

/** "In lecture halls, I studied." set on two lines, broken after its comma. The space stays in the text for search and copy-paste. */
function Pair({ line }: { line: string }) {
  const cut = line.indexOf(", ");
  if (cut < 0) return line;
  return (
    <>
      <span className="block">{line.slice(0, cut + 1)} </span>
      <span className="block">{line.slice(cut + 2)}</span>
    </>
  );
}

/**
 * "In lecture halls, I studied." / "In the operatory, I tested and refined."
 *
 * A scroll-scrubbed turn in the story: the clinical close-up on the left,
 * the two lines on the right, each broken after its comma so they read as a
 * pair. The first is set in grey and the second in black: before and after,
 * without a second typeface. As the block comes up the screen the first line
 * glides in from the left and the second answers from the right; they have
 * met, one under the other, by the time the block reaches the middle of the
 * screen, and the photograph drifts up a little faster than the page. One
 * clock drives all three: the block's own --v (meet.css, "The couplet").
 * Without motion the two lines simply sit one under the other.
 */
export function Couplet({ lines, photo }: { lines: string[]; photo: PhotoSlot }) {
  return (
    <section className="meet-couplet overflow-x-clip bg-paper">
      <div data-view="" className="meet-couplet-stage mx-auto max-w-(--wrap) px-5 py-20 md:grid md:grid-cols-12 md:items-center md:gap-x-6 md:px-10 md:py-28">
        <div className="meet-couplet-photo w-[min(100%,30rem)] md:col-span-5 md:w-auto">
          <ImageReveal>
            <Parallax amount={5} className="aspect-[5/4] w-full">
              <Photo slot={photo} className="h-full w-full" sizes="(max-width: 767px) min(100vw - 40px, 480px), (max-width: 1440px) 36vw, 30vw" />
            </Parallax>
          </ImageReveal>
        </div>
        <div className="mt-10 md:col-span-6 md:col-start-7 md:mt-0">
          <p className="meet-line meet-line-a display t-h1 text-stone">
            <Pair line={lines[0]} />
          </p>
          <p className="meet-line meet-line-b display t-h1 mt-4 md:mt-5">
            <Pair line={lines[1]} />
          </p>
        </div>
      </div>
    </section>
  );
}
