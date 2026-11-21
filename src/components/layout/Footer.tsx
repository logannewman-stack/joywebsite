import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { links, nav, site } from "@/content/site";
import { insights } from "@/content/insights";
import { Wordmark } from "../ui/Brand";
import { instrumentalLink, PendingTag } from "../ui/Links";
import { InquiryButton } from "../inquiry/InquiryProvider";
import { NewsletterForm } from "../inquiry/NewsletterForm";
import { FooterNewsletter } from "./FooterNewsletter";
import { Year } from "./Year";

/** One route per visitor journey in the brief, each opening its own form and GoHighLevel tag. */
const work = [
  { type: "speaking", label: "Speaking inquiry" },
  { type: "p3_conference", label: "P3 for your conference" },
  { type: "p3_interest", label: "Attend a P3 event" },
  { type: "partnership", label: "Industry partnership" },
  { type: "clinical_launch", label: "Clinical launch strategy" },
] as const;

const row = "inline-flex min-h-11 items-center text-[15.5px] text-white/90 transition-colors duration-[var(--duration-hover,180ms)] hover:text-white";
const ring = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function Footer() {
  const consulting = instrumentalLink();
  return (
    <footer data-header="dark" className="grain grain-light bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-5 pt-24 pb-10 md:px-10 md:pt-32">
        <div className="flex flex-col gap-20 xl:flex-row xl:gap-24">
          <FooterNewsletter>
            <section aria-labelledby="footer-newsletter" className="@container xl:w-[44%] xl:shrink-0">
              <div className="grid grid-cols-1 gap-8 @2xl:grid-cols-2 @2xl:gap-x-12">
                <div>
                  <span aria-hidden className="mb-6 block h-px w-12 bg-blush" />
                  <p className="label text-ash">{insights.newsletter.heading}</p>
                  <h2 id="footer-newsletter" className="display mt-5 text-[clamp(2.75rem,4.6vw,4.25rem)]">
                    {insights.newsletter.name}
                  </h2>
                </div>
                <div className="@2xl:self-end">
                  <p className="max-w-[28rem] text-[17px] leading-relaxed text-balance text-ash">{insights.newsletter.text}</p>
                  <div className="mt-8 max-w-md">
                    <NewsletterForm tone="dark" cta={insights.newsletter.cta} />
                  </div>
                </div>
              </div>
            </section>
          </FooterNewsletter>

          {/* Fills the row on its own when the newsletter is left out (Insights). */}
          <div className="@container min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2">
              <nav aria-labelledby="footer-pages">
                <h2 id="footer-pages" className="label text-ash">
                  Pages
                </h2>
                <ul className="mt-4 @3xl:columns-2 @3xl:gap-10">
                  {[{ label: "Home", href: "/" }, ...nav].map((item) => (
                    <li key={item.href} className="break-inside-avoid">
                      <Link href={item.href} className={`${row} ${ring}`}>
                        <span className="link-draw pb-0.5">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <section aria-labelledby="footer-work">
                <h2 id="footer-work" className="label text-ash">
                  Work together
                </h2>
                <ul className="mt-4 @3xl:columns-2 @3xl:gap-10">
                  {work.map((w) => (
                    <li key={w.type} className="break-inside-avoid">
                      <InquiryButton variant="text" tone="dark" type={w.type} arrow={false} className={`${row} !text-[15.5px] !font-normal whitespace-nowrap`}>
                        {w.label}
                      </InquiryButton>
                    </li>
                  ))}
                  <li className="break-inside-avoid">
                    {consulting.pending ? (
                      // Review mode only: the launch build requires the Instrumental URL.
                      <span
                        role="link"
                        aria-disabled="true"
                        tabIndex={0}
                        title="Instrumental website link to come"
                        className={`${row} ${ring} cursor-not-allowed flex-wrap gap-x-2 gap-y-1 py-2`}
                      >
                        <span className="whitespace-nowrap">Consulting at Instrumental</span>
                        <ArrowUpRight className="size-4" aria-hidden />
                        <PendingTag className="!ml-0" />
                      </span>
                    ) : (
                      <a href={consulting.href} target="_blank" rel="noopener noreferrer" className={`group ${row} ${ring} gap-2 whitespace-nowrap`}>
                        <span className="link-draw pb-0.5">Consulting at Instrumental</span>
                        <ArrowUpRight
                          className="size-4 transition-transform duration-[var(--duration-hover,180ms)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                  <li className="break-inside-avoid pt-3">
                    <a
                      href={`mailto:${site.email}`}
                      className={`${row} ${ring} text-white underline decoration-white/35 decoration-1 underline-offset-[6px] hover:decoration-white`}
                    >
                      {site.email}
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        {/* Signed off with the script wordmark, set large. */}
        <div className="mt-24 flex flex-col gap-8 border-t border-line-dark pt-12 md:mt-32 md:flex-row md:items-end md:justify-between md:pt-16">
          <Link href="/" aria-label={`${site.name}, home`} className={`self-start ${ring}`}>
            <Wordmark tone="dark" className="!h-[clamp(4.5rem,10vw,8.5rem)]" />
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[13px] text-ash md:pb-3">
            <span>
              © <Year /> {site.name}. All rights reserved.
            </span>
            {links.privacy && (
              <a href={links.privacy} className={`inline-flex min-h-11 items-center ${ring}`}>
                <span className="link-draw">Privacy Policy</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
