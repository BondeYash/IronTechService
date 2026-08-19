"use client";

import { useEffect, useRef } from "react";
import { usePageVisible } from "@/lib/use-in-viewport";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "./audio-engine";
import { cn } from "@/lib/utils";

/**
 * Opt-in ambience control with a live FFT visualizer.
 * Silent by default: a B2B visitor should never be ambushed by sound.
 */
export function AudioToggle({ className }: { className?: string }) {
  const { enabled, ready, toggle, spectrum } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageVisible = usePageVisible();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bars = 14;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const data = spectrum.current;
      const gap = 2 * dpr;
      const bw = (w - gap * (bars - 1)) / bars;

      for (let i = 0; i < bars; i++) {
        let v = 0.08;
        if (data && ready) {
          const bin = data[Math.floor((i / bars) * data.length)];
          v = Math.max(0.06, Math.min(1, (bin + 90) / 70));
        } else {
          // Static idle bars: this canvas sits in the header on every page, so
          // it must not animate while the sound is off.
          v = 0.06 + ((i % 5) + 1) * 0.018;
        }
        const bh = Math.max(2 * dpr, v * h);
        ctx.fillStyle = ready
          ? `oklch(${0.62 + v * 0.18} ${0.14 + v * 0.08} 55)`
          : "oklch(0.6 0.01 250)";
        ctx.fillRect(i * (bw + gap), h - bh, bw, bh);
      }
      // Only the live spectrum needs a frame loop; silent means paint once.
      if (ready && pageVisible) raf = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [ready, spectrum, pageVisible]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
      className={cn(
        "group border-border/70 hover:border-primary/60 flex items-center gap-3 rounded-full border px-3 py-2 transition-colors",
        "glass",
        className,
      )}
    >
      {enabled ? (
        <Volume2 className="text-primary size-4" />
      ) : (
        <VolumeX className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
      )}
      <canvas ref={canvasRef} className="h-4 w-14" aria-hidden />
      <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase opacity-70">
        {enabled ? "On" : "Sound"}
      </span>
    </button>
  );
}
