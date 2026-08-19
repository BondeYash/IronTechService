import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ProjectGrid } from "@/components/projects/project-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { projectsPage } from "@/data/content";
import { projectCount, totalTonnage } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Schools, medical centres, retail, industrial plants and miscellaneous steel packages detailed by Irontech — browse the project gallery.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Projects"
        title={projectsPage.subtitle}
        intro={projectsPage.intro}
        image="/assets/images/magothy-gateway.jpg"
        imageAlt="Magothy Gateway steel structure"
      />

      <section className="pb-28">
        <div className="container-x">
          <p className="text-muted-foreground mb-8 font-mono text-[0.68rem] tracking-[0.2em] uppercase">
            {projectCount} packages · {totalTonnage.toLocaleString()} tons of recorded steel
          </p>
          <ProjectGrid />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
