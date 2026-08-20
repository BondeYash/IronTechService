"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, LayoutGrid, List } from "lucide-react";
import { gsap, Flip, EASE, prefersReducedMotion } from "@/lib/gsap";
import { inView } from "@/lib/in-view";
import { projects, type Project } from "@/data/projects";
import { sectorLabelOf } from "@/data/sectors";
import { cn } from "@/lib/utils";

type Filter = "all" | "heavy" | "mid" | "misc";
type View = "mosaic" | "index";

const filters: { id: Filter; label: string; test: (p: Project) => boolean }[] = [
  { id: "all", label: "All work", test: () => true },
  { id: "heavy", label: "150 tons +", test: (p) => (p.tonnage ?? 0) >= 150 },
  {
    id: "mid",
    label: "Under 150 tons",
    test: (p) => p.tonnage != null && p.tonnage < 150,
  },
  {
    id: "misc",
    label: "Stairs, rails & misc.",
    test: (p) => p.tonnage == null || /stair|rail|ladder|trus|entry|precipitator/i.test(p.title),
  },
];

/**
 * Tile shape follows the photograph. Model shots are wide (~1.9:1) so they get
 * landscape cells, stair and ladder shots are portrait and get tall ones, and
 * every seventh wide shot runs double width to break the flat 3×N grid.
 */
function tileClass(p: Project, i: number) {
  const portrait = p.height > p.width;
  if (portrait) return "row-span-3";
  if (i % 7 === 0) return "col-span-2 row-span-3";
  return "row-span-2";
}

