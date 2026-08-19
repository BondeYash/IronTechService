"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { inView } from "@/lib/in-view";

/** Count-up that fires once when the figure scrolls into view. */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
      return;
    }
    const obj = { n: 0 };
    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      tween = gsap.to(obj, {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.n).toLocaleString()}${suffix}`;
        },
        paused: true,
      });
    }, el);
    const stop = inView(el, () => tween?.play());
    return () => {
      stop();
      ctx.revert();
    };
  }, [value, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
