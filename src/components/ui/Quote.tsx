import { notes, site, type PhotoSlot } from "@/content/site";
import { Parallax } from "@/components/motion/Parallax";
import { WordLight } from "@/components/motion/Text";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { typeset } from "./Typeset";

type Tone = "dark" | "light" | "paper";

// Grain only on black; white stays clean.
const surfaces: Record<Tone, string> = {
  dark: "grain grain-light bg-ink text-white",
  light: "bg-paper text-ink",
  paper: "bg-paper text-ink",
};

/** Sentence split that keeps "Dr. Joy" together. */
function sentences(text: string): string[] {
  const out: string[] = [];
  const re = /[.!?]["”’)]*\s+(?=["“‘(]?[A-Z])/g;
  let start = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (/\b(?:Dr|Mr|Mrs|Ms|St|Prof|Jr|Sr|vs|etc)\.$/.test(text.slice(start, m.index + 1))) continue;
    out.push(text.slice(start, m.index + m[0].length).trim());
    start = m.index + m[0].length;
  }
  out.push(text.slice(start).trim());
  return out.filter(Boolean);
}

/** Keeps one- and two-letter words ("It", "a", "to") off the end of a line by binding each to the next word. */
function bindShort(text: string): string {
  return text.replace(/(?<=^|\s)([A-Za-z]{1,2})\s+(?=\S)/g, "$1\u00a0");
}

/**
 * Long testimonials read as a wall at display size. When a quote runs past
 * about 220 characters and has more than one sentence, its opening sentence
 * is set large and the rest follows at reading size. Wording and order are
 * unchanged; only the type size differs.
 */
function shape(quote: string): { lead: string; rest: string } {
  if (quote.length <= 220) return { lead: quote, rest: "" };
  const s = sentences(quote);
  if (s.length < 2) return { lead: quote, rest: "" };
  let n = 1;
  while (n < s.length - 1 && s.slice(0, n).join(" ").length < 24) n++;
  return { lead: s.slice(0, n).join(" "), rest: s.slice(n).join(" ") };
}

/**
 * Testimonial set as a heading, with a hanging opening quote mark. Its words
 * brighten one after another as it scrolls into view. Testimonials awaiting
 * republishing permission are shown in review mode only, with a note, and
 * hidden at launch.
 *
 * `backdrop` (dark tone only) sets the quote over a dimmed, slowly drifting
 * photograph, e.g. a room or an audience.
 */
export function Quote({
  heading,
  quote,
  name,
  role,
  permission,
  tone = "dark",
  size,
  className = "",
  id,
  backdrop,
}: {
  heading: string;
  quote: string;
  name: string;
  role?: string;
  permission: "pending" | "granted";
  tone?: Tone;
  /** "lg" for short quotes, "md" for long ones. Defaults by length. */
  size?: "lg" | "md";
  /** Extra classes for the section, e.g. to tighten its padding next to a same-colored section. */
  className?: string;
  id?: string;
  /** A photograph behind a dark quote, dimmed so the words stay first. */
  backdrop?: PhotoSlot;
}) {
  if (permission !== "granted" && !site.showPlaceholders) return null;
  const dark = tone === "dark";
  const { lead, rest } = shape(quote);
  const scale = size ?? (lead.length > 120 ? "md" : "lg");
  const mark = dark ? "text-ash" : "text-stone";
  return (
    <section id={id} className={`relative overflow-hidden ${surfaces[tone]} ${className}`} data-tone={tone} data-header={dark ? "dark" : undefined}>
      {dark && backdrop?.src && (
        <div aria-hidden className="absolute inset-0">
          <Parallax className="h-full w-full" amount={6}>
            <Photo slot={{ ...backdrop, alt: "" }} tone="dark" className="h-full w-full grayscale" sizes="100vw" />
          </Parallax>
          <div className="absolute inset-0 bg-ink/80" />
        </div>
      )}
      <div className="relative mx-auto max-w-(--wrap) px-5 py-20 md:px-10 md:py-28">
        <div className="grid md:grid-cols-12 md:gap-x-6">
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-3"
          >
            <h2 className={`label ${dark ? "text-ash" : "text-stone"}`}>{heading}</h2>
            {permission !== "granted" && notes && (
              <p
                className={`label rounded-full border px-2 py-0.5 !text-[0.5625rem] whitespace-nowrap ${dark ? "border-white/25 text-white/60" : "border-ink/25 text-stone"}`}
              >
                Permission to republish pending
              </p>
            )}
          </div>
          <figure className="mt-10 md:col-span-10 md:col-start-2 md:mt-14 lg:col-span-9 lg:col-start-3">
            <Reveal>
              <blockquote className="relative">
                <p
                  className={`display ${
                    scale === "lg"
                      ? "t-h1 max-w-[22ch]"
                      : "t-h2 max-w-[30ch] !text-pretty"
                  }`}
                >
                  <span aria-hidden className={`mr-[0.06em] md:absolute md:top-0 md:-left-[0.5em] md:mr-0 ${mark}`}>
                    “
                  </span>
                  <WordLight from={0.14} to={0.44} dim={dark ? 0.4 : 0.5}>
                    {bindShort(lead)}
                  </WordLight>
                </p>
                {rest && (
                  <p className="t-lead mt-6 max-w-[38rem] md:mt-8">{typeset(bindShort(rest))}</p>
                )}
              </blockquote>
            </Reveal>
            <Reveal delay={0.1}>
              <figcaption className="mt-10 flex flex-col gap-1 md:mt-12">
                <span className="text-[1rem] font-medium">{name}</span>
                {role && <span className={`text-[0.9375rem] ${dark ? "text-ash" : "text-stone"}`}>{role}</span>}
              </figcaption>
            </Reveal>
          </figure>
        </div>
      </div>
    </section>
  );
}
