"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useInViewport, usePageVisible } from "@/lib/use-in-viewport";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

function Row({
  items,
  direction = 1,
  speed = 60,
}: {
  items: { image: string; title: string }[];
  direction?: 1 | -1;
  speed?: number;
}) {
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const onScreen = useInViewport(wrap, "100px");
  const pageVisible = usePageVisible();
  const live = onScreen && pageVisible;

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      tween = gsap.fromTo(
        el,
        { xPercent: direction === 1 ? 0 : -50 },
        {
          xPercent: direction === 1 ? -50 : 0,
          duration: speed,
          ease: "none",
          repeat: -1,
          paused: true,
        },
      );
    }, el);
    tweenRef.current = tween ?? null;
    return () => {
      tweenRef.current = null;
      ctx.revert();
    };
  }, [direction, speed]);

  // An infinite marquee compositing 28 photos will happily run for the whole
  // page if you let it. It only moves while someone is looking at it.
  useEffect(() => {
    const tween = tweenRef.current;
    if (!tween) return;
    if (live) tween.resume();
    else tween.pause();
  }, [live]);

  return (
    <div ref={wrap} className="overflow-hidden">
      <div ref={track} className="flex w-max gap-4 will-change-transform">
        {[...items, ...items].map((item, i) => (
          <figure
            key={`${item.image}-${i}`}
            className="border-border/60 group relative h-44 w-64 shrink-0 overflow-hidden rounded-lg border sm:h-56 sm:w-80"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="320px"
              quality={55}
              loading="lazy"
              className="object-cover grayscale-[0.35] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            <figcaption className="from-background/95 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-3 pt-10 font-mono text-[0.58rem] tracking-[0.14em] uppercase">
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/**
 * Two counter-scrolling rows built from the project archive — fills the page
 * with real work rather than stock photography.
 */
export function PhotoWall({ className }: { className?: string }) {
  // Each row is duplicated for the seamless loop, so this is already 32 images
  // in the DOM. Showing the whole archive here cost more than it showed.
  const wall = projects.slice(0, 16);
  const top = wall.slice(0, 8);
  const bottom = wall.slice(8);

  return (
    <section
      className={cn(
        "border-border/60 cv-auto relative space-y-4 overflow-hidden border-y py-16",
        className,
      )}
    >
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent sm:w-40" />
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent sm:w-40" />
      <Row items={top} direction={1} speed={70} />
      <Row items={bottom} direction={-1} speed={78} />
    </section>
  );
}
