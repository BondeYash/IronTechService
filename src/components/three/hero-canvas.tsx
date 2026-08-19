"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => null,
});

function webglSupported() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Gate for the WebGL hero: skipped entirely for reduced-motion visitors,
 * unsupported GPUs, and until the browser is idle, so first paint stays fast.
 * The static gradient underneath is the designed fallback, not a blank box.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !webglSupported()) return;
    const idle =
      window.requestIdleCallback?.(() => setMount(true), { timeout: 1200 }) ??
      window.setTimeout(() => setMount(true), 400);
    return () => {
      if (window.cancelIdleCallback && typeof idle === "number") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle as number);
    };
  }, []);

  return (
    <div className={className} aria-hidden>
      <div className="from-steel-950 via-steel-900 to-background absolute inset-0 bg-gradient-to-b" />
      <div className="bg-primary/12 absolute top-[-10%] left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full blur-[140px]" />
      {mount ? (
        <div className="absolute inset-0">
          <HeroScene />
        </div>
      ) : null}
    </div>
  );
}
