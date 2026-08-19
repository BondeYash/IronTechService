/**
 * Fire a callback once, when an element first crosses into view.
 *
 * Reveal animations used to hang off ScrollTrigger, which only fires when its
 * measurements are current: a stale refresh, a viewport resize or a full-page
 * screenshot capture could leave a block stuck at opacity 0 with no way back.
 * IntersectionObserver answers "is this on screen" directly, so a reveal can
 * never be stranded by bad geometry.
 */
export function inView(
  el: Element,
  onEnter: () => void,
  rootMargin = "0px 0px -8% 0px",
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      onEnter();
    },
    { rootMargin, threshold: 0 },
  );

  io.observe(el);
  return () => io.disconnect();
}
