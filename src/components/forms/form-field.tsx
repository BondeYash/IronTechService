"use client";

import { cn } from "@/lib/utils";

export function Field({
  label,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase">
          {label}
          {required ? <span className="text-primary ml-1">*</span> : null}
        </span>
        {hint ? <span className="text-muted-foreground text-[0.65rem]">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="text-destructive mt-1.5 block text-xs">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border/70 bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/40";
