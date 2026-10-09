"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title="Change color theme"
      className={cn(
        "border-border/70 text-primary hover:border-primary/60 hover:bg-accent focus-visible:outline-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-full border p-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        showLabel && "px-4 text-sm",
      )}
    >
      <Moon className="size-5 dark:hidden" aria-hidden />
      <Sun className="hidden size-5 dark:block" aria-hidden />
      <span className={cn("dark:hidden", !showLabel && "sr-only")}>Switch to dark theme</span>
      <span className={cn("hidden dark:inline", !showLabel && "sr-only")}>
        Switch to light theme
      </span>
    </button>
  );
}
