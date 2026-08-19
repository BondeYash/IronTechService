"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { nav, site, contact } from "@/data/site";
import { AudioToggle } from "@/components/audio/audio-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "glass border-border/60 border-b py-2" : "border-b border-transparent py-4",
        )}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3">
            <span className="ring-primary/30 group-hover:ring-primary/70 relative size-10 overflow-hidden rounded-md ring-1 transition">
              <Image
                src={site.logo}
                alt={`${site.name} logo`}
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="font-heading block text-sm tracking-tight [--heading-weight:800]">
                IRONTECH
              </span>
              <span className="text-muted-foreground font-mono text-[0.58rem] tracking-[0.22em] uppercase">
                Steel Detailing
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative px-3.5 py-2 text-sm transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "bg-primary absolute bottom-1 left-3.5 h-px transition-all duration-300",
                      active ? "w-[calc(100%-1.75rem)]" : "w-0 group-hover:w-[calc(100%-1.75rem)]",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <AudioToggle className="hidden md:flex" />
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground hover:bg-molten-400 hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:inline-flex"
            >
              Request a quote
              <ArrowUpRight className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="border-border/70 hover:border-primary/60 rounded-full border p-2.5 transition lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-between px-6 pt-28 pb-10 transition-all duration-500 lg:hidden",
          "bg-background/95 backdrop-blur-xl",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex flex-col">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-border/50 font-heading hover:text-primary flex items-baseline justify-between border-b py-5 text-3xl tracking-tight transition-colors [--heading-weight:700]"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {item.label}
              <span className="text-muted-foreground font-mono text-xs">0{i + 1}</span>
            </Link>
          ))}
        </nav>
        <div className="space-y-4">
          <AudioToggle className="w-fit" />
          <div className="text-muted-foreground space-y-1 font-mono text-sm">
            <a href={`mailto:${contact.email}`} className="hover:text-primary block">
              {contact.email}
            </a>
            <a href={contact.phoneHref} className="hover:text-primary block">
              {contact.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
