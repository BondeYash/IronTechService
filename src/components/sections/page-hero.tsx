import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="bg-background relative isolate overflow-hidden pt-40 pb-20 lg:pt-52 lg:pb-28">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            sizes="100vw"
            priority
            className="object-contain opacity-10"
          />
          <div className="from-background via-background/95 to-background absolute inset-0 bg-gradient-to-b" />
        </div>
      ) : null}
      <div className="blueprint-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />

      <div className="container-x">
        <Reveal from="none">
          <nav
            aria-label="Breadcrumb"
            className="text-muted-foreground flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-primary">{eyebrow}</span>
          </nav>
        </Reveal>

        <KineticHeading
          as="h1"
          onScroll={false}
          text={title}
          className="mt-6 max-w-5xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.94] tracking-[-0.035em]"
        />

        {intro ? (
          <Reveal delay={0.25}>
            <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed text-pretty">
              {intro}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
