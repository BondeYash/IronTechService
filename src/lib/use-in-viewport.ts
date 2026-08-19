"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether an element is on (or near) screen. Used to stop work that a
 * visitor cannot see: WebGL render loops, marquees and auto-advancing sliders
 * all keep burning frames otherwise, which is most of the scroll jank.
 */
export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = "250px",
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/** False while the tab is backgrounded, so render loops can idle. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}
