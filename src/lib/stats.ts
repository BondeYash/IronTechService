import { projects } from "@/data/projects";

const tonnages = projects.map((p) => p.tonnage).filter((t): t is number => typeof t === "number");

export const projectCount = projects.length;
export const totalTonnage = Math.round(tonnages.reduce((a, b) => a + b, 0));
export const largestTonnage = Math.max(...tonnages);

export const stats = [
  { value: projectCount, suffix: "+", label: "Projects detailed" },
  { value: totalTonnage, suffix: "T", label: "Structural steel detailed" },
  { value: largestTonnage, suffix: "T", label: "Largest single package" },
  { value: 3, suffix: "", label: "Standards followed: AISC, NISD, OSHA" },
] as const;
