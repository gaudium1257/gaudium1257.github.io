/**
 * Reads and validates everything under `content/`.
 *
 * Pure Node (no Next.js imports) so it can run both inside the app build
 * (`load.ts`) and from `scripts/validate-content.ts`. Never throws on bad
 * content — it reports every problem at once so they can be fixed in one pass.
 */
import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import {
  Activity,
  Award,
  Education,
  Profile,
  Project,
  Skills,
  Society,
  type Localized,
} from "./schema";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentKind =
  "project" | "activity" | "award" | "society" | "society-event";

export interface Content {
  profile: Profile | null;
  skills: Skills;
  education: Education;
  projects: Project[];
  activities: Activity[];
  awards: Award[];
  societies: Society[];
  /** Every addressable id → what it is. */
  index: Map<
    string,
    { kind: ContentKind; title: Localized; parentId?: string }
  >;
  /** Undirected relation graph: declaring a link on either side is enough. */
  relations: Map<string, Set<string>>;
}

export interface CollectResult {
  content: Content;
  errors: string[];
  warnings: string[];
}

const rel = (file: string) => path.relative(process.cwd(), file);

function readJson(file: string, errors: string[]): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`${rel(file)}: invalid JSON — ${(e as Error).message}`);
    return undefined;
  }
}

function formatIssues(file: string, error: z.ZodError): string[] {
  return error.issues.map(
    (i) =>
      `${rel(file)}: ${i.path.length ? i.path.join(".") : "(root)"} — ${i.message}`,
  );
}

function parseFile<S extends z.ZodType>(
  schema: S,
  file: string,
  errors: string[],
): z.infer<S> | undefined {
  const raw = readJson(file, errors);
  if (raw === undefined) return undefined;
  const result = schema.safeParse(raw);
  if (!result.success) {
    errors.push(...formatIssues(file, result.error));
    return undefined;
  }
  return result.data;
}

/** `content/<dir>/*.json`, skipping `_`-prefixed files. Checks `id` matches the file name. */
function parseCollection<S extends z.ZodType<{ id: string }>>(
  schema: S,
  dir: string,
  errors: string[],
): z.infer<S>[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort()
    .flatMap((f) => {
      const file = path.join(full, f);
      const item = parseFile(schema, file, errors);
      if (!item) return [];
      const expected = f.replace(/\.json$/, "");
      if (item.id !== expected) {
        errors.push(
          `${rel(file)}: id "${item.id}" must match file name "${expected}"`,
        );
      }
      return [item];
    });
}

function parseSingle<S extends z.ZodType>(
  schema: S,
  name: string,
  errors: string[],
  fallback: z.infer<S>,
): z.infer<S> {
  const file = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(file)) return fallback;
  return parseFile(schema, file, errors) ?? fallback;
}

/** Walks any value and yields every string with its JSON path. */
function* strings(value: unknown, at = ""): Generator<[string, string]> {
  if (typeof value === "string") yield [at, value];
  else if (Array.isArray(value))
    for (const [i, v] of value.entries()) yield* strings(v, `${at}[${i}]`);
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value))
      yield* strings(v, at ? `${at}.${k}` : k);
}

export function collectContent(): CollectResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const profileFile = path.join(CONTENT_DIR, "profile.json");
  const profile = fs.existsSync(profileFile)
    ? (parseFile(Profile, profileFile, errors) ?? null)
    : null;
  if (!fs.existsSync(profileFile))
    errors.push("content/profile.json is missing");

  const content: Content = {
    profile,
    skills: parseSingle(Skills, "skills.json", errors, { groups: [] }),
    education: parseSingle(Education, "education.json", errors, { items: [] }),
    projects: parseCollection(Project, "projects", errors),
    activities: parseCollection(Activity, "activities", errors),
    awards: parseCollection(Award, "awards", errors),
    societies: parseCollection(Society, "society", errors),
    index: new Map(),
    relations: new Map(),
  };

  // --- id index (ids are global so `related` can point anywhere) -----------
  const declared: { id: string; related: string[] }[] = [];
  const register = (
    id: string,
    kind: ContentKind,
    title: Localized,
    related: string[],
    parentId?: string,
  ) => {
    if (content.index.has(id)) errors.push(`duplicate id "${id}" (${kind})`);
    content.index.set(id, { kind, title, parentId });
    declared.push({ id, related });
  };
  content.projects.forEach((p) =>
    register(p.id, "project", p.title, p.related),
  );
  content.activities.forEach((a) =>
    register(a.id, "activity", a.title, a.related),
  );
  content.awards.forEach((a) => register(a.id, "award", a.title, a.related));
  content.societies.forEach((s) => {
    register(s.id, "society", s.name, s.related);
    s.events.forEach((e) =>
      register(e.id, "society-event", e.title, e.related, s.id),
    );
  });

  // --- relations ------------------------------------------------------------
  const link = (a: string, b: string) => {
    if (!content.relations.has(a)) content.relations.set(a, new Set());
    content.relations.get(a)!.add(b);
  };
  for (const { id, related } of declared) {
    for (const target of related) {
      if (target === id) errors.push(`"${id}" relates to itself`);
      else if (!content.index.has(target))
        errors.push(`"${id}".related → unknown id "${target}"`);
      else {
        link(id, target);
        link(target, id);
      }
    }
  }

  // --- soft checks (errors under --strict) ----------------------------------
  const known = new Set(
    content.skills.groups.flatMap((g) => g.items.map((i) => i.name)),
  );
  if (known.size > 0) {
    for (const p of content.projects)
      for (const t of p.techStack.flatMap((s) => s.items))
        if (!known.has(t))
          warnings.push(
            `project "${p.id}": tech "${t}" is not listed in content/skills.json`,
          );
  }

  for (const [label, value] of [
    ["profile", content.profile],
    ["skills", content.skills],
    ["education", content.education],
    ...content.projects.map((p) => [`project "${p.id}"`, p] as const),
    ...content.activities.map((a) => [`activity "${a.id}"`, a] as const),
    ...content.awards.map((a) => [`award "${a.id}"`, a] as const),
    ...content.societies.map((s) => [`society "${s.id}"`, s] as const),
  ] as const) {
    for (const [at, s] of strings(value))
      if (/\bTODO\b/.test(s))
        warnings.push(`${label}: ${at} is still a TODO placeholder`);
  }

  for (const p of content.projects) {
    if (p.deployment.status === "live" && !p.deployment.url)
      errors.push(
        `project "${p.id}": deployment.status is "live" but no url is given`,
      );
    if (p.period.end && p.period.end < p.period.start)
      errors.push(`project "${p.id}": period.end is before period.start`);
  }

  return { content, errors, warnings };
}
