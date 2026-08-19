import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { site, contact } from "@/data/site";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36">
      <div className="from-primary/15 absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />
      <div className="container-x relative text-center">
        <Reveal>
          <p className="eyebrow">{site.ctaHeadline}</p>
        </Reveal>
        <KineticHeading
          text={site.ctaSubline}
          className="mx-auto mt-5 max-w-4xl text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[0.98]"
        />

        <Reveal delay={0.15} className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="group bg-primary text-primary-foreground hover:bg-molten-400 inline-flex items-center gap-2 rounded-full px-8 py-4 font-medium transition-colors"
          >
            Start your project
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={`mailto:${contact.email}`}
            className="border-border/70 hover:border-primary/70 hover:text-primary inline-flex items-center gap-2 rounded-full border px-8 py-4 transition-colors"
          >
            <Mail className="size-4" />
            {contact.email}
          </a>
          <a
            href={contact.phoneHref}
            className="border-border/70 hover:border-primary/70 hover:text-primary inline-flex items-center gap-2 rounded-full border px-8 py-4 transition-colors"
          >
            <Phone className="size-4" />
            {contact.phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
