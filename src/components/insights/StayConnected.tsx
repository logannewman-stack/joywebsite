import { NewsletterForm } from "@/components/inquiry/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The page's one signup and its black moment. It wears the footer's From
 * Dr. Joy treatment (a blush rule above the label, the roman nameplate, the
 * ash note), so the newsletter has one design across the site. The visible
 * label and the nameplate form a single heading ("Stay Connected, From Dr.
 * Joy"), so it reads differently from the "From Dr. Joy" articles heading,
 * and its nameplate stays smaller than the page's H1.
 */
export function StayConnected({ heading, name, text, cta }: { heading: string; name: string; text: string; cta: string }) {
  return (
    <section data-header="dark" className="grain grain-light bg-ink text-white">
      <div className="mx-auto grid grid-cols-1 max-w-[1440px] gap-y-12 px-5 py-24 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-x-6 lg:py-36">
        <Reveal className="lg:col-span-6">
          <span aria-hidden className="mb-6 block h-px w-12 bg-blush" />
          <h2>
            <span className="label block text-ash">
              {heading}
              <span className="sr-only">: </span>
            </span>
            <span className="display mt-5 block text-[clamp(2.75rem,4.6vw,4.25rem)]">{name}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-7 lg:self-end">
          <p className="max-w-[28rem] text-[17px] leading-relaxed !text-balance text-ash">{text}</p>
          <div className="mt-8 max-w-md">
            <NewsletterForm tone="dark" cta={cta} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
