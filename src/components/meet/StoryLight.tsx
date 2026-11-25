import { Fragment, type CSSProperties, type ReactNode } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The opening story. On phones and tablets its words take full ink one after
 * another as the visitor reads down the page, in one continuous sweep across
 * the paragraphs; on a desktop the whole story is on the first screen and is
 * simply in full ink.
 *
 * The scroll engine writes --v on the block; each word carries its place in
 * the whole story (--i of --n), and meet.css turns that into opacity. Words
 * not yet reached keep enough ink to pass body-text contrast. The words stay
 * plain inline text (no display typesetting: this is body copy), so screen
 * readers, search and copy-paste get the paragraphs unchanged. Without
 * JavaScript, with reduced motion and in print every word is full ink.
 *
 * `wrap` lets the page give each paragraph its own entrance.
 */
export function StoryLight({
  paragraphs,
  className = "",
  paragraphClassName,
  wrap = (p) => p,
}: {
  paragraphs: string[];
  className?: string;
  paragraphClassName: (index: number) => string;
  wrap?: (paragraph: ReactNode, index: number) => ReactNode;
}) {
  const words = paragraphs.map((p) => p.split(" ").filter(Boolean));
  const total = words.reduce((n, w) => n + w.length, 0);
  const style: Vars = { "--n": total };
  let count = 0;
  return (
    <div data-view="" className={`meet-story ${className}`} style={style}>
      {words.map((list, pi) => (
        <Fragment key={pi}>
          {wrap(
            <p className={paragraphClassName(pi)}>
              {list.map((word, wi) => {
                const i = count++;
                return (
                  <Fragment key={wi}>
                    {wi > 0 && " "}
                    <span className="sl" style={{ "--i": i } as Vars}>
                      {word}
                    </span>
                  </Fragment>
                );
              })}
            </p>,
            pi,
          )}
        </Fragment>
      ))}
    </div>
  );
}
