import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { CtaBand } from "@/components/sections/cta-band";
import { about } from "@/data/content";
import { site } from "@/data/site";
import { sectors } from "@/data/services";
import {
  BadgeRow,
  standardMarks,
  softwareMarks,
} from "@/components/ui/standard-badge";
import { stats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Irontech Steel Detailing Services Pvt Ltd — an in-house team detailing structural and miscellaneous steel to AISC, NISD and OSHA standards using SDS/2.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={about.title}
        intro={`${site.legalName} — detailing structural and miscellaneous steel for fabricators and erectors who cannot afford a bad drawing.`}
        image="/assets/images/maccrayentry-construction-photo.jpg"
        imageAlt="Steel frame under construction"
      />

      <section className="pb-24">
        <div className="container-x grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <div className="space-y-6">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <p className="text-muted-foreground text-[1.02rem] leading-relaxed text-pretty">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="space-y-8">
            <Reveal from="scale">
              <div className="border-border/60 relative aspect-3/4 overflow-hidden rounded-2xl border">
                <Image
                  src="/assets/images/cooper-west-high-school700-tons.jpg"
                  alt="Cooper West High School steel frame, 700 tons detailed"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal
              stagger={0.08}
              className="border-border/60 bg-border/60 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2"
            >
              {stats.map((s) => (
                <div key={s.label} className="bg-background p-5">
                  <p className="font-heading text-primary text-2xl [--heading-weight:800]">
                    {s.value.toLocaleString()}
                    {s.suffix}
                  </p>
                  <p className="text-muted-foreground mt-1 font-mono text-[0.58rem] tracking-[0.14em] uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </Reveal>

            <Reveal className="space-y-6">
              <div>
                <p className="eyebrow mb-3">Standards</p>
                <BadgeRow marks={standardMarks} className="sm:grid-cols-1" />
              </div>
              <div>
                <p className="eyebrow mb-3">Software</p>
                <BadgeRow marks={softwareMarks} className="sm:grid-cols-1" />
              </div>
              <div>
                <p className="eyebrow mb-3">Sectors</p>
                <div className="flex flex-wrap gap-2">
                  {sectors.map((s) => (
                    <span
                      key={s}
                      className="border-border/70 rounded-full border px-4 py-1.5 font-mono text-[0.65rem] tracking-[0.16em] uppercase"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CtaBand />
    </>
  );
}
