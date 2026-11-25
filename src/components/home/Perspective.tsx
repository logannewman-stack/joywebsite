import { home } from "@/content/home";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { WordRise } from "@/components/motion/Text";
import { Photo } from "@/components/ui/Photo";
import { ImageReveal } from "@/components/ui/Reveal";
import { typeset } from "@/components/ui/Typeset";

const { perspective } = home;

/**
 * The approved paragraphs, one sentence at a time. Wording, order and
 * punctuation are untouched: the text is only cut at its sentence ends.
 */
const statements = perspective.paragraphs.flatMap((p) => p.split(/(?<=[.!?])\s+(?=[A-Z“‘])/));

const pad = (n: number) => String(n).padStart(2, "0");

/** The heading, with its marked phrase over the pale pink marker; the words rise as one sentence. */
function Heading() {
  const text = perspective.heading;
  const mark = perspective.headingMark;
  const at = text.indexOf(mark);
  if (at < 0) return <WordRise>{text}</WordRise>;
  const before = text.slice(0, at).trim();
  const after = text.slice(at + mark.length).trim();
  const count = (t: string) => t.split(" ").filter(Boolean).length;
  return (
    <>
      {before && <WordRise>{before}</WordRise>}
      {before && " "}
      {/* The marked phrase stays on one line, so the marker is never cut in two. */}
      <span className="hl-light whitespace-nowrap">
        <WordRise start={count(before)}>{mark}</WordRise>
      </span>
      {after && " "}
      {after && <WordRise start={count(before) + count(mark)}>{after}</WordRise>}
    </>
  );
}

/**
 * "A perspective shaped by every side of dentistry.": the story, beside one
 * photograph.
 *
 * The heading runs across the top of the section. Under it the photograph
 * takes five of the twelve columns and the story stands beside it as a short
 * list: its five sentences, each under a thin line with a small number. The
 * rows rise one after another when the list is seen. On phones the
 * photograph sits between the heading and the list, no wider than the column.
 */
export function Perspective() {
  return (
    <section aria-labelledby="perspective-heading" className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">
        <InView>
          <h2 id="perspective-heading" className="display t-h1 max-w-[17em]">
            <Heading />
          </h2>
        </InView>

        <div className="mt-10 md:mt-14 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <ImageReveal className="w-[min(100%,24rem)] lg:col-span-5 lg:w-auto">
            <Parallax amount={4} className="aspect-[4/5] w-full">
              <Photo slot={perspective.photoTall} className="h-full w-full" sizes="(max-width: 1023px) min(100vw - 40px, 384px), 33vw" />
            </Parallax>
          </ImageReveal>

          <InView className="stagger mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
            {statements.map((text, i) => (
              <div key={i} className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-4 border-t border-line py-6 md:py-7">
                <span aria-hidden className="label text-stone tabular-nums">
                  {pad(i + 1)}
                </span>
                <p className="display t-h3">{typeset(text)}</p>
              </div>
            ))}
          </InView>
        </div>
      </div>
    </section>
  );
}
