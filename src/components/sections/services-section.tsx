import Link from "next/link";
import { Ruler, Layers, Boxes, FileStack, Wrench, CircuitBoard, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";

const capabilities = [
  {
    icon: Layers,
    title: "Shop & erection drawings",
    body: "Member-by-member fabrication drawings and erection plans that carry every dimension the shop floor and the crane crew need.",
  },
  {
    icon: Boxes,
    title: "3D modelling in SDS/2",
    body: "The structure is modelled and checked in SDS/2 before a single sheet is issued, so clashes surface on screen — not on site.",
  },
  {
    icon: Ruler,
    title: "Connection design",
    body: "Connection design calculations and tracked connection design, coordinated with the EOR when the scope calls for it.",
  },
  {
    icon: FileStack,
    title: "Estimates, ABM & schedules",
    body: "Detailing estimates, advanced bill of material, joist listing, deck layout and a detailing schedule you can plan procurement against.",
  },
  {
    icon: Wrench,
    title: "Miscellaneous steel",
    body: "Stairs, handrails, ladders, platforms and plate work detailed to the same tolerance as the primary frame.",
  },
  {
    icon: CircuitBoard,
    title: "Fabrication data files",
    body: "CNC, DXF and KISS files, Tekla EPM status transfers, Fabtrol and EJE exports, plus material summaries.",
  },
];

export function ServicesSection() {
  return (
    <section className="border-border/60 relative border-y py-28 lg:py-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">What we do</p>
            </Reveal>
            <KineticHeading
              text="Detailing that reduces cost in the shop and risk in the field"
              className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03]"
            />
          </div>
          <Reveal delay={0.15}>
            <Link
              href="/services"
              className="border-border/70 hover:border-primary/70 hover:text-primary inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm whitespace-nowrap transition-colors"
            >
              All services
              <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal
          stagger={0.08}
          className="border-border/60 bg-border/60 mt-16 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="group bg-background hover:bg-card relative p-8 transition-colors duration-500"
            >
              <span className="text-muted-foreground/60 absolute top-6 right-7 font-mono text-[0.62rem]">
                0{i + 1}
              </span>
              <span className="bg-primary/10 text-primary ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground flex size-11 items-center justify-center rounded-lg ring-1 transition-colors duration-500">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-6 text-lg [--heading-weight:700]">{title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{body}</p>
              <span className="bg-primary absolute inset-x-0 bottom-0 h-px w-0 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
