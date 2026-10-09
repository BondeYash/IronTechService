"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { nav, site, contact } from "@/data/site";
import { useModalDialog } from "@/lib/use-modal-dialog";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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
          scrolled
            ? "border-border glass border-b py-2 shadow-sm"
            : "border-border bg-background/95 border-b py-3",
        )}
      >
        <div className="container-x flex items-center justify-between gap-3 xl:gap-6">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="relative h-10 w-12 shrink-0 sm:h-12 sm:w-14">
              <Image
                src={site.logo}
                alt={`${site.name} logo`}
                fill
                sizes="(min-width: 640px) 56px, 48px"
                className="object-contain"
                priority
              />
            </span>
            <span className="font-heading text-foreground max-w-[12rem] text-[0.78rem] leading-snug font-bold sm:text-sm">
              {site.name}
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors sm:inline-flex"
            >
              Request a quote
              <ArrowUpRight className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              className="border-border/70 hover:border-primary/60 shrink-0 rounded-full border p-2.5 transition xl:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {open && <MobileMenu onClose={close} />}
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const dialog = useModalDialog(onClose);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [onClose]);
  return (
    <dialog
      ref={dialog}
      id="mobile-navigation"
      aria-label="Main navigation"
      data-lenis-prevent
      className="bg-background text-foreground backdrop:bg-foreground/40 fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 px-6 py-6"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="font-heading max-w-56 text-lg leading-snug font-bold">{site.name}</span>
        <button
          type="button"
          data-dialog-close
          autoFocus
          onClick={onClose}
          aria-label="Close menu"
          className="border-border focus-visible:outline-primary rounded-full border p-3 focus-visible:outline-2"
        >
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex flex-col" aria-label="Mobile navigation">
        {nav.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="border-border/50 font-heading hover:text-primary focus-visible:outline-primary flex items-baseline justify-between border-b py-4 text-2xl focus-visible:outline-2"
          >
            {item.label}
            <span className="text-muted-foreground font-mono text-xs">0{i + 1}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-8 space-y-4">
        <ThemeToggle showLabel />
        <div className="text-muted-foreground space-y-2 text-sm">
          <a href={`mailto:${contact.email}`} className="block">
            {contact.email}
          </a>
          <a href={contact.phoneHref} className="block">
            {contact.phone}
          </a>
        </div>
      </div>
    </dialog>
  );
}
