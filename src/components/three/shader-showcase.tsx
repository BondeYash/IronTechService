"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/gsap";
import { useInViewport, usePageVisible } from "@/lib/use-in-viewport";
import { cn } from "@/lib/utils";

const ShowcaseCanvas = dynamic(() => import("./showcase-canvas"), {
  ssr: false,
  loading: () => null,
});

export type ShowcaseItem = {
  title: string;
  image: string;
  tonnage: number | null;
};

/**
 * Single WebGL canvas that crossfades featured project photography through a
 * torch-cut dissolve shader. One canvas keeps the GPU cost bounded while the
 * grid pages stay plain DOM.
 */
export function ShaderShowcase({
  items,
  className,
}: {
  items: ShowcaseItem[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [webgl, setWebgl] = useState(false);
  const hover = useRef(0);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const sources = useMemo(() => items.map((i) => i.image), [items]);

  // Nothing here runs until the panel is close to the viewport: no second GL
  // context, no texture uploads and no timer while the visitor is still up top.
  const near = useInViewport(wrapRef, "400px");
  const onScreen = useInViewport(wrapRef, "0px");
  const pageVisible = usePageVisible();
  const live = onScreen && pageVisible;

  useEffect(() => {
    if (prefersReducedMotion() || !near) return;
    const raf = requestAnimationFrame(() => {
      try {
        const c = document.createElement("canvas");
        setWebgl(Boolean(c.getContext("webgl2") || c.getContext("webgl")));
      } catch {
        setWebgl(false);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [near]);

  // auto-advance, paused while hovered or while the panel is off screen
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      if (hover.current > 0.5) return;
      setIndex((i) => (i + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [items.length, live]);

  const onMove = (e: React.PointerEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = {
      x: (e.clientX - r.left) / r.width,
      y: 1 - (e.clientY - r.top) / r.height,
    };
  };

  const active = items[index];

  return (
    <div className={cn("relative", className)}>
      <div
        ref={wrapRef}
        onPointerEnter={() => (hover.current = 1)}
        onPointerLeave={() => (hover.current = 0)}
        onPointerMove={onMove}
        className="border-border/60 bg-card relative aspect-16/9 overflow-hidden rounded-2xl border"
      >
        {/* The photo is the base layer, so there is never an empty panel while
            the WebGL chunk is still on the wire. */}
        <Image
          src={active.image}
          alt={active.title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        {webgl && near ? (
          <div className="absolute inset-0">
            <ShowcaseCanvas
              sources={sources}
              index={index}
              hoverRef={hover}
              mouseRef={mouse}
              live={live}
            />
          </div>
        ) : null}

        <div className="from-background/90 pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-6 pt-20">
          <p className="font-heading text-2xl tracking-tight [--heading-weight:700]">
            {active.title}
          </p>
          {active.tonnage ? (
            <p className="text-primary mt-1 font-mono text-xs tracking-[0.2em] uppercase">
              {active.tonnage.toLocaleString()} tons detailed
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <button
            key={item.image}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${item.title}`}
            aria-current={i === index}
            className={cn(
              "relative h-14 w-20 overflow-hidden rounded-md border transition-all duration-300",
              i === index
                ? "border-primary opacity-100"
                : "border-border/60 opacity-50 hover:opacity-90",
            )}
          >
            <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
