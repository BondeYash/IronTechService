"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { process } from "@/data/process";

export function ProcessSection() {
  const railRef = useRef<HTMLDivElement>(null);

  // The rail fills as the section scrolls — a progress line for the workflow.
  useEffect(() => {
    const el = railRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="border-border/60 relative border-y py-28 lg:py-36">
      <div className="container-x">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow">How a package runs</p>
          </Reveal>
          <KineticHeading
            text="From contract drawings to machine-ready files"
            className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03]"
          />
          <Reveal delay={0.1}>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              Seven steps, each with something you can actually hold — an
              estimate, a bill of material, a checked model, a drawing set.
              Nothing is issued on trust alone.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16 pl-10 sm:pl-16">
          <div className="bg-border/70 absolute top-2 bottom-2 left-[3px] w-px sm:left-[7px]">
            <div
              ref={railRef}
              className="from-primary via-molten-400 to-primary/20 absolute inset-0 bg-gradient-to-b"
            />
          </div>

          <Reveal stagger={0.08} className="space-y-10">
            {process.map((item) => (
              <div key={item.step} className="group relative">
                <span className="border-primary/60 bg-background absolute top-2 -left-10 size-2 rounded-full border-2 sm:-left-16 sm:size-3.5" />
                <div className="grid gap-3 sm:grid-cols-[5rem_1fr_11rem] sm:items-baseline sm:gap-6">
                  <span className="text-primary font-mono text-xs tracking-[0.2em]">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-xl [--heading-weight:700]">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                  <span className="border-border/70 text-muted-foreground group-hover:border-primary/60 group-hover:text-primary w-fit rounded-full border px-3 py-1.5 font-mono text-[0.58rem] tracking-[0.14em] whitespace-nowrap uppercase transition-colors">
                    {item.output}
                  </span>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
