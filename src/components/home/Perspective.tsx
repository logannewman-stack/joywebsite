import { home } from "@/content/home";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { WordRise } from "@/components/motion/Text";
import { Photo } from "@/components/ui/Photo";
import { ImageReveal } from "@/components/ui/Reveal";

const { perspective } = home;

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
 * The photograph takes five of the twelve columns; the heading and the three
 * paragraphs stand beside it as plain reading text, centred on its height.
 * The paragraphs rise one after another when they are seen. On phones the
 * order is heading, photograph, paragraphs, the photograph no wider than the
 * column.
 */
export function Perspective() {
  return (
    <section aria-labelledby="perspective-heading" className="bg-paper">
      <div className="mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28 lg:grid lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-6">
        <InView className="lg:col-span-6 lg:col-start-7 lg:row-start-2">
          <h2 id="perspective-heading" className="display t-h1">
            <Heading />
          </h2>
        </InView>

        <ImageReveal className="mt-10 w-[min(100%,24rem)] lg:col-span-5 lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:mt-0 lg:w-auto">
          <Parallax amount={4} className="aspect-[4/5] w-full">
            <Photo slot={perspective.photo} className="h-full w-full" sizes="(max-width: 1023px) min(100vw - 40px, 384px), 33vw" />
          </Parallax>
        </ImageReveal>

        <InView className="stagger mt-10 flex max-w-[34rem] flex-col gap-5 lg:col-span-6 lg:col-start-7 lg:row-start-3 lg:mt-8">
          {perspective.paragraphs.map((text, i) => (
            <p key={i} className={i === 0 ? "t-lead text-ink" : "t-body text-ink"}>
              {text}
            </p>
          ))}
        </InView>
      </div>
    </section>
  );
}
