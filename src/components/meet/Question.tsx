import { WordLight, WordRise } from "@/components/motion/Text";
import { bindI } from "./text";

/**
 * "If you are going to complain, why not do something about it?"
 * "I joined the board."
 *
 * The turn of the page's second story, set in the same column as the
 * paragraphs that lead to it. The question takes ink word by word as it
 * comes up the screen; the answer, one size larger, rises under it when it is
 * seen. Nothing is pinned: the page scrolls at its own speed. Without
 * JavaScript, with reduced motion and in print it is the question, then the
 * answer, in full ink.
 */
export function Question({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="meet-q mt-12 md:mt-16">
      <p className="display t-h1 max-w-[18em]">
        <WordLight from={0.12} to={0.42} dim={0.35}>
          {bindI(question)}
        </WordLight>
      </p>
      <p className="display t-hero mt-6 md:mt-8">
        <WordRise>{bindI(answer)}</WordRise>
      </p>
    </div>
  );
}
