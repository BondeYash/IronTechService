"use client";

import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { HeroVideo } from "@/components/sections/hero-video";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/data/site";
import { stats } from "@/lib/stats";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      <HeroVideo className="pointer-events-none absolute inset-0 -z-10" />
      <div className="blueprint-grid pointer-events-none absolute inset-0 -z-10 opacity-30" />
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t to-transparent" />

      <div className="container-x">
        <Reveal from="none" className="mb-7">
          <span className="glass border-border/70 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5">
            <span className="bg-primary size-1.5 animate-pulse rounded-full" />
            <span className="font-mono text-[0.65rem] tracking-[0.24em] uppercase">
              {site.legalName}
            </span>
          </span>
        </Reveal>

        <KineticHeading
          as="h1"
          onScroll={false}
          text="Steel, detailed"
          className="text-[clamp(3rem,11vw,9rem)] leading-[0.86] tracking-[-0.04em]"
          fromWeight={200}
          toWeight={800}
        />
        <KineticHeading
          as="h1"
          onScroll={false}
          delay={0.18}
          text="down to the bolt."
          className="arc-text text-[clamp(3rem,11vw,9rem)] leading-[0.86] tracking-[-0.04em]"
          fromWeight={200}
          toWeight={800}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal delay={0.35} className="max-w-xl">
            <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
              {site.tagline}. We detail structural and miscellaneous steel — clean, accurate, on
              schedule — so the fabrication shop and the erection crew get drawings they can build
              from without a second call.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group bg-primary text-primary-foreground hover:bg-molten-400 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors"
              >
                Request a quote
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/projects"
                className="border-border/70 hover:border-primary/70 hover:text-primary inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm transition-colors"
              >
                See our projects
              </Link>
            </div>
          </Reveal>

          <Reveal
            stagger={0.09}
            delay={0.5}
            className="border-border/60 bg-border/60 grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-4 lg:grid-cols-2"
          >
            {stats.slice(0, 4).map((s) => (
              <div key={s.label} className="bg-background/85 p-5">
                <p className="font-heading text-primary text-3xl tracking-tight [--heading-weight:800]">
                  {s.value.toLocaleString()}
                  {s.suffix}
                </p>
                <p className="text-muted-foreground mt-1 font-mono text-[0.6rem] leading-relaxed tracking-[0.14em] uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <div className="text-muted-foreground absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown className="size-4 animate-bounce" />
      </div>
    </section>
  );
}
