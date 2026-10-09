import Link from "next/link";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { nav, site, contact, socials } from "@/data/site";
import { standardMarks, softwareMarks } from "@/components/ui/standard-badge";
import { Marquee } from "@/components/motion/kinetic-text";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 bg-background relative border-t">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="border-border/60 relative border-b py-8">
        <Marquee
          items={[
            "Shop Drawings",
            "Erection Drawings",
            "SDS/2 Modelling",
            "Connection Design",
            "Advanced Bill of Material",
            "CNC & DXF Files",
          ]}
          className="text-muted-foreground/60"
          speed={46}
        />
      </div>

      <div className="container-x relative grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-5">
          <p className="font-heading text-2xl leading-snug tracking-tight [--heading-weight:700]">
            {site.name}
          </p>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            {site.legalName} — {site.tagline.toLowerCase()}, detailing structural and miscellaneous
            steel for fabricators and erectors.
          </p>
          <div className="flex flex-wrap gap-2">
            {[...standardMarks, ...softwareMarks].map((mark) => (
              <span
                key={mark.code}
                title={mark.caption}
                className="border-border/70 text-muted-foreground hover:border-primary/60 hover:text-primary rounded-full border px-3 py-1 font-mono text-[0.62rem] tracking-widest uppercase transition-colors"
              >
                {mark.code}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-5">Explore</p>
          <ul className="space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">Follow</p>
          <ul className="space-y-3 text-sm">
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
                >
                  {s.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Start a project</p>
          <a
            href={`mailto:${contact.email}`}
            className="group hover:text-primary flex items-center gap-3 text-sm transition-colors"
          >
            <Mail className="text-primary size-4" />
            {contact.email}
          </a>
          <a
            href={contact.phoneHref}
            className="group hover:text-primary flex items-center gap-3 text-sm transition-colors"
          >
            <Phone className="text-primary size-4" />
            {contact.phone}
          </a>
          <Link
            href="/contact"
            className="border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground mt-2 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors"
          >
            Request a quote
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="border-border/60 relative border-t">
        <div className="container-x text-muted-foreground flex flex-col gap-2 py-6 font-mono text-[0.68rem] tracking-wider uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}
          </p>
          <p>Detailed to AISC · NISD · OSHA · IBC</p>
        </div>
      </div>
    </footer>
  );
}
