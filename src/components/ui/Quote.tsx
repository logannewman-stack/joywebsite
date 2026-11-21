import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { typeset } from "./Typeset";

type Tone = "dark" | "light" | "paper";

const surfaces: Record<Tone, string> = {
  dark: "grain grain-light bg-ink text-white",
  light: "grain bg-ivory text-ink",
  paper: "bg-paper text-ink",
};

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
}: {
  heading: string;
  quote: string;
  name: string;
  role?: string;
  permission: "pending" | "granted";
  tone?: Tone;
  /** "lg" for short quotes, "md" for long ones. Defaults by word count. */
  size?: "lg" | "md";
}) {
  if (permission !== "granted" && !site.showPlaceholders) return null;
  const dark = tone === "dark";
  const scale = size ?? (quote.split(/\s+/).length > 32 ? "md" : "lg");
  return (
    <section className={`relative overflow-hidden ${surfaces[tone]}`}>
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 className={`label ${dark ? "text-ash" : "text-stone"}`}>{heading}</h2>
            {permission !== "granted" && (
              <p className={`label mt-3 inline-block border px-2 py-1 !text-[9px] ${dark ? "border-white/25 text-white/60" : "border-ink/25 text-stone"}`}>
                Permission to republish pending
              </p>
            )}
          </div>
          <figure className="lg:col-span-9">
            <Reveal>
              <blockquote
                className={`display relative ${
                  scale === "lg" ? "text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.06]" : "max-w-[34ch] text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.1]"
                }`}
              >
                <p>
                  <span aria-hidden className={`md:absolute md:top-0 md:-left-[0.48em] ${dark ? "text-blush" : "text-blush-deep"}`}>
                    “
                  </span>
                  {typeset(quote)}
                </p>
              </blockquote>
            </Reveal>
            <Reveal delay={0.15}>
              <figcaption className="mt-10 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
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