export function ProjectGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("mosaic");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [shot, setShot] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewX = useRef<((v: number) => void) | null>(null);
  const previewY = useRef<((v: number) => void) | null>(null);

  const visible = useMemo(() => {
    const f = filters.find((x) => x.id === filter) ?? filters[0];
    return projects.filter(f.test);
  }, [filter]);

  // Entrance: cards wipe open from a squashed clip rather than a plain fade.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, y: 0, clipPath: "none" });
      return;
    }
    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      tween = gsap.fromTo(
        cards,
        { opacity: 0, y: 54, clipPath: "inset(14% 0% 14% 0%)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: EASE.expo,
          stagger: { each: 0.045, from: "start" },
          paused: true,
        },
      );
    }, el);
    const stop = inView(el, () => tween?.play());
    return () => {
      stop();
      ctx.revert();
    };
  }, [view]);

  // Filter changes re-flow the same DOM nodes: FLIP animates every tile from
  // where it was to where it lands, so nothing teleports.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      scale: true,
      absolute: true,
      stagger: 0.02,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.86 },
          { opacity: 1, scale: 1, duration: 0.5, ease: EASE.out, stagger: 0.02 },
        ),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.86, duration: 0.35 }),
    });
  }, [filter, view]);

  const changeFilter = (id: Filter) => {
    if (id === filter) return;
    const el = gridRef.current;
    if (el && !prefersReducedMotion()) {
      flipState.current = Flip.getState(el.querySelectorAll("[data-card]"));
    }
    setHovered(null);
    setFilter(id);
  };

  const changeView = (next: View) => {
    if (next === view) return;
    setHovered(null);
    setView(next);
  };

  // Pointer-follow preview for the index view.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return;
    previewX.current = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    previewY.current = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    return () => {
      previewX.current = null;
      previewY.current = null;
      gsap.killTweensOf(el);
    };
  }, [view]);

  const trackPointer = (e: React.PointerEvent) => {
    previewX.current?.(e.clientX + 24);
    previewY.current?.(e.clientY - 130);
  };

  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: px * 9,
      rotateX: -py * 9,
      duration: 0.5,
      ease: "power3.out",
      transformPerspective: 1000,
      overwrite: "auto",
    });
  };

  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.6)",
      overwrite: "auto",
    });
  };

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setShot(0);
      setLightbox((i) => (i == null ? i : (i + dir + visible.length) % visible.length));
    },
    [visible.length],
  );
  const open = useCallback((i: number) => {
    setShot(0);
    setLightbox(i);
  }, []);

  useEffect(() => {
    if (lightbox == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  const current = lightbox != null ? visible[lightbox] : null;
  const shots = current ? [current.image, ...current.gallery] : [];
  const activeShot = shots[Math.min(shot, shots.length - 1)] ?? current?.image;
  const preview = hovered != null ? visible[hovered] : null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const count = projects.filter(f.test).length;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => changeFilter(f.id)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm transition-colors",
                  filter === f.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                )}
              >
                {f.label}
                <span className="ml-2 font-mono text-[0.65rem] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="border-border/70 flex items-center gap-1 rounded-full border p-1">
          {(
            [
              { id: "mosaic" as const, icon: LayoutGrid, label: "Mosaic" },
              { id: "index" as const, icon: List, label: "Index" },
            ]
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => changeView(id)}
              aria-pressed={view === id}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[0.62rem] tracking-[0.16em] uppercase transition-colors",
                view === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "mosaic" ? (
        <div
          ref={gridRef}
          className="mt-10 grid auto-rows-[9rem] grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {visible.map((p, i) => (
            <button
              key={p.slug}
              data-card
              data-flip-id={p.slug}
              type="button"
              onClick={() => open(i)}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className={cn(
                "group border-border/60 bg-card relative overflow-hidden rounded-xl border text-left will-change-transform",
                tileClass(p, i),
              )}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes={
                  i % 7 === 0
                    ? "(max-width: 640px) 100vw, 50vw"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                }
                className="object-cover grayscale-[0.45] transition-all duration-[900ms] ease-out group-hover:scale-[1.07] group-hover:grayscale-0"
              />

              {/* base scrim keeps captions legible, molten wash arrives on hover */}
              <div className="from-background via-background/25 absolute inset-0 bg-gradient-to-t to-transparent" />
              <div className="from-primary/35 absolute inset-0 bg-gradient-to-tr via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <span className="text-primary/80 absolute top-3 left-4 font-mono text-[0.6rem] tracking-[0.2em]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="glass border-border/60 text-foreground absolute top-3 right-3 flex size-8 items-center justify-center rounded-full border opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Maximize2 className="size-3.5" />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3
                  className={cn(
                    "leading-snug transition-transform duration-500 group-hover:-translate-y-0.5 [--heading-weight:650]",
                    i % 7 === 0 ? "text-lg sm:text-2xl" : "text-sm sm:text-base",
                  )}
                >
                  {p.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="text-primary font-mono text-[0.62rem] tracking-[0.16em] uppercase">
                    {p.tonnage ? `${p.tonnage.toLocaleString()} tons` : "Misc. steel"}
                  </span>
                  <span className="text-muted-foreground/70 hidden font-mono text-[0.58rem] tracking-[0.16em] uppercase sm:inline">
                    {sectorLabelOf(p)}
                  </span>
                </div>
              </div>

              <span className="bg-primary absolute inset-x-0 bottom-0 h-px w-0 transition-all duration-500 group-hover:w-full" />
            </button>
          ))}
        </div>
      ) : (
        <div ref={gridRef} className="mt-10" onPointerMove={trackPointer}>
          <div className="text-muted-foreground/60 border-border/60 hidden grid-cols-[3rem_1fr_12rem_7rem] gap-4 border-b pb-3 font-mono text-[0.58rem] tracking-[0.2em] uppercase lg:grid">
            <span>#</span>
            <span>Package</span>
            <span>Sector</span>
            <span className="text-right">Tonnage</span>
          </div>

          <ul>
            {visible.map((p, i) => (
              <li key={p.slug} data-card data-flip-id={p.slug}>
                <button
                  type="button"
                  onClick={() => open(i)}
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered(null)}
                  className="group border-border/50 relative grid w-full grid-cols-[2.5rem_1fr_5rem] items-center gap-4 border-b py-5 text-left lg:grid-cols-[3rem_1fr_12rem_7rem]"
                >
                  <span className="bg-primary/8 absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <span className="text-muted-foreground/60 group-hover:text-primary relative font-mono text-[0.62rem] transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading relative truncate text-base transition-transform duration-500 group-hover:translate-x-2 sm:text-xl [--heading-weight:600]">
                    {p.title}
                  </span>
                  <span className="text-muted-foreground relative hidden font-mono text-[0.62rem] tracking-[0.14em] uppercase lg:block">
                    {sectorLabelOf(p)}
                  </span>
                  <span className="text-primary relative text-right font-mono text-[0.66rem] tracking-[0.14em] uppercase">
                    {p.tonnage ? `${p.tonnage.toLocaleString()} T` : "Misc."}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* image trails the cursor while a row is hovered */}
          <div
            ref={previewRef}
            aria-hidden
            className={cn(
              "border-border/60 pointer-events-none fixed top-0 left-0 z-50 hidden h-56 w-80 overflow-hidden rounded-lg border transition-opacity duration-300 lg:block",
              preview ? "opacity-100" : "opacity-0",
            )}
          >
            {preview ? (
              <Image
                src={preview.image}
                alt=""
                fill
                sizes="320px"
                className="object-cover"
              />
            ) : null}
          </div>
        </div>
      )}

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="bg-background/92 fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-xl sm:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="border-border/70 hover:border-primary/70 absolute top-5 right-5 rounded-full border p-3 transition"
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Previous project"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="border-border/70 hover:border-primary/70 absolute left-4 rounded-full border p-3 transition sm:left-8"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="border-border/70 hover:border-primary/70 absolute right-4 rounded-full border p-3 transition sm:right-8"
          >
            <ChevronRight className="size-5" />
          </button>

          <figure className="max-h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-border/60 relative aspect-16/10 overflow-hidden rounded-xl border">
              <Image
                src={activeShot ?? current.image}
                alt={current.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            {shots.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {shots.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={`Shot ${i + 1} of ${shots.length}`}
                    aria-current={i === shot}
                    className={cn(
                      "relative h-12 w-20 overflow-hidden rounded border transition-opacity",
                      i === shot
                        ? "border-primary opacity-100"
                        : "border-border/60 opacity-50 hover:opacity-90",
                    )}
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="font-heading text-xl tracking-tight [--heading-weight:700]">
                {current.title}
              </p>
              <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
                {current.tonnage
                  ? `${current.tonnage.toLocaleString()} tons`
                  : "Miscellaneous steel"}{" "}
                · {(lightbox ?? 0) + 1}/{visible.length}
              </p>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
