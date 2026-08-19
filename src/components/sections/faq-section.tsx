"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { KineticHeading } from "@/components/motion/kinetic-text";
import { faqs } from "@/data/faq";
import { contact } from "@/data/site";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-28 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Before you send drawings</p>
          </Reveal>
          <KineticHeading
            text="Questions fabricators ask us first"
            className="mt-4 text-[clamp(1.9rem,4vw,3rem)] leading-[1.03]"
          />
          <Reveal delay={0.1}>
            <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
              Anything not covered here — software versions, file naming, shop
              standards, approval routing — is worth a five minute call before
              the estimate.
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="text-primary mt-4 inline-block text-sm underline underline-offset-4"
            >
              {contact.email}
            </a>
          </Reveal>
        </div>

        <Reveal stagger={0.05} className="divide-border/60 border-border/60 divide-y border-y">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span
                    className={cn(
                      "text-base transition-colors sm:text-lg [--heading-weight:650]",
                      isOpen
                        ? "text-primary"
                        : "group-hover:text-primary text-foreground",
                    )}
                  >
                    {item.q}
                  </span>
                  <Plus
                    className={cn(
                      "text-primary mt-1 size-4 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-500",
                    isOpen
                      ? "grid-rows-[1fr] pb-6 opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <p className="text-muted-foreground overflow-hidden pr-10 text-sm leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
