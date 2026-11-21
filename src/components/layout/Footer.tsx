import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { links, nav, site } from "@/content/site";
import { insights } from "@/content/insights";
import { Wordmark } from "../ui/Brand";
import { NewsletterForm } from "../inquiry/InquiryForm";
import { InquiryButton } from "../inquiry/InquiryProvider";
import { Year } from "./Year";

export function Footer() {
  return (
    <footer className="grain grain-light bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-5 pt-20 pb-10 md:px-10 md:pt-28">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="label text-ash">{insights.newsletter.name}</p>
            <p className="display mt-5 max-w-xl text-[clamp(2.2rem,4.4vw,3.6rem)]">{insights.newsletter.text}</p>
            <div className="mt-10 max-w-md">
              <NewsletterForm tone="dark" cta={insights.newsletter.cta} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 lg:pt-2">
            <div>
              <p className="label text-ash">Pages</p>
              <ul className="mt-5 flex flex-col gap-1">
                <li>
                  <Link href="/" className="link-draw inline-block py-1.5 text-[15px]">
                    Home
                  </Link>
                </li>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-draw inline-block py-1.5 text-[15px]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-ash">Work together</p>
              <ul className="mt-5 flex flex-col items-start gap-1">
                <li>
                  <InquiryButton variant="text" type="speaking" className="!min-h-0 py-1.5 !text-[15px] !font-normal">
                    Speaking inquiry
                  </InquiryButton>
                </li>
                <li>
                  <InquiryButton variant="text" type="partnership" className="!min-h-0 py-1.5 !text-[15px] !font-normal">
                    Industry partnership
                  </InquiryButton>
                </li>
                <li>
                  <a
                    href={links.instrumental || "#"}
                    {...(links.instrumental ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-1 py-1.5 text-[15px]"
                  >
                    <span className="link-draw">Consulting at Instrumental</span>
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-line-dark pt-8 md:flex-row md:items-end md:justify-between">
          <Link href="/" aria-label={`${site.name}, home`}>
            <Wordmark tone="dark" className="scale-125 origin-left" />
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-ash">
            <span>
              © <Year /> {site.name}. All rights reserved.
            </span>
            {links.privacy && (
              <a href={links.privacy} className="link-draw">
                Privacy Policy
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
