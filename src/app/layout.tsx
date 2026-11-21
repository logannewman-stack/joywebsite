import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { site } from "@/content/site";
import { InquiryProvider } from "@/components/inquiry/InquiryProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { REVEAL_BODY_SCRIPT, REVEAL_HEAD_SCRIPT } from "@/components/ui/Reveal";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrument.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_HEAD_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <InquiryProvider>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
          </InquiryProvider>
        </Providers>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BODY_SCRIPT }} />
      </body>
    </html>
  );
}
