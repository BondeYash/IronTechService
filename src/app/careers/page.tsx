import type { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Users, TrendingUp, Compass } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { CareerForm } from "@/components/forms/career-form";
import { careersPage } from "@/data/content";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Irontech Detailing — steel detailers, checkers and 3D modellers working in SDS/2 on structural and miscellaneous steel packages.",
};

const perks = [
  {
    icon: GraduationCap,
    title: "Learn on real packages",
    body: "Trainees work alongside seasoned detailers on live jobs, not sample files.",
  },
  {
    icon: Users,
    title: "In-house team",
    body: "Detailing, checking and modelling sit together, so questions get answered the same day.",
  },
  {
    icon: TrendingUp,
    title: "Room to grow",
    body: "Detailer to checker to package lead — the path is open to anyone who earns it.",
  },
  {
    icon: Compass,
    title: "Work to standards",
    body: "Every drawing you produce is measured against AISC, NISD and OSHA guidance.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={careersPage.headline}
        intro="If you can model clean, check hard and hold a schedule, we want to hear from you."
        image="/assets/images/tinsley-park-entry.jpg"
        imageAlt="Structural steel entry canopy"
      />

      <section className="pb-24">
        <div className="container-x">
          <Reveal
            stagger={0.08}
            className="border-border/60 bg-border/60 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4"
          >
            {perks.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-background p-7">
                <span className="bg-primary/10 text-primary ring-primary/20 flex size-11 items-center justify-center rounded-lg ring-1">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base [--heading-weight:700]">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-border/60 border-t py-24">
        <div className="container-x grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="eyebrow">Apply</p>
            </Reveal>
            <KineticHeading
              text="Tell us what you detail"
              className="mt-4 text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.02]"
            />
            <Reveal delay={0.1}>
              <p className="text-muted-foreground mt-6 leading-relaxed">
                Open to detailers, checkers, 3D modellers and trainees. Send sample drawings or a
                portfolio to{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary underline underline-offset-4"
                >
                  {contact.email}
                </a>{" "}
                after submitting the form.
              </p>
            </Reveal>
            <Reveal from="scale" delay={0.15} className="mt-10">
              <div className="border-border/60 relative aspect-4/3 overflow-hidden rounded-2xl border">
                <Image
                  src="/assets/images/stair2.jpg"
                  alt="Detailed steel stair"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="glass border-border/60 rounded-2xl border p-7 lg:p-9">
              <CareerForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
