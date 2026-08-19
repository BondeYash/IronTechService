import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { BadgeRow } from "@/components/ui/standard-badge";
import { standardMarks, softwareMarks } from "@/components/ui/standard-badge";
import { deliverables } from "@/data/services";

export function DeliverablesSection() {
  return (
    <section className="relative py-28 lg:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Every package includes</p>
          </Reveal>
          <KineticHeading
            text="One scope, no surprises at invoice time"
            className="mt-4 text-[clamp(1.9rem,4.2vw,3.2rem)] leading-[1.03]"
          />
          <Reveal delay={0.1}>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              The list on the right is the standard scope of work — estimate
              through to machine files. Anything outside it is quoted before it
              is started, not added afterwards.
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
            <Reveal>
              <p className="eyebrow mb-4">Detailed to</p>
              <BadgeRow marks={standardMarks} className="sm:grid-cols-1" />
            </Reveal>
            <Reveal delay={0.05}>
              <p className="eyebrow mb-4">Produced in</p>
              <BadgeRow marks={softwareMarks} className="sm:grid-cols-1" />
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-10">
            <Link
              href="/services"
              className="group text-primary inline-flex items-center gap-2 text-sm"
            >
              Full service breakdown
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <Reveal
          stagger={0.04}
          as="ul"
          className="bg-border/60 border-border/60 grid h-fit gap-px overflow-hidden rounded-2xl border sm:grid-cols-2"
        >
          {deliverables.map((d, i) => (
            <li
              key={d}
              className="group bg-background hover:bg-card flex gap-3 p-5 transition-colors duration-500"
            >
              <span className="bg-primary/10 text-primary ring-primary/20 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md ring-1">
                <Check className="size-3.5" />
              </span>
              <span className="flex-1 text-sm leading-relaxed">{d}</span>
              <span className="text-muted-foreground/50 font-mono text-[0.58rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
