"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { prefersReducedMotion } from "@/lib/gsap";
import { useInViewport, usePageVisible } from "@/lib/use-in-viewport";
import { cn } from "@/lib/utils";
import { ProjectPhoto } from "./project-photo";
import { ProjectViewer } from "./project-viewer";

export function ProjectShowcase({ items }: { items: Project[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useInViewport(wrap, "0px");
  const pageVisible = usePageVisible();
  const close = useCallback(() => setSelected(null), []);
  useEffect(() => {
    if (
      !visible ||
      !pageVisible ||
      paused ||
      interacting ||
      focused ||
      selected != null ||
      prefersReducedMotion()
    )
      return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % items.length), 6000);
    return () => window.clearInterval(timer);
  }, [visible, pageVisible, paused, interacting, focused, selected, items.length]);
  const active = items[index];
  return (
    <div
      ref={wrap}
      onPointerEnter={() => setInteracting(true)}
      onPointerLeave={() => setInteracting(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <button
        type="button"
        onClick={() => setSelected(index)}
        aria-label={`View ${active.title}`}
        className="border-border hover:border-primary focus-visible:outline-primary bg-muted block w-full overflow-hidden rounded-xl border text-left focus-visible:outline-2"
      >
        <ProjectPhoto
          src={active.image}
          alt={active.title}
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        <span className="bg-card flex items-center justify-between gap-4 p-5">
          <span>
            <span className="block text-xl font-medium">{active.title}</span>
            {active.tonnage && (
              <span className="text-primary mt-1 block font-mono text-xs">
                {active.tonnage.toLocaleString()} tons detailed
              </span>
            )}
          </span>
          <Maximize2 className="text-primary size-5 shrink-0" />
        </span>
      </button>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
          {items.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${item.title}`}
              aria-pressed={index === i}
              className={cn(
                "focus-visible:outline-primary bg-muted relative h-14 w-20 shrink-0 rounded border focus-visible:outline-2",
                index === i ? "border-primary" : "border-border",
              )}
            >
              <Image src={item.image} alt="" fill sizes="80px" className="object-contain" />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Resume project slideshow" : "Pause project slideshow"}
          aria-pressed={paused}
          className="border-border hover:border-primary focus-visible:outline-primary rounded-full border p-3 focus-visible:outline-2"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      </div>
      {selected != null && (
        <ProjectViewer items={items} index={selected} onIndexChange={setSelected} onClose={close} />
      )}
    </div>
  );
}
