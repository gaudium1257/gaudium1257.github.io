import type { Project } from "@/content/schema";

export type TechCategory = Project["techStack"][number]["category"];

/** One fixed category order everywhere (stack map, project entries, detail). */
export const TIER: TechCategory[] = [
  "language",
  "frontend",
  "mobile",
  "backend",
  "ai-ml",
  "database",
  "data",
  "infra",
  "tooling",
  "other",
];

/** URL-safe slug for a tech name ("Next.js" → "nextjs", "C++" → "cpp", "C#" → "csharp"). */
export const techSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\+/g, "p")
    .replace(/#/g, "sharp")
    .replace(/\./g, "")
    .replace(/\//g, "-")
    .trim()
    .split(/\s+/)
    .join("-");

/** The project's techStack in TIER order. */
export const groupedStack = (project: Project) =>
  [...project.techStack].sort(
    (a, b) => TIER.indexOf(a.category) - TIER.indexOf(b.category),
  );

/** tech name → projects whose techStack contains it (exact spelling, as skills.json requires). */
export function techUsage(projects: Project[]) {
  const usage = new Map<string, Project[]>();
  for (const p of projects)
    for (const g of p.techStack)
      for (const name of g.items) {
        const list = usage.get(name) ?? [];
        if (!list.includes(p)) list.push(p);
        usage.set(name, list);
      }
  return usage;
}

export const projectTechSlugs = (project: Project) =>
  project.techStack.flatMap((g) => g.items.map(techSlug));
