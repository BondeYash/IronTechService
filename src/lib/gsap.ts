"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

// registerPlugin is idempotent; the window guard keeps it off the server.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

export { gsap, ScrollTrigger, Flip };

export const EASE = {
  out: "power3.out",
  inOut: "power3.inOut",
  expo: "expo.out",
} as const;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
