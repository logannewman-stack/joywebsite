import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { nav, site } from "@/content/site";
import { ArrowLink, ButtonLink, Label, PendingLink, PendingTag, resolveHref } from "@/components/ui/Links";
import { typeset } from "@/components/ui/Typeset";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";

export const metadata: Metadata = {
  title: "Page not found",
  // A missing page has no canonical address or share URL (Next adds noindex to 404s itself).
  alternates: { canonical: null },
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
};

/**
 * Branded 404. Old drjoyrdh.com links that no redirect covers land here, so it
 * leads straight back into the four journeys, in the Home pathways' own words.
 */
export default function NotFound() {
  const others = nav.filter((n) => n.href === "/meet-dr-joy" || n.href === "/insights");
  return (
    <section className="bg-paper pt-[76px]">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pt-12 pb-24 md:grid-cols-12 md:gap-x-6 md:px-10 md:pt-20 md:pb-32">
        <div className="md:col-span-5">
          <Label>404</Label>
          <h1 className="display mt-8 text-[clamp(3.4rem,7.4vw,7.6rem)] leading-[0.9]">
            Page <em>not found.</em>
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-14">
            <ButtonLink href="/">Home</ButtonLink>
            <InquiryButton variant="text">{home.closing.cta}</InquiryButton>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-3">
          <Label as="h2" className="text-stone">
            {home.work.heading}
          </Label>
          <ol className="mt-6 border-t border-ink">
            {home.pathways.map((p, i) => {
              const r = resolveHref(p.link.href);
              const row = "group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-6 md:py-7";
              const inner = (
                <>
                  <span className="label text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="label block">
                      {p.kicker}
                      {r.pending && <PendingTag />}
                    </span>
                    <span className="display mt-2.5 block text-[clamp(1.6rem,2.4vw,2.2rem)] transition-transform duration-(--duration-ui) ease-expo group-hover:translate-x-1.5">
                      {typeset(p.heading)}
                    </span>
                  </span>
                  {r.external ? (
                    <ArrowUpRight className="size-4 self-center transition-transform duration-(--duration-ui) ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  ) : (
                    <ArrowRight className="size-4 self-center transition-transform duration-(--duration-ui) ease-expo group-hover:translate-x-1" aria-hidden />
                  )}
                </>
              );
              return (
                <li key={p.kicker} className="border-b border-line">
                  {r.pending ? (
                    <PendingLink className={row} title="Instrumental website link to come">
                      {inner}
                    </PendingLink>
                  ) : r.external ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className={row}>
                      {inner}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={r.href} className={row}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
            {others.map((n) => (
              <ArrowLink key={n.href} href={n.href}>
                {n.label}
              </ArrowLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
