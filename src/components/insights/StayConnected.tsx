import { NewsletterForm } from "@/components/inquiry/InquiryForm";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The page's one signup and its black moment. The visible label and the
 * nameplate form a single heading ("Stay Connected, From Dr. Joy"), so it
 * reads differently from the "From Dr. Joy" articles heading, and its
 * nameplate stays smaller than the page's H1.
 */
export function StayConnected({ heading, name, text, cta }: { heading: string; name: string; text: string; cta: string }) {
  // "From Dr. Joy" set as a masthead: the name in italic.
  const nameplate = name.startsWith("From ") ? (
    <>
      From <em>{name.slice(5)}</em>
    </>
  ) : (
    name
  );
  return (
    <section className="grain grain-light bg-ink text-white">
      <div className="mx-auto grid grid-cols-1 max-w-[1440px] gap-y-12 px-5 py-24 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-x-6 lg:py-36">
        <Reveal className="lg:col-span-6">
          <h2>
            <span className="label flex items-center gap-3 text-ash">
              <span className="h-px w-10 bg-blush" aria-hidden />
              {heading}
              <span className="sr-only">: </span>
            </span>
            <span className="display mt-7 block text-[clamp(2.8rem,5.4vw,5.6rem)] leading-[0.95]">{nameplate}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-7 lg:self-end">
          <p className="max-w-[46ch] text-[18px] leading-relaxed text-white/80">{text}</p>
          <div className="mt-9 max-w-md">
            <NewsletterForm tone="dark" cta={cta} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
