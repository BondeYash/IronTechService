"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, Minus, Plus, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { fitImage } from "@/lib/image-fit";
import { useModalDialog } from "@/lib/use-modal-dialog";
import { imageSize } from "./project-photo";
import { cn } from "@/lib/utils";

const control =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-xs hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-35";

function ImageViewport({ src, title }: { src: string; title: string }) {
  const { width, height } = imageSize(src);
  const viewport = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const [requestedScale, setRequestedScale] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const fit = fitImage(width, height, bounds.width, bounds.height);
  const scale =
    requestedScale == null ? fit.scale : Math.max(fit.scale, Math.min(1, requestedScale));
  const enlarged = scale > fit.scale + 0.001;

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setBounds({ width: el.clientWidth, height: el.clientHeight }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const changeScale = (value: number | null) => {
    setRequestedScale(value);
    viewport.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 py-3">
        <button
          type="button"
          className={control}
          onClick={() => changeScale(null)}
          aria-pressed={!enlarged}
        >
          <Maximize2 className="size-4" /> Fit to screen
        </button>
        <button
          type="button"
          className={control}
          onClick={() => changeScale(1)}
          aria-pressed={scale === 1}
        >
          Original size
        </button>
        <button
          type="button"
          className={control}
          aria-label="Zoom out"
          disabled={!enlarged}
          onClick={() => changeScale(Math.max(fit.scale, scale - 0.25))}
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          className={control}
          aria-label="Zoom in"
          disabled={scale >= 1}
          onClick={() => changeScale(Math.min(1, scale + 0.25))}
        >
          <Plus className="size-4" />
        </button>
        <span className="text-muted-foreground font-mono text-xs" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
        <a
          className={control}
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open original image in a new tab"
        >
          <ExternalLink className="size-4" />
          <span className="hidden sm:inline">Open original</span>
        </a>
        <span className="text-muted-foreground ml-auto font-mono text-xs">
          {width} × {height} px
        </span>
      </div>
      <div
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-label={
          enlarged
            ? "Enlarged project image. Scroll or use arrow keys to pan."
            : "Project image, fitted to screen"
        }
        data-enlarged={enlarged}
        className="focus-visible:outline-primary relative min-h-0 flex-1 overflow-auto overscroll-contain rounded-lg bg-black focus-visible:outline-2"
      >
        {(!loaded || failed) && (
          <p role="status" className="absolute inset-x-0 top-4 z-10 text-center text-sm">
            {failed
              ? "Image could not load. Try opening the original above."
              : "Loading original image…"}
          </p>
        )}
        <div
          className="flex items-center justify-center"
          style={{
            width: Math.max(bounds.width, width * scale),
            height: Math.max(bounds.height, height * scale),
          }}
        >
          {/* Only the selected source is fetched here. Bypass optimization to inspect its actual pixels. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            width={width}
            height={height}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className="block shrink-0"
            style={{
              width: width * scale,
              height: height * scale,
              maxWidth: "none",
              opacity: loaded ? 1 : 0,
            }}
          />
        </div>
      </div>
      <p className="text-muted-foreground py-2 text-xs">
        {enlarged
          ? "Scroll or swipe the image to inspect details. Fit to screen shows the complete project."
          : "Complete image · proportions preserved · zoom stops at the original resolution."}
      </p>
    </>
  );
}

export function ProjectViewer({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: readonly Project[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useModalDialog(onClose);
  const [shot, setShot] = useState(0);
  const project = items[index];
  const shots = [project.image, ...project.gallery];
  const src = shots[shot] ?? project.image;
  const step = (direction: number) => {
    setShot(0);
    onIndexChange((index + direction + items.length) % items.length);
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-viewer-title"
      data-lenis-prevent
      className="bg-background text-foreground fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 p-3 backdrop:bg-black/80 sm:p-6"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.target instanceof Element && event.target.closest('[data-enlarged="true"]'))
          return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          step(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="mx-auto flex h-full max-w-[1800px] flex-col">
        <div className="border-border flex items-center gap-2 border-b pb-3">
          <div className="min-w-0 flex-1" aria-live="polite">
            <h2 id="project-viewer-title" className="truncate text-base sm:text-xl">
              {project.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {project.tonnage ? `${project.tonnage.toLocaleString()} tons` : "Miscellaneous steel"}{" "}
              · Project {index + 1} of {items.length} · Image {shot + 1} of {shots.length}
            </p>
          </div>
          {items.length > 1 && (
            <>
              <button
                type="button"
                className={control}
                onClick={() => step(-1)}
                aria-label="Previous project"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                className={control}
                onClick={() => step(1)}
                aria-label="Next project"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}
          <button
            type="button"
            data-dialog-close
            autoFocus
            className={control}
            onClick={onClose}
            aria-label="Close project viewer"
          >
            <X className="size-5" />
          </button>
        </div>
        <ImageViewport key={src} src={src} title={project.title} />
        {shots.length > 1 && (
          <div
            className="flex shrink-0 gap-2 overflow-x-auto py-1"
            aria-label="Project photographs"
          >
            {shots.map((image, i) => (
              <button
                key={image}
                type="button"
                onClick={() => setShot(i)}
                aria-label={`Show image ${i + 1} of ${shots.length}`}
                aria-pressed={i === shot}
                className={cn(
                  "focus-visible:outline-primary relative h-12 w-20 shrink-0 rounded border bg-black focus-visible:outline-2",
                  i === shot ? "border-primary" : "border-border",
                )}
              >
                <Image src={image} alt="" fill sizes="80px" className="object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}
