import { ProjectPhoto } from "@/components/projects/project-photo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Parallax } from "@/components/motion/reveal";
import { KineticHeading, WeightShiftText } from "@/components/motion/kinetic-text";
import { about } from "@/data/content";
import { standards, software } from "@/data/services";

export function AboutSection() {
  return (
    <section className="relative py-28 lg:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="relative">
          <Reveal from="scale" className="relative">
            <div className="border-border/60 bg-muted relative overflow-hidden rounded-2xl border">
              <ProjectPhoto
                src="/assets/images/cooper-west-trusses.jpg"
                alt="Fabricated steel trusses detailed by Irontech"
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-contain"
              />
            </div>
          </Reveal>

          <Parallax amount={60} className="mt-4 ml-auto w-44 sm:w-56">
            <div className="border-border/60 glass overflow-hidden rounded-xl border p-1.5">
              <div className="relative overflow-hidden rounded-lg">
                <ProjectPhoto
                  src="/assets/images/ski-lodge-plate-stair.jpg"
                  alt="Plate stair detail"
                  sizes="220px"
                  className="object-contain"
                />
              </div>
              <p className="text-muted-foreground px-2 py-2 font-mono text-[0.58rem] tracking-[0.18em] uppercase">
                Misc. steel · stairs
              </p>
            </div>
          </Parallax>
        </div>

        <div>
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
          </Reveal>
          <KineticHeading
            text={about.title}
            className="mt-4 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02]"
          />

          <div className="mt-8 space-y-5">
            {about.paragraphs.slice(0, 3).map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-muted-foreground leading-relaxed text-pretty">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal
            stagger={0.06}
            className="border-border/60 mt-10 flex flex-wrap gap-2 border-t pt-8"
          >
            {[...standards, ...software].map((tag) => (
              <span
                key={tag}
                className="border-border/70 rounded-full border px-4 py-1.5 font-mono text-[0.65rem] tracking-[0.16em] uppercase"
              >
                {tag}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <Link
              href="/about"
              className="group text-primary inline-flex items-center gap-2 text-sm"
            >
              <WeightShiftText min={400} max={700}>
                Read the full story
              </WeightShiftText>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
