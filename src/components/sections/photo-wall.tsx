"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useInViewport, usePageVisible } from "@/lib/use-in-viewport";
import { projects, type Project } from "@/data/projects";
import { ProjectViewer } from "@/components/projects/project-viewer";
import { cn } from "@/lib/utils";

function Row({
  items,
  direction,
  onOpen,
  paused,
}: {
  items: Project[];
  direction: 1 | -1;
  onOpen: (project: Project) => void;
  paused: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const onScreen = useInViewport(wrap, "100px");
  const pageVisible = usePageVisible();
  const [interacting, setInteracting] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!track.current || prefersReducedMotion()) return;
    const context = gsap.context(() => {
      tween.current = gsap.fromTo(
        track.current,
        { xPercent: direction === 1 ? 0 : -50 },
        {
          xPercent: direction === 1 ? -50 : 0,
          duration: 75,
          ease: "none",
          repeat: -1,
          paused: true,
        },
      );
    }, track);
    return () => {
      tween.current = null;
      context.revert();
    };
  }, [direction]);
  useEffect(() => {
    if (onScreen && pageVisible && !interacting && !focused && !paused) tween.current?.resume();
    else tween.current?.pause();
  }, [onScreen, pageVisible, interacting, focused, paused]);
  return (
    <div
      ref={wrap}
      className="overflow-x-auto"
      onPointerEnter={() => setInteracting(true)}
      onPointerLeave={() => setInteracting(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div ref={track} className="flex w-max gap-4">
        {[...items, ...items].map((item, index) => (
          <button
            key={`${item.slug}-${index}`}
            type="button"
            onClick={() => onOpen(item)}
            aria-label={`View ${item.title}`}
            aria-hidden={index >= items.length ? true : undefined}
            tabIndex={index >= items.length ? -1 : 0}
            className="border-border bg-card hover:border-primary focus-visible:outline-primary w-64 shrink-0 overflow-hidden rounded-lg border text-left focus-visible:outline-2 sm:w-80"
          >
            <span className="relative block h-44 bg-black sm:h-48">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="320px"
                quality={85}
                className="object-contain"
              />
            </span>
            <span className="block truncate p-3 text-xs">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const wall = projects.slice(0, 16);
export function PhotoWall({ className }: { className?: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const close = useCallback(() => setSelected(null), []);
  const open = (project: Project) =>
    setSelected(wall.findIndex((item) => item.slug === project.slug));
  return (
    <section
      className={cn(
        "border-border/60 relative space-y-4 overflow-hidden border-y py-12",
        className,
      )}
    >
      <div className="container-x flex items-center justify-between gap-4">
        <p className="eyebrow">Project photographs</p>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="border-border focus-visible:outline-primary rounded-full border px-4 py-2 text-xs focus-visible:outline-2"
        >
          {paused ? "Resume photographs" : "Pause photographs"}
        </button>
      </div>
      <Row
        items={wall.slice(0, 8)}
        direction={1}
        onOpen={open}
        paused={paused || selected != null}
      />
      <Row items={wall.slice(8)} direction={-1} onOpen={open} paused={paused || selected != null} />
      {selected != null && (
        <ProjectViewer items={wall} index={selected} onIndexChange={setSelected} onClose={close} />
      )}
    </section>
  );
}
