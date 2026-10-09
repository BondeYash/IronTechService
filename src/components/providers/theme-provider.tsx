"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";

function ThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", resolvedTheme === "dark" ? "#11111c" : "#ffffff");
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="irontech-theme"
      disableTransitionOnChange
    >
      <ThemeColor />
      {children}
    </NextThemeProvider>
  );
}
