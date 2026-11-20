import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/content/site";
import "./globals.css";

const clash = localFont({
  variable: "--font-clash",
  display: "swap",
  src: [
    { path: "../fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clash.variable} ${dmSans.variable} ${instrument.variable} ${geistMono.variable}`}
    >
      <body id="top">{children}</body>
    </html>
  );
}
