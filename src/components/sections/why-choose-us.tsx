import { Target, HeartHandshake, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { whyChooseUs, values } from "@/data/content";

const icons = [Target, HeartHandshake, ShieldCheck];

// Third pillar: the standards half of the promise, stated as plainly as the
// mission and values the company already publishes.
const standardsCard = {
  title: "Our Standards",
  body: "Detailing follows AISC, NISD and IBC requirements with OSHA erection safety carried into the drawings, and every sheet is checked by a second detailer against the model before it leaves the office.",
};

export function WhyChooseUs() {
  return (
    <section className="border-border/60 relative overflow-hidden border-y py-28 lg:py-36">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow">Why choose us</p>
          </Reveal>
          <KineticHeading
            text={whyChooseUs.title}
            className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1]"
          />
        </div>

        <Reveal stagger={0.1} className="mt-16 grid gap-6 md:grid-cols-3">
          {[...whyChooseUs.items, standardsCard].map((item, i) => {
            const Icon = icons[i] ?? Target;
            return (
              <div
                key={item.title}
                className="glass border-border/60 group relative overflow-hidden rounded-2xl border p-8 lg:p-10"
              >
                <span className="bg-primary/10 text-primary ring-primary/20 flex size-12 items-center justify-center rounded-xl ring-1">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-2xl [--heading-weight:700]">{item.title}</h3>
                <p className="text-muted-foreground mt-4 leading-relaxed">{item.body}</p>
                <span className="bg-primary/60 absolute top-0 right-0 h-0 w-px transition-all duration-700 group-hover:h-full" />
              </div>
            );
          })}
        </Reveal>

        <Reveal stagger={0.05} className="mt-12 flex flex-wrap justify-center gap-2.5">
          {values.map((v) => (
            <span
              key={v}
              className="border-border/70 bg-background/60 hover:border-primary/60 hover:text-primary rounded-full border px-4 py-2 font-mono text-[0.65rem] tracking-[0.16em] uppercase transition-colors"
            >
              {v}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
