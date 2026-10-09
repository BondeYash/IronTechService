import { Marquee } from "@/components/motion/kinetic-text";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { deliveredPackages, totalTonnage, largestTonnage } from "@/lib/stats";
import { deliverables } from "@/data/services";

const figures = [
  { value: deliveredPackages, suffix: "+", label: "Packages detailed" },
  { value: totalTonnage, suffix: " T", label: "Steel detailed to date" },
  { value: largestTonnage, suffix: " T", label: "Largest single package" },
  { value: deliverables.length, suffix: "", label: "Deliverables per job" },
];

export function CapabilityBand() {
  return (
    <section className="border-border/60 relative border-y">
      <div className="border-border/60 border-b py-6">
        <Marquee
          items={[
            "Structural Steel",
            "Miscellaneous Steel",
            "SDS/2 Modelling",
            "Connection Design",
            "Shop Drawings",
            "Erection Plans",
            "CNC & DXF Output",
            "AISC · NISD · OSHA · IBC",
          ]}
          className="text-muted-foreground/70"
          speed={52}
        />
      </div>

      <Reveal stagger={0.08} className="container-x grid grid-cols-2 gap-y-10 py-14 lg:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label} className="text-center lg:text-left">
            <p className="font-heading brand-text text-[clamp(2.2rem,5vw,3.6rem)] leading-none tracking-tight [--heading-weight:800]">
              <Counter value={f.value} suffix={f.suffix} />
            </p>
            <p className="text-muted-foreground mt-3 font-mono text-[0.6rem] tracking-[0.2em] uppercase">
              {f.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
