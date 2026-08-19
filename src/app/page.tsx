import { Hero } from "@/components/sections/hero";
import { CapabilityBand } from "@/components/sections/capability-band";
import { AboutSection } from "@/components/sections/about-section";
import { SectorsSection } from "@/components/sections/sectors-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ShowcaseSection } from "@/components/sections/showcase-section";
import { DeliverablesSection } from "@/components/sections/deliverables-section";
import { PhotoWall } from "@/components/sections/photo-wall";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaBand } from "@/components/sections/cta-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CapabilityBand />
      <AboutSection />
      <SectorsSection />
      <ServicesSection />
      <ProcessSection />
      <ShowcaseSection />
      <DeliverablesSection />
      <PhotoWall />
      <WhyChooseUs />
      <FaqSection />
      <CtaBand />
    </>
  );
}
