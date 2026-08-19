"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { deviceTier } from "@/lib/device";

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
  const [giveUp, setGiveUp] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || deviceTier() === "low" || !webglSupported()) return;

    let idle: number | undefined;
    // Waiting for `load` keeps the three.js chunk off the critical path: the
    // page is interactive first, the shader arrives after.
    const schedule = () => {
      idle =
        window.requestIdleCallback?.(() => setMount(true), { timeout: 2500 }) ??
        window.setTimeout(() => setMount(true), 600);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idle == null) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  return (
    <div className={className} aria-hidden>
      <div className="from-steel-950 via-steel-900 to-background absolute inset-0 bg-gradient-to-b" />
      <div className="hero-glow absolute top-[-10%] left-1/2 h-[46rem] w-[46rem] -translate-x-1/2" />
      {mount && !giveUp ? (
        <div className="absolute inset-0">
          {/* Two consecutive frame-rate declines and the scene retires for
              this visit; the static hero underneath is already a finished
              design, so nobody is left staring at a stutter. */}
          <HeroScene onGiveUp={() => setGiveUp(true)} />
        </div>
      ) : null}
    </div>
  );
}
