import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { ProjectShowcase } from "@/components/projects/project-showcase";
import { projects } from "@/data/projects";

const featuredSlugs = [
  "waupaca-foundry",
  "cooper-west-high-school",
  "opportunity-bank",
  "sinclair-nursing-school",
  "cal-eye-loma-linda",
  "maccray-public-school",
];

export function ShowcaseSection() {
  const featured = featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[number] => Boolean(p));

  const items = featured.length ? featured : projects.slice(0, 6);

  return (
    <section className="relative py-28 lg:py-36">
      <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Selected work</p>
          </Reveal>
          <KineticHeading
            text="Schools, hospitals, plants and everything between"
            className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03]"
          />
          <Reveal delay={0.1}>
            <p className="text-muted-foreground mt-6 leading-relaxed text-pretty">
              From a 25-ton retail shell to a 1,080-ton foundry, every package is modelled, checked
              and issued by the same in-house team. Open a project to inspect the complete image at
              its original resolution.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <Link
              href="/projects"
              className="group border-border/70 hover:border-primary/70 hover:text-primary inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm transition-colors"
            >
              Browse all {projects.length} projects
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <Reveal from="scale" className="min-w-0">
          <ProjectShowcase items={items} />
        </Reveal>
      </div>
    </section>
  );
}
