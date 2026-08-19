"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Adds `reveal-ready` to <html> only when JS is live and motion is welcome.
 * Without it, `[data-reveal]` content stays visible — no blank page if the
 * bundle fails or the visitor opted out of motion.
 */
export function RevealReady() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    document.documentElement.classList.add("reveal-ready");
    return () => document.documentElement.classList.remove("reveal-ready");
  }, []);
  return null;
}
