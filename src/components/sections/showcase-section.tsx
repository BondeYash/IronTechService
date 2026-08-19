import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { ShaderShowcase } from "@/components/three/shader-showcase";
import { projects } from "@/data/projects";

const featuredSlugs = [
  "cooper-west-high-school",
  "sinclair-nursing-school",
  "maccray-public-school",
  "publix-food-pharmacy-building",
  "caleyeloma-linda",
  "fort-peck-wellness-center",
];

export function ShowcaseSection() {
  const featured = featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[number] => Boolean(p))
    .map((p) => ({ title: p.title, image: p.image, tonnage: p.tonnage }));

  const items = featured.length ? featured : projects.slice(0, 6);

  return (
    <section className="relative py-28 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-20">
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
              From a 28-ton surgery centre to a 700-ton high school, every package is modelled,
              checked and issued by the same in-house team. Hover the panel — it is a live WebGL
              surface, not a video.
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

        <Reveal from="scale">
          <ShaderShowcase items={items} />
        </Reveal>
      </div>
    </section>
  );
}
