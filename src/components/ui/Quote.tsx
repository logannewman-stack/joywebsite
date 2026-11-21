import { site } from "@/content/site";
import { Reveal } from "./Reveal";

/**
 * Testimonial set large. Testimonials awaiting republishing permission are
 * shown in review mode only, with a note, and hidden at launch.
 */
export function Quote({
  heading,
  quote,
  name,
  role,
  permission,
  tone = "dark",
}: {
  heading: string;
  quote: string;
  name: string;
  role?: string;
  permission: "pending" | "granted";
  tone?: "dark" | "light";
}) {
  if (permission !== "granted" && !site.showPlaceholders) return null;
  const dark = tone === "dark";
  return (
    <section className={`grain relative overflow-hidden ${dark ? "grain-light bg-ink text-white" : "bg-ivory text-ink"}`}>
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className={`label ${dark ? "text-ash" : "text-stone"}`}>{heading}</p>
            {permission !== "granted" && (
              <p className={`label mt-3 inline-block border px-2 py-1 !text-[9px] ${dark ? "border-white/25 text-white/60" : "border-ink/25 text-stone"}`}>
                Permission to republish pending
              </p>
            )}
          </div>
          <figure className="md:col-span-9">
            <Reveal>
              <span className={`display block text-[7rem] leading-[0.5] ${dark ? "text-blush" : "text-blush-deep"}`} aria-hidden>
                “
              </span>
              <blockquote className="display mt-4 text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.06]">
                <p>{quote}</p>
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
