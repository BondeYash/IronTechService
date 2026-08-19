import type { Metadata } from "next";
import { Mail, Phone, Clock, Globe } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { contact, socials } from "@/data/site";
import { contactPage } from "@/data/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Request a structural steel detailing estimate from Irontech Detailing Services Pvt Ltd — tell us the scope, tonnage and schedule.",
};

const channels = [
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { icon: Phone, label: "Phone", value: contact.phone, href: contact.phoneHref },
  { icon: Clock, label: "Response", value: "Within one working day", href: null },
  { icon: Globe, label: "Serving", value: "Fabricators & erectors worldwide", href: null },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title={contactPage.headline}
        intro="Send the drawing set status, tonnage and target dates — we will come back with a detailing estimate and a schedule."
        image="/assets/images/publix-food-pharmacy-building350-tons.jpg"
        imageAlt="Completed steel structure"
      />

      <section className="pb-28">
        <div className="container-x grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">Direct lines</p>
            </Reveal>
            <KineticHeading
              text="Talk to the people who do the detailing"
              className="mt-4 text-[clamp(1.9rem,4vw,3rem)] leading-[1.04]"
            />

            <Reveal stagger={0.08} className="mt-10 space-y-px">
              {channels.map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <span className="flex items-start gap-4">
                    <span className="bg-primary/10 text-primary ring-primary/20 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg ring-1">
                      <Icon className="size-4" />
                    </span>
                    <span>
                      <span className="text-muted-foreground block font-mono text-[0.6rem] tracking-[0.2em] uppercase">
                        {label}
                      </span>
                      <span className="mt-1 block text-sm">{value}</span>
                    </span>
                  </span>
                );
                return (
                  <div
                    key={label}
                    className="border-border/60 hover:border-primary/40 rounded-lg border p-4 transition-colors"
                  >
                    {href ? (
                      <a href={href} className="hover:text-primary block transition-colors">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </div>
                );
              })}
            </Reveal>

            <Reveal delay={0.15} className="mt-8 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border/70 hover:border-primary/60 hover:text-primary rounded-full border px-5 py-2.5 text-sm transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="glass border-border/60 rounded-2xl border p-7 lg:p-9">
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
