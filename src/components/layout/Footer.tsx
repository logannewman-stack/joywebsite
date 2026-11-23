import Link from "next/link";
import { links, nav, site } from "@/content/site";
import { insights } from "@/content/insights";
import { Wordmark } from "../ui/Brand";
import { instrumentalLink, PendingTag, SwapArrow } from "../ui/Links";
import { Magnetic } from "../motion/InView";
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

const row = "inline-flex min-h-11 items-center text-[0.96875rem] text-white/90 transition-colors duration-[var(--duration-hover,180ms)] hover:text-white";
const ring = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/*
 * The finale. With motion on, the footer sits still under the page and is
 * uncovered as the page's last section scrolls away, like a curtain lifting
 * (position: sticky; styles/chrome.css). From 1280px it is one full screen:
 * the columns on top, the script wordmark signed large underneath, sized to
 * the height that is left. The wordmark writes itself in once it is in the
 * open, and a magnetic button leads back to the top.
 *
 * Because a sticky footer is "on screen" even while the page covers it, three
 * things are handled outside it: the header's dark marking is a stand-in in
 * the footer's place in the flow (.foot-ghost, in PageShell), keyboard focus
 * on a covered link scrolls it into the open, and the wordmark's entrance is
 * triggered by the chrome script instead of an [data-inview] observer.
 * It is only held near the end of the page ([data-near], from the same
 * script); above that it is an ordinary block below the fold.
 * Without motion it is an ordinary footer at the end of the page.
 */
export function Footer() {
  const consulting = instrumentalLink();
  return (
    <footer className="site-footer grain grain-light bg-ink text-white" suppressHydrationWarning>
      <div className="foot-inner mx-auto flex max-w-[90rem] flex-col px-5 pt-20 pb-8 md:px-10 md:pt-24 xl:min-h-svh xl:pt-[min(7rem,11svh)] xl:pb-[min(2.5rem,4svh)]">
        {/* From 1280px the bottom padding is the least space above the signature's rule (part of --foot-cols in chrome.css). */}
        <div className="flex flex-col gap-16 xl:flex-row xl:gap-24 xl:pb-[2.125rem]">
          <FooterNewsletter>
            <section aria-labelledby="footer-newsletter" className="@container xl:w-[44%] xl:shrink-0">
              <div className="grid grid-cols-1 gap-8 @2xl:grid-cols-2 @2xl:gap-x-12">
                <div>
                  <p className="label text-ash">{insights.newsletter.heading}</p>
                  <h2 id="footer-newsletter" className="display mt-5 text-[clamp(2.75rem,4.6vw,4.25rem)]">
                    {insights.newsletter.name}
                  </h2>
                </div>
                <div className="@2xl:self-end">
                  <p className="max-w-[28rem] text-[1.0625rem] leading-relaxed !text-balance text-ash">{insights.newsletter.text}</p>
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
                      <InquiryButton variant="text" tone="dark" type={w.type} arrow={false} className={`${row} !text-[0.96875rem] !font-normal whitespace-nowrap`}>
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
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          Consulting at Instrumental
                          <SwapArrow direction="up-right" />
                        </span>
                        <PendingTag className="!ml-0" />
                      </span>
                    ) : (
                      <a href={consulting.href} target="_blank" rel="noopener noreferrer" className={`group ${row} ${ring} gap-2 whitespace-nowrap`}>
                        <span className="link-draw pb-0.5">Consulting at Instrumental</span>
                        <SwapArrow direction="up-right" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                  <li className="break-inside-avoid pt-3">
                    <a
                      href={`mailto:${site.email}`}
                      className={`${row} ${ring} text-white underline decoration-white/35 decoration-1 underline-offset-[0.375rem] hover:decoration-white`}
                    >
                      {site.email}
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        {/* Signed off with the script wordmark, as large as the screen allows. */}
        <div className="foot-sign relative mt-20 pt-10 md:mt-24 md:pt-12 xl:mt-auto xl:pt-[min(3rem,5svh)]" suppressHydrationWarning>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
            <Link href="/" aria-label={`${site.name}, home`} className={`foot-mark-link block min-w-0 self-start md:self-end ${ring}`}>
              <Wordmark tone="dark" loading="lazy" className="foot-mark !h-auto w-full max-w-none" />
            </Link>
            {/* A set width from tablet up, so the wordmark beside it never resizes when the web fonts arrive. */}
            <div className="flex shrink-0 flex-row-reverse items-end justify-between gap-8 md:w-[15rem] md:flex-col md:items-end md:justify-end md:gap-[min(2.5rem,4svh)]">
              {/* Back to the start of the page: the skip link's target, so keyboard focus moves up with the view. */}
              <a href="#main" data-to-top className={`group inline-flex items-center gap-4 rounded-full ${ring}`}>
                <span className="label hidden text-ash transition-colors duration-(--duration-hover) group-hover:text-white sm:inline">Back to top</span>
                <span className="sr-only sm:hidden">Back to top</span>
                <Magnetic strength={0.35}>
                  <span className="press inline-flex size-14 items-center justify-center rounded-full border border-gold/80 group-hover:border-gold group-hover:bg-gold group-hover:text-ink group-focus-visible:border-gold group-focus-visible:bg-gold group-focus-visible:text-ink md:size-16">
                    <SwapArrow direction="up" className="size-5" />
                  </span>
                </Magnetic>
              </a>
              <div className="flex flex-col gap-x-6 gap-y-1 text-[0.8125rem] text-ash md:flex-row md:flex-wrap md:items-center md:justify-end md:text-right">
                <span className="md:whitespace-nowrap">
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
        </div>
      </div>
    </footer>
  );
}
