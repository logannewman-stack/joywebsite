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
 * A turn in the story: the clinical close-up on the left, the two lines on
 * the right, each broken after its comma so they read as a pair. The first
 * is set in grey and the second in black: before and after, without a second
 * typeface. As the block
 * comes up the screen each line eases in from the right, the second a beat
 * after the first (one clock, the block's own --v; see "The couplet" in
 * meet.css). Without motion the two lines simply sit one under the other.
 */
export function Couplet({ lines, photo }: { lines: string[]; photo: PhotoSlot }) {
  return (
    <section className="meet-couplet overflow-x-clip bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <ImageReveal className="w-[min(100%,30rem)] lg:col-span-5 lg:w-auto">
          <Parallax amount={5} className="aspect-[5/4] w-full">
            <Photo slot={photo} className="h-full w-full" sizes="(max-width: 1023px) min(100vw - 40px, 480px), (max-width: 1440px) 36vw, 30vw" />
          </Parallax>
        </ImageReveal>
        <div data-view="" className="meet-couplet-stage mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
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
