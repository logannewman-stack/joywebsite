import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { launchBlockers, site } from "@/content/site";
import { optIns } from "@/content/integrations";
import { InquiryProvider } from "@/components/inquiry/InquiryProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageShell } from "@/components/chrome/PageShell";
import { Curtain } from "@/components/chrome/Curtain";
import { CHROME_BODY_SCRIPT, CHROME_HEAD_SCRIPT } from "@/components/chrome/script";
import { REVEAL_BODY_SCRIPT } from "@/components/ui/Reveal";
import { ANCHOR_BODY_SCRIPT, MOTION_BODY_SCRIPT, MOTION_HEAD_SCRIPT } from "@/components/motion/engine";
import { StructuredData } from "@/components/ui/StructuredData";
import { insights } from "@/content/insights";
import { isShown } from "@/components/insights/records";
import "./globals.css";

// Launch build (site.showPlaceholders false): stop here, with a list, if anything required is missing.
// Insights must not launch empty ("No empty blog"): at least one confirmed record or original article.
const insightsEmpty =
  !insights.published.articles.some(isShown) && !insights.original.articles.some((a) => a.href || a.body?.length);
const blockers = launchBlockers({ smsOptIn: Boolean(optIns.sms), insightsEmpty });
if (blockers.length) {
  throw new Error(`Not ready to launch (site.showPlaceholders is false):\n- ${blockers.join("\n- ")}`);
}

// Two families for the whole site, beside the script logo.
// Headings: Archivo, bold and a little wide. Headings use exactly one cut of it (weight 700, width
// 112%), so the site carries that one cut as its own small file (22 KB, Latin and extended Latin)
// instead of the full variable font (90 KB). How the file was made: src/app/fonts/README.md.
const archivo = localFont({
  src: "./fonts/archivo-bold-wide.woff2",
  variable: "--font-archivo",
  weight: "700",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "112%" }],
});

// Body text, navigation, labels and buttons: DM Sans. Upright only: the site sets nothing in italic.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Home has no title of its own, so the default names the work with the site's page names.
  title: { default: `${site.name} | Speaking, Hands-On Education, and Industry Collaborations`, template: `%s | ${site.name}` },
  description: site.description,
  // "./" resolves to each page's own address, so every page gets its own canonical and og:url.
  alternates: { canonical: "./" },
  openGraph: { siteName: site.name, type: "website", locale: "en_US", url: "./" },
  twitter: { card: "summary_large_image" },
  // Review mode is never indexed. Launch (showPlaceholders false) lifts this.
  ...(site.showPlaceholders ? { robots: { index: false, follow: false } } : {}),
};

// No themeColor in the viewport export: the theme-color tag is created and kept up to date by the
// chrome scripts (black under the opening curtain, then ink or white with the header).

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_HEAD_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: CHROME_HEAD_SCRIPT }} />
        <StructuredData />
      </head>
      <body>
        <Curtain />
        <InquiryProvider>
          <Header />
          <PageShell footer={<Footer />}>{children}</PageShell>
        </InquiryProvider>
        {/* The cursor label: shown by the chrome script over [data-cursor] elements (fine pointers, motion on). */}
        <div className="site-cursor" aria-hidden="true">
          <span className="cursor-disc">
            <span className="cursor-label label" />
          </span>
        </div>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BODY_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: MOTION_BODY_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: ANCHOR_BODY_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: CHROME_BODY_SCRIPT }} />
      </body>
    </html>
  );
}
