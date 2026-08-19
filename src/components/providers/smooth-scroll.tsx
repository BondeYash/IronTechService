"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Lenis drives scroll; GSAP's ticker drives Lenis so ScrollTrigger and the
 * smooth-scroll loop share one RAF. Reduced-motion visitors get native scroll.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Fonts and images settle after hydration and shift every trigger point,
  // so measure again once the page has fully loaded.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 600);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("load", refresh);
    };
  }, []);

  // Route changes swap the DOM under ScrollTrigger; recalculate once painted.
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <>{children}</>;
}
