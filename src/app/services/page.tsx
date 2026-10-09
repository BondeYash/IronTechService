import type { Metadata } from "next";
import { ProjectPhoto } from "@/components/projects/project-photo";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal, Parallax } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { ServicesSection } from "@/components/sections/services-section";
import { CtaBand } from "@/components/sections/cta-band";
import { servicesPage, deliverables, sectors } from "@/data/services";
import { BadgeRow, standardMarks, softwareMarks } from "@/components/ui/standard-badge";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Structural steel drafting and detailing: shop and erection drawings, SDS/2 models, connection design, ABM, bolt and joist lists, deck layouts, CNC/DXF/KISS files and Tekla EPM transfers.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title={servicesPage.title}
        intro="Shop drawings, erection plans and machine-ready files for fabricators and erectors — modelled once, checked in house, and issued ready to cut."
        image="/assets/images/cooper-west-trusses.jpg"
        imageAlt="Steel trusses"
      />

      <section className="pb-24">
        <div className="container-x grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="eyebrow">{servicesPage.sectionTitle}</p>
            </Reveal>
            <div className="mt-6 space-y-5">
              {servicesPage.intro.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="mt-10">
              <div className="border-primary/40 bg-primary/5 rounded-xl border-l-2 p-6">
                <p className="text-sm leading-relaxed">
                  Building stability depends on the detail. A small error in a connection or a
                  member mark travels all the way to the field — which is why every package is
                  modelled and checked before it is issued.
                </p>
              </div>
            </Reveal>

            <div className="mt-12">
              <Reveal>
                <p className="eyebrow mb-5">Sectors we detail for</p>
              </Reveal>
              <Reveal stagger={0.06} className="flex flex-wrap gap-2">
                {[...sectors, "Bridges", "High-rise", "Tunnels"].map((s) => (
                  <span
                    key={s}
                    className="border-border/70 rounded-full border px-4 py-2 font-mono text-[0.65rem] tracking-[0.16em] uppercase"
                  >
                    {s}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>

          <div className="space-y-6">
            <Parallax amount={40}>
              <div className="border-border/60 bg-muted relative overflow-hidden rounded-2xl border">
                <ProjectPhoto
                  src="/assets/images/sinclair-nursingschool600-tons.jpg"
                  alt="Sinclair Nursing School steel package, 600 tons detailed"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-contain"
                />
              </div>
            </Parallax>
            <Reveal className="space-y-6">
              <div>
                <p className="eyebrow mb-4">Detailed to</p>
                <BadgeRow marks={standardMarks} className="sm:grid-cols-1" />
              </div>
              <div>
                <p className="eyebrow mb-4">Produced in</p>
                <BadgeRow marks={softwareMarks} className="sm:grid-cols-1" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-border/60 border-y py-24 lg:py-32">
        <div className="container-x">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow">Scope of work</p>
            </Reveal>
            <KineticHeading
              text="What lands in your inbox"
              className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02]"
            />
          </div>

          <Reveal
            stagger={0.05}
            as="ul"
            className="border-border/60 bg-border/60 mt-14 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3"
          >
            {deliverables.map((d, i) => (
              <li
                key={d}
                className="group bg-background hover:bg-card flex gap-4 p-6 transition-colors duration-500"
              >
                <span className="text-primary/70 group-hover:text-primary mt-0.5 font-mono text-[0.62rem] transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-sm leading-relaxed">{d}</span>
                <Check className="text-primary/0 group-hover:text-primary/70 mt-0.5 size-4 shrink-0 transition-colors" />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <ServicesSection />
      <CtaBand />
    </>
  );
}
