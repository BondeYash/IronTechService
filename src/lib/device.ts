"use client";

type NavigatorInfo = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * Rough capability tier, read once before committing to WebGL work.
 * A phone on a metered connection should get the designed static hero rather
 * than a shader it will render at 12fps.
 */
export function deviceTier(): "high" | "mid" | "low" {
  if (typeof window === "undefined") return "mid";
  const nav = navigator as NavigatorInfo;
  if (nav.connection?.saveData) return "low";

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const small = window.matchMedia("(max-width: 900px)").matches;

  if (cores <= 4 || memory <= 4) return small ? "low" : "mid";
  return cores >= 8 && memory >= 8 ? "high" : "mid";
}
