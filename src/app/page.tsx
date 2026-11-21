import type { Metadata, Viewport } from "next";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { heroes } from "@/components/home/Heroes";
import { Pathways } from "@/components/home/Pathways";
import { ArtDirected } from "@/components/home/ArtDirected";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { Quote } from "@/components/ui/Quote";
import { typeset } from "@/components/ui/Typeset";
import { InquiryButton } from "@/components/inquiry/InquiryProvider";

// Approved copy only: the headline for the title, and the line that names the work for the description.
const title = `${site.name} | ${home.hero.heading}`;
const description = home.perspective.paragraphs[2];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/** Mobile browser chrome matches the opening screen (black for Direction B). */
export const viewport: Viewport = {
  themeColor: { a: "#ffffff", b: "#0b0b0b", c: "#f5f1e9" }[site.homeHero],
};

export default function Home() {
  const Hero = heroes[site.homeHero];
  const { perspective, work, closing, testimonial } = home;
  const [lede, middle, bridge] = perspective.paragraphs;
  // Ivory brings warmth after a black or white opening; after C's ivory opening it switches to white.
  const perspectiveTone = site.homeHero === "c" ? "bg-paper" : "bg-ivory";

  return (
    <>
      <Hero />

      {/* A perspective shaped by every side of dentistry: the story, paced around one full-bleed photograph. */}
      <section className={perspectiveTone} aria-labelledby="perspective-heading">
        <div className="mx-auto grid max-w-[1440px] gap-y-10 px-5 pt-24 md:px-10 md:pt-32 lg:grid-cols-12 lg:gap-x-6 lg:pt-40">
          <Reveal className="lg:col-span-11">
            <h2 id="perspective-heading" className="display max-w-[20ch] text-[clamp(2.75rem,6.4vw,6.5rem)] leading-[0.92]">
              {perspective.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-6 lg:col-start-7 lg:mt-4">
            <p className="display max-w-[32rem] text-[clamp(1.65rem,2.5vw,2.4rem)] leading-[1.16] tracking-[-0.005em] lg:max-w-none">{typeset(lede)}</p>
          </Reveal>
        </div>

        <ImageReveal className="relative mt-16 aspect-[4/5] w-full bg-sand md:mt-24 md:aspect-[16/9] lg:aspect-auto lg:h-[min(84svh,880px)]">
          <ArtDirected wide={perspective.photo} tall={perspective.photoTall} at="md" sizesWide="100vw" sizesTall="100vw" />
        </ImageReveal>

        <div className="mx-auto grid max-w-[1440px] gap-y-8 px-5 pt-14 pb-24 md:px-10 md:pt-20 md:pb-32 lg:grid-cols-12 lg:gap-x-6 lg:pb-40">
          <Reveal className="lg:col-span-5 lg:col-start-1">
            <p className="max-w-[36rem] text-[17px] leading-relaxed text-stone md:text-[18px]">{middle}</p>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-6 lg:col-start-7">
            <p className="display max-w-[32rem] text-[clamp(1.65rem,2.5vw,2.4rem)] leading-[1.16] tracking-[-0.005em] lg:max-w-none">{typeset(bridge)}</p>
          </Reveal>
        </div>
      </section>

      {/* Explore My Work: the four pathways */}
      <section id="work" className="bg-paper" aria-labelledby="work-heading">
        <div className="mx-auto max-w-[1440px] px-5 pt-24 pb-28 md:px-10 md:pt-32 md:pb-36 lg:pt-36 lg:pb-44">
          <Reveal>
            <h2 id="work-heading" className="display text-[clamp(2.75rem,6.4vw,6.5rem)] leading-[0.92]">
              {work.heading}
            </h2>
          </Reveal>
          <div className="mt-12 md:mt-16 lg:mt-20">
            <Pathways />
          </div>
        </div>
      </section>

      {/* What Others Are Saying: big type on black. Marked dark so the header switches over it. */}
      <div data-header="dark">
        <Quote {...testimonial} tone="dark" />
      </div>

      {/* Let's start a conversation: the page ends on one centered invitation. */}
      <section className="bg-ivory" aria-labelledby="closing-heading">
        <div className="mx-auto max-w-[1440px] px-5 py-24 text-center md:px-10 md:py-36 lg:py-44">
          <Reveal>
            <h2 id="closing-heading" className="display mx-auto max-w-[11ch] text-[clamp(3rem,7.6vw,7.75rem)] leading-[0.92]">
              {closing.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mx-auto mt-8 max-w-[34rem] text-[17px] leading-relaxed text-stone md:mt-10 md:text-[18px]">{closing.body}</p>
            <InquiryButton className="mt-10">{closing.cta}</InquiryButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
