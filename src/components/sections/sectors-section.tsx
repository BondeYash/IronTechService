import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { sectors } from "@/data/sectors";

export function SectorsSection() {
  const populated = sectors.filter((s) => s.count > 0);

  return (
    <section className="relative py-28 lg:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">Sectors we detail for</p>
            </Reveal>
            <KineticHeading
              text="The same tolerance, whatever the building does"
              className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03]"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Every figure below is counted from packages already detailed and issued — schools and
              hospitals through to foundry platforms and stair cores.
            </p>
          </Reveal>
        </div>

        <Reveal
          stagger={0.07}
          className="bg-border/60 border-border/60 mt-14 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-2 lg:grid-cols-3"
        >
          {populated.map((sector) => (
            <article
              key={sector.id}
              className="group bg-background hover:bg-card relative overflow-hidden p-7 transition-colors duration-500"
            >
              {sector.samples[0] ? (
                <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-20">
                  <Image
                    src={sector.samples[0].image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>
              ) : null}

              <div className="relative">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl [--heading-weight:700]">{sector.label}</h3>
                  <span className="text-primary font-mono text-[0.68rem] tracking-[0.16em] uppercase">
                    {sector.count} jobs
                  </span>
                </div>

                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{sector.blurb}</p>

                <ul className="border-border/60 mt-5 space-y-1.5 border-t pt-4">
                  {sector.samples.map((p) => (
                    <li
                      key={p.slug}
                      className="text-muted-foreground flex items-baseline justify-between gap-3 text-xs"
                    >
                      <span className="truncate">{p.title}</span>
                      {p.tonnage ? (
                        <span className="text-primary/80 shrink-0 font-mono">
                          {p.tonnage.toLocaleString()} T
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <span className="bg-primary absolute inset-x-0 bottom-0 h-px w-0 transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
