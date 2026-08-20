import { projects } from "@/data/projects";

const tonnages = projects.map((p) => p.tonnage).filter((t): t is number => typeof t === "number");

/** Packages with photography on the site. */
export const publishedProjects = projects.length;

/**
 * Total packages the client has delivered. Larger than `publishedProjects`
 * because the archive only carries the jobs we have images for — the headline
 * figure is the client's own count, the browsable grid stays honest about
 * what it can actually show.
 */
export const deliveredPackages = 80;

export const projectCount = publishedProjects;
export const totalTonnage = Math.round(tonnages.reduce((a, b) => a + b, 0));
export const largestTonnage = Math.max(...tonnages);

export const stats = [
  { value: deliveredPackages, suffix: "+", label: "Projects detailed" },
  { value: totalTonnage, suffix: "T", label: "Structural steel detailed" },
  { value: largestTonnage, suffix: "T", label: "Largest single package" },
  { value: 3, suffix: "", label: "Standards followed: AISC, NISD, OSHA" },
] as const;
