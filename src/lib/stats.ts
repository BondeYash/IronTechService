import { projects } from "@/data/projects";

/** Packages with photography on the site. */
export const publishedProjects = projects.length;

/**
 * Total packages the client has delivered. Larger than `publishedProjects`
 * because the archive only carries the jobs we have images for — the headline
 * figure is the client's own count, the browsable grid stays honest about
 * what it can actually show.
 */
export const deliveredPackages = 400;

export const projectCount = publishedProjects;
// Client-provided figures across all delivered work.
export const totalTonnage = 30000;
export const largestTonnage = 2200;

export const stats = [
  { value: deliveredPackages, suffix: "+", label: "Projects detailed" },
  { value: totalTonnage, suffix: "T", label: "Structural steel detailed" },
  { value: largestTonnage, suffix: "T", label: "Largest single package" },
  { value: 3, suffix: "", label: "Standards followed: AISC, NISD, OSHA" },
] as const;
