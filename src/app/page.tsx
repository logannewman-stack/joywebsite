import { site } from "@/content/site";
import { Nav } from "@/components/Nav";
import { VideoProvider } from "@/components/Video";
import { BackToTop } from "@/components/FooterClient";
import { Hero } from "@/components/sections/Hero";
import { Testimonial } from "@/components/sections/Testimonial";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Story } from "@/components/sections/Story";
import { Problem } from "@/components/sections/Problem";
import { About } from "@/components/sections/About";
import { Statements } from "@/components/sections/Statements";
import { Proof } from "@/components/sections/Proof";
import { VideoBand } from "@/components/sections/VideoBand";
import { Method } from "@/components/sections/Method";
import { Topics } from "@/components/sections/Topics";
import { Services } from "@/components/sections/Services";
import { FinalCta } from "@/components/sections/FinalCta";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <VideoProvider>
      <Nav />
      <main>
        <Hero />
        <Testimonial {...site.testimonialOne} image="/images/stage-lights.jpg" />
        <TrustedBy />
        <Story />
        <Problem />
        <About />
        <Statements />
        <Proof />
        <VideoBand />
        <Method />
        <Topics />
        <Testimonial id="testimonials" {...site.testimonialTwo} />
        <Services />
        <FinalCta />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </VideoProvider>
  );
}
