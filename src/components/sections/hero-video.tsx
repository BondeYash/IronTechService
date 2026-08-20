"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { useInViewport, usePageVisible } from "@/lib/use-in-viewport";

const SRC = "/assets/video/steel-frame.mp4";
const POSTER = "/assets/video/steel-frame-poster.webp";

/**
 * Hero backdrop: a graded loop of a structural steel space frame.
 *
 * Source: coverr.co "Steel Construction" (cdn.coverr.co/videos/coverr-steel-
 * construction-1392). The Coverr license permits commercial use, modification
 * and self-hosting with no attribution required. The file is colour-graded and
 * mirrored into a palindrome so the loop never jump-cuts.
 *
 * The poster carries the first paint, so nothing waits on the video; playback
 * is paused whenever the hero is scrolled away or the tab is hidden, and
 * reduced-motion visitors only ever get the still.
 */
export function HeroVideo({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [play, setPlay] = useState(false);
  const onScreen = useInViewport(wrap, "80px");
  const pageVisible = usePageVisible();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = () => setPlay(true);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el || !play) return;
    if (onScreen && pageVisible) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [play, onScreen, pageVisible]);

  return (
    <div ref={wrap} className={className} aria-hidden>
      <div className="bg-steel-950 absolute inset-0" />

      {play ? (
        <video
          ref={video}
          className="absolute inset-0 size-full object-cover opacity-70"
          src={SRC}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="none"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={POSTER}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-70"
          fetchPriority="high"
        />
      )}

      {/* scrims: the headline sits on the left, so that side goes darkest */}
      <div className="from-background via-background/80 absolute inset-0 bg-gradient-to-r to-transparent" />
      <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
      <div className="bg-background/35 absolute inset-0" />
      <div className="hero-glow absolute top-[-14%] right-[-6%] h-[38rem] w-[38rem]" />
    </div>
  );
}
