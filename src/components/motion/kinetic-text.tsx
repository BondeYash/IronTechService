"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";
import { inView } from "@/lib/in-view";
import { useInViewport, usePageVisible } from "@/lib/use-in-viewport";
import { cn } from "@/lib/utils";

type KineticHeadingProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  /** wght axis endpoints of the variable font */
  fromWeight?: number;
  toWeight?: number;
  delay?: number;
  stagger?: number;
  /** trigger on scroll instead of on mount */
  onScroll?: boolean;
};

/**
 * Per-word mask reveal that also animates the variable font's `wght` axis,
 * so type appears to forge itself into place rather than merely fade in.
 */
export function KineticHeading({
  text,
  className,
  as = "h2",
  fromWeight = 200,
  toWeight = 800,
  delay = 0,
  stagger = 0.06,
  onScroll = true,
}: KineticHeadingProps) {
  const ref = useRef<HTMLElement | null>(null);
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelectorAll<HTMLElement>("[data-word-inner]");
    if (prefersReducedMotion()) {
      gsap.set(inner, {
        y: 0,
        opacity: 1,
        fontVariationSettings: `"wght" ${toWeight}`,
      });
      return;
    }

    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      gsap.set(inner, {
        yPercent: 115,
        opacity: 0,
        fontVariationSettings: `"wght" ${fromWeight}`,
      });
      tween = gsap.to(inner, {
        yPercent: 0,
        opacity: 1,
        fontVariationSettings: `"wght" ${toWeight}`,
        duration: 1.15,
        delay,
        stagger,
        ease: EASE.expo,
        paused: onScroll,
      });
    }, el);

    // Words start masked below their line box, so a trigger that never fires
    // would hide the heading permanently. IntersectionObserver can't miss.
    const stop = onScroll ? inView(el, () => tween?.play(), "0px 0px -10% 0px") : null;

    return () => {
      stop?.();
      ctx.revert();
    };
  }, [delay, fromWeight, toWeight, stagger, onScroll, text]);

  const cls = cn("[--heading-weight:800]", className);
  const inner = words.map((word, i) => (
    <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <span data-word-inner className="inline-block will-change-transform">
        {word}
      </span>
      {i < words.length - 1 ? <span>&nbsp;</span> : null}
    </span>
  ));

  switch (as) {
    case "h1":
      return (
        <h1 ref={ref as React.Ref<HTMLHeadingElement>} className={cls}>
          {inner}
        </h1>
      );
    case "h3":
      return (
        <h3 ref={ref as React.Ref<HTMLHeadingElement>} className={cls}>
          {inner}
        </h3>
      );
    case "p":
      return (
        <p ref={ref as React.Ref<HTMLParagraphElement>} className={cls}>
          {inner}
        </p>
      );
    default:
      return (
        <h2 ref={ref as React.Ref<HTMLHeadingElement>} className={cls}>
          {inner}
        </h2>
      );
  }
}

/**
 * Scroll-linked weight axis: text thickens as it crosses the viewport.
 * Pure variable-font manipulation, no opacity tricks.
 */
export function WeightShiftText({
  children,
  className,
  min = 300,
  max = 900,
}: {
  children: React.ReactNode;
  className?: string;
  min?: number;
  max?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { w: min };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        w: max,
        ease: "none",
        onUpdate: () => {
          el.style.fontVariationSettings = `"wght" ${Math.round(obj.w)}`;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "bottom 40%",
          scrub: 0.6,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [min, max]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}

/** Marquee strip. Duplicated content keeps the loop seamless. */
export function Marquee({
  items,
  speed = 40,
  className,
}: {
  items: readonly string[];
  speed?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const onScreen = useInViewport(wrapRef, "100px");
  const pageVisible = usePageVisible();
  const live = onScreen && pageVisible;

  useEffect(() => {
    const el = trackRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(el, {
        xPercent: -50,
        duration: speed,
        ease: "none",
        repeat: -1,
        paused: true,
      });
    }, el);
    return () => {
      tweenRef.current = null;
      ctx.revert();
    };
  }, [speed]);

  // Off-screen marquees are pure wasted compositing.
  useEffect(() => {
    const tween = tweenRef.current;
    if (!tween) return;
    if (live) tween.resume();
    else tween.pause();
  }, [live]);

  return (
    <div ref={wrapRef} className={cn("overflow-hidden", className)}>
      <div ref={trackRef} className="flex w-max gap-10 will-change-transform">
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-heading flex shrink-0 items-center gap-10 text-2xl tracking-tight whitespace-nowrap uppercase sm:text-4xl"
          >
            {item}
            <span className="bg-primary size-1.5 rotate-45" />
          </span>
        ))}
      </div>
    </div>
  );
}
