"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { LayoutGrid, List, Maximize2 } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { sectorLabelOf } from "@/data/sectors";
import { cn } from "@/lib/utils";
import { ProjectPhoto } from "./project-photo";
import { ProjectViewer } from "./project-viewer";

type Filter = "all" | "heavy" | "mid" | "misc";
const filters: { id: Filter; label: string; test: (project: Project) => boolean }[] = [
  { id: "all", label: "All work", test: () => true },
  { id: "heavy", label: "150 tons +", test: (p) => (p.tonnage ?? 0) >= 150 },
  { id: "mid", label: "Under 150 tons", test: (p) => p.tonnage != null && p.tonnage < 150 },
  {
    id: "misc",
    label: "Stairs, rails & misc.",
    test: (p) => p.tonnage == null || /stair|rail|ladder|trus|entry|precipitator/i.test(p.title),
  },
];

export function ProjectGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"mosaic" | "index">("mosaic");
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const visible = useMemo(
    () => projects.filter((filters.find((f) => f.id === filter) ?? filters[0]).test),
    [filter],
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "focus-visible:outline-primary rounded-full border px-5 py-2.5 text-sm transition-colors focus-visible:outline-2",
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary",
              )}
            >
              {f.label}
              <span className="ml-2 font-mono text-xs">{projects.filter(f.test).length}</span>
            </button>
          ))}
        </div>
        <div
          className="border-border flex gap-1 rounded-full border p-1"
          aria-label="Gallery layout"
        >
          {(
            [
              { id: "mosaic", label: "Mosaic", icon: LayoutGrid },
              { id: "index", label: "Index", icon: List },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              aria-pressed={view === id}
              className={cn(
                "focus-visible:outline-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs focus-visible:outline-2",
                view === id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-muted-foreground mt-5 text-sm" aria-live="polite">
        {visible.length} projects · Open any image for a full-resolution view.
      </p>
      <div
        className={
          view === "mosaic"
            ? "mt-8 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "divide-border border-border mt-8 divide-y border-y"
        }
      >
        {visible.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`View ${project.title}`}
            className={cn(
              "group focus-visible:outline-primary w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4",
              view === "mosaic"
                ? "border-border bg-card hover:border-primary overflow-hidden rounded-xl border transition-colors"
                : "hover:text-primary flex items-center gap-4 py-4",
            )}
          >
            {view === "mosaic" ? (
              <div className="bg-black">
                <ProjectPhoto
                  src={project.image}
                  alt={project.title}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <span className="relative h-16 w-24 shrink-0 rounded bg-black">
                <Image src={project.image} alt="" fill sizes="96px" className="object-contain" />
              </span>
            )}
            <span className={cn("block min-w-0 flex-1", view === "mosaic" && "p-4")}>
              <span className="flex items-start justify-between gap-3">
                <span className="block text-base font-medium">{project.title}</span>
                <Maximize2 className="text-primary mt-1 size-4 shrink-0" />
              </span>
              <span className="text-primary mt-2 block font-mono text-xs">
                {project.tonnage ? `${project.tonnage.toLocaleString()} tons` : "Misc. steel"}
              </span>
              <span className="text-muted-foreground mt-1 block text-xs">
                {sectorLabelOf(project)}
              </span>
            </span>
          </button>
        ))}
      </div>
      {selected != null && (
        <ProjectViewer
          items={visible}
          index={selected}
          onIndexChange={setSelected}
          onClose={close}
        />
      )}
    </>
  );
}
