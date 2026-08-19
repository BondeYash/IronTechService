import { projects, type Project } from "./projects";

export type Sector = {
  id: string;
  label: string;
  blurb: string;
  match: RegExp;
};

/**
 * Sectors are derived from the real project list rather than declared, so the
 * counts on the site always match what is actually in the portfolio.
 */
export const sectorDefs: Sector[] = [
  {
    id: "education",
    label: "Education",
    blurb:
      "Schools, campus additions and nursing colleges — long-span framing over gyms and assembly space, phased to match a summer shutdown.",
    match: /school|college|maccray|cooper west|sinclair|rtr/i,
  },
  {
    id: "healthcare",
    label: "Healthcare",
    blurb:
      "Clinics, surgery centres and care facilities where slab openings, equipment loads and hanger framing have to be right the first time.",
    match: /clinic|surgic|surgery|medical|care|wellness|namcc|linda/i,
  },
  {
    id: "retail",
    label: "Retail & commercial",
    blurb:
      "Supermarkets, pharmacies, banks and mixed-use shells — repetitive bays, tight schedules and canopy or storefront steel.",
    match: /publix|harris|cvs|piccadilly|mobile|bank|bbt|gateway|crestmoor|asc/i,
  },
  {
    id: "civic",
    label: "Civic & public",
    blurb:
      "Fire stations, county buildings and community facilities delivered against public procurement schedules.",
    match: /fire ?station|county|nations|studio|tinsley/i,
  },
  {
    id: "industrial",
    label: "Industrial & energy",
    blurb:
      "Foundry platforms, precipitator structures and plant access steel detailed around existing equipment and live operations.",
    match: /foundry|precipitator|plant|lodge|houston/i,
  },
  {
    id: "misc",
    label: "Miscellaneous steel",
    blurb:
      "Stairs, handrails, ladders, cover rails and plate work — the packages that decide whether a building feels finished.",
    match: /stair|rail|ladder|trus|entry/i,
  },
];

export type SectorSummary = Sector & {
  count: number;
  tonnage: number;
  samples: Project[];
};

export const sectors: SectorSummary[] = sectorDefs.map((sector) => {
  const matched = projects.filter((p) => sector.match.test(p.title));
  return {
    ...sector,
    count: matched.length,
    tonnage: matched.reduce((sum, p) => sum + (p.tonnage ?? 0), 0),
    samples: matched
      .slice()
      .sort((a, b) => (b.tonnage ?? 0) - (a.tonnage ?? 0))
      .slice(0, 3),
  };
});

/** First matching sector for a project, used to label rows in the index view. */
export function sectorLabelOf(project: Project): string {
  return sectorDefs.find((s) => s.match.test(project.title))?.label ?? "Structural steel";
}
