import { z } from "zod";
import type { Project } from "@/content/schema";
import raw from "@/data/github-snapshot.json";

/**
 * GitHub data comes only from a committed snapshot (never a network call during `next build`).
 * A future `scripts/fetch-github.ts` fills it before deploy; missing values are simply not rendered.
 */
const Repo = z.object({
  stars: z.number().int().nonnegative().optional(),
  lastCommit: z.string().optional(),
  license: z.string().optional(),
  archived: z.boolean().optional(),
  languages: z
    .array(z.object({ name: z.string(), pct: z.number() }))
    .optional(),
});
const Snapshot = z.object({
  fetchedAt: z.string().nullable(),
  repos: z.record(z.string(), Repo),
});
export type RepoData = z.infer<typeof Repo>;

const snapshot = Snapshot.parse(raw);
export const snapshotDate = snapshot.fetchedAt;

/** owner/repo + url for a project's github link, with snapshot data when present. */
export function repoOf(project: Project) {
  const link = project.links.find((l) => l.type === "github");
  if (!link) return null;
  const m = link.url.match(/github\.com\/([^/]+\/[^/#?]+)/);
  const slug = m ? m[1].replace(/\.git$/, "") : link.url;
  return {
    slug,
    url: link.url,
    data: snapshot.repos[slug] as RepoData | undefined,
  };
}
