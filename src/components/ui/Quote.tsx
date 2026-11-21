import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { typeset } from "./Typeset";

type Tone = "dark" | "light" | "paper";

// Grain only on black: plain ivory and white match the sections around them,
// so a light quote next to an ivory section never shows a seam.
const surfaces: Record<Tone, string> = {
  dark: "grain grain-light bg-ink text-white",
  light: "bg-ivory text-ink",
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
 * Testimonial set large, with a hanging opening quote mark. Testimonials
 * awaiting republishing permission are shown in review mode only, with a
 * note, and hidden at launch.
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
}) {
  if (permission !== "granted" && !site.showPlaceholders) return null;
  const dark = tone === "dark";
  const { lead, rest } = shape(quote);
  const scale = size ?? (lead.length > 120 ? "md" : "lg");
  const mark = dark ? "text-blush" : "text-blush-deep";
  return (
    <section id={id} className={`relative overflow-hidden ${surfaces[tone]} ${className}`} data-header={dark ? "dark" : undefined}>
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid md:grid-cols-12 md:gap-x-6">
          <div
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-5 md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-3 ${
              dark ? "border-line-dark" : "border-line"
            }`}
          >
            <h2 className={`label ${dark ? "text-ash" : "text-stone"}`}>{heading}</h2>
            {permission !== "granted" && (
              <p
                className={`label rounded-full border px-2 py-0.5 !text-[9px] whitespace-nowrap ${dark ? "border-white/25 text-white/60" : "border-ink/25 text-stone"}`}
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
                      ? "max-w-[24ch] text-[clamp(2.15rem,4.6vw,4.5rem)] !leading-[1.04]"
                      : "max-w-[34ch] text-[clamp(1.8rem,3.2vw,3.1rem)] !leading-[1.1] !text-pretty"
                  }`}
                >
                  <span aria-hidden className={`mr-[0.06em] md:absolute md:top-0 md:-left-[0.5em] md:mr-0 ${mark}`}>
                    “
                  </span>
                  {typeset(lead)}
                </p>
                {rest && (
                  <p className="mt-6 max-w-[44ch] font-serif text-[clamp(1.3rem,1.9vw,1.65rem)] leading-[1.32] md:mt-8">{typeset(rest)}</p>
                )}
              </blockquote>
            </Reveal>
            <Reveal delay={0.1}>
              <figcaption className="mt-10 flex flex-col gap-1 md:mt-12 md:flex-row md:items-center md:gap-4">
                <span className="text-[16px] font-medium">{name}</span>
                {role && (
                  <>
                    <span className={`hidden h-px w-6 md:block ${dark ? "bg-white/40" : "bg-ink/30"}`} aria-hidden />
                    <span className={`text-[15px] ${dark ? "text-ash" : "text-stone"}`}>{role}</span>
                  </>
                )}
              </figcaption>
            </Reveal>
          </figure>
        </div>
      </div>
    </section>
  );
}
