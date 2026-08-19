"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "@/lib/gsap";
import { inView } from "@/lib/in-view";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** direction of travel */
  from?: "up" | "down" | "left" | "right" | "scale" | "none";
  delay?: number;
  distance?: number;
  /** stagger direct children instead of the wrapper itself */
  stagger?: number;
  as?: "div" | "section" | "li" | "span" | "ul";
};

export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
  distance = 40,
  stagger,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // When children are staggered the wrapper itself is never tweened, so it
    // has to be released from the CSS pre-hide here — otherwise the whole
    // block stays at opacity 0 no matter what the children do.
    const children = stagger != null ? Array.from(el.children) : null;
    const targets: gsap.TweenTarget = children ?? el;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, clearProps: "transform" });
      if (children) gsap.set(children, { opacity: 1, clearProps: "transform" });
      return;
    }

    if (children) gsap.set(el, { opacity: 1 });

    const offsets: Record<string, gsap.TweenVars> = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      scale: { scale: 0.94 },
      none: {},
    };

    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, ...offsets[from] });
      tween = gsap.to(targets, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        delay,
        ease: EASE.expo,
        stagger: stagger ?? 0,
        paused: true,
      });
    }, el);

    const stop = inView(el, () => tween?.play());

    return () => {
      stop();
      ctx.revert();
    };
  }, [from, delay, distance, stagger]);

  const cls = cn(className);

  switch (as) {
    case "section":
      return (
        <section ref={ref as React.Ref<HTMLElement>} data-reveal className={cls}>
          {children}
        </section>
      );
    case "ul":
      return (
        <ul ref={ref as React.Ref<HTMLUListElement>} data-reveal className={cls}>
          {children}
        </ul>
      );
    case "li":
      return (
        <li ref={ref as React.Ref<HTMLLIElement>} data-reveal className={cls}>
          {children}
        </li>
      );
    case "span":
      return (
        <span ref={ref as React.Ref<HTMLSpanElement>} data-reveal className={cls}>
          {children}
        </span>
      );
    default:
      return (
        <div ref={ref as React.Ref<HTMLDivElement>} data-reveal className={cls}>
          {children}
        </div>
      );
  }
}

/** Parallax translate driven by scroll progress. */
export function Parallax({
  children,
  className,
  amount = 80,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: amount * -0.5 },
        {
          y: amount * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Re-run ScrollTrigger measurements after images/layout settle. */
export function useScrollRefresh(deps: unknown[] = []) {
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
