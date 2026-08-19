import { cn } from "@/lib/utils";

/**
 * Custom emblem set. These are original marks drawn for this site — they
 * deliberately do NOT reproduce the AISC, OSHA, Trimble/Tekla or Fabtrol
 * trademarks, which would imply membership or endorsement. If Irontech holds
 * an official membership or partner mark, swap the glyph for the licensed file.
 */

type Glyph = "beam" | "compass" | "helmet" | "cube" | "stack" | "tag";

const glyphs: Record<Glyph, React.ReactNode> = {
  // wide-flange section, end on
  beam: (
    <path
      d="M14 15h20M14 15v2h8v14h-8v2h20v-2h-8V17h8v-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  // drafting compass
  compass: (
    <>
      <circle cx="24" cy="13" r="2.4" fill="currentColor" />
      <path
        d="M22.6 15.4 16 33m9.4-17.6L32 33M19.4 26h9.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  // hard hat
  helmet: (
    <>
      <path
        d="M13 28a11 11 0 0 1 22 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 18.5V15h8v3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M11 28h26v2.6H11z" fill="currentColor" />
    </>
  ),
  // isometric cube = 3D model
  cube: (
    <path
      d="M24 12 34 18v12l-10 6-10-6V18l10-6Zm0 0v12m0 0 10-6m-10 6-10-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  // stacked records = production data
  stack: (
    <>
      <ellipse
        cx="24"
        cy="16"
        rx="9"
        ry="3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15 16v8c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4v-8M15 24v6c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4v-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </>
  ),
  // material tag / bill of material
  tag: (
    <>
      <path
        d="M14 16h12l8 8-10 10-10-10V16Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="22" r="2" fill="currentColor" />
    </>
  ),
};

export type BadgeMark = {
  code: string;
  caption: string;
  glyph: Glyph;
  shape: "shield" | "hex" | "plate";
};

export const standardMarks: BadgeMark[] = [
  { code: "AISC", caption: "Detailing practice", glyph: "beam", shape: "shield" },
  { code: "NISD", caption: "Drafting standards", glyph: "compass", shape: "shield" },
  { code: "OSHA", caption: "Erection safety", glyph: "helmet", shape: "shield" },
];

export const softwareMarks: BadgeMark[] = [
  { code: "SDS/2", caption: "Modelling & drawings", glyph: "cube", shape: "plate" },
  { code: "Tekla EPM", caption: "Status transfer", glyph: "stack", shape: "plate" },
  { code: "Fabtrol", caption: "Material exports", glyph: "tag", shape: "plate" },
];

const outlines: Record<BadgeMark["shape"], string> = {
  shield: "M24 4 42 11v14c0 11-7.6 17.4-18 21-10.4-3.6-18-10-18-21V11L24 4Z",
  hex: "M24 3 42 13.5v21L24 45 6 34.5v-21L24 3Z",
  plate: "M8 6h32a2 2 0 0 1 2 2v32a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z",
};

export function StandardBadge({
  mark,
  className,
}: {
  mark: BadgeMark;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group border-border/70 bg-background/60 hover:border-primary/60 flex items-center gap-4 rounded-xl border p-4 transition-colors duration-500",
        className,
      )}
    >
      <svg
        viewBox="0 0 48 48"
        className="text-primary size-11 shrink-0"
        aria-hidden
      >
        <path
          d={outlines[mark.shape]}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="opacity-45 transition-opacity duration-500 group-hover:opacity-100"
        />
        {glyphs[mark.glyph]}
      </svg>
      <div className="min-w-0">
        <p className="font-heading text-[0.95rem] leading-none tracking-tight [--heading-weight:750]">
          {mark.code}
        </p>
        <p className="text-muted-foreground mt-1.5 font-mono text-[0.58rem] tracking-[0.16em] uppercase">
          {mark.caption}
        </p>
      </div>
    </div>
  );
}

export function BadgeRow({
  marks,
  className,
}: {
  marks: BadgeMark[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {marks.map((mark) => (
        <StandardBadge key={mark.code} mark={mark} />
      ))}
    </div>
  );
}
