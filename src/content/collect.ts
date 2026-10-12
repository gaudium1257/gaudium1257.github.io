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
import { MEDIA_RATIO } from "../lib/media";
import {
  Activity,
  Award,
  Education,
  Profile,
  Project,
  ProjectOrder,
  Skills,
  type Localized,
} from "./schema";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentKind = "project" | "activity" | "award";

export interface Content {
  profile: Profile | null;
  skills: Skills;
  education: Education;
  projects: Project[];
  activities: Activity[];
  awards: Award[];
  /** Every addressable id → what it is. */
  index: Map<string, { kind: ContentKind; title: Localized }>;
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
    education: parseSingle(Education, "education.json", errors, {
      items: [],
      career: [],
    }),
    projects: parseCollection(Project, "projects", errors),
    activities: parseCollection(Activity, "activities", errors),
    awards: parseCollection(Award, "awards", errors),
    index: new Map(),
    relations: new Map(),
  };

  // --- project order: the owner's list first, the rest newest first ---------
  const orderFile = "project-order.json";
  const { order } = parseSingle(ProjectOrder, orderFile, errors, { order: [] });
  const ids = new Set(content.projects.map((p) => p.id));
  order.forEach((id, i) => {
    if (!ids.has(id))
      errors.push(`content/${orderFile}: unknown project id "${id}"`);
    if (order.indexOf(id) !== i)
      errors.push(`content/${orderFile}: "${id}" is listed twice`);
  });
  const rank = (id: string) =>
    order.includes(id) ? order.indexOf(id) : order.length;
  content.projects.sort(
    (a, b) =>
      rank(a.id) - rank(b.id) || b.period.start.localeCompare(a.period.start),
  );

  // --- id index (ids are global so `related` can point anywhere) -----------
  const declared: { id: string; related: string[] }[] = [];
  const register = (
    id: string,
    kind: ContentKind,
    title: Localized,
    related: string[],
  ) => {
    if (content.index.has(id)) errors.push(`duplicate id "${id}" (${kind})`);
    content.index.set(id, { kind, title });
    declared.push({ id, related });
  };
  content.projects.forEach((p) =>
    register(p.id, "project", p.title, p.related),
  );
  content.activities.forEach((a) =>
    register(a.id, "activity", a.title, a.related),
  );
  content.awards.forEach((a) => register(a.id, "award", a.title, a.related));

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

    const stack = new Set(p.techStack.flatMap((g) => g.items));
    for (const name of Object.keys(p.techNotes))
      if (!stack.has(name))
        errors.push(
          `project "${p.id}": techNotes["${name}"] has no matching techStack item`,
        );

    // capture boxes never crop, so each file must exist and match its box ratio
    const shots = [
      ...(p.thumbnail ? [{ src: p.thumbnail, kind: "web" as const }] : []),
      ...p.screenshots,
    ];
    if (p.logo) {
      const file = path.join(PUBLIC_DIR, p.logo);
      const size = fs.existsSync(file) ? imageSize(file) : null;
      if (!fs.existsSync(file))
        errors.push(`project "${p.id}": image ${p.logo} not found in public/`);
      else if (size && size.width !== size.height)
        errors.push(
          `project "${p.id}": logo ${p.logo} is ${size.width}×${size.height}; it must be square`,
        );
    }
    for (const { src, kind } of shots) {
      const file = path.join(PUBLIC_DIR, src);
      if (!fs.existsSync(file)) {
        errors.push(`project "${p.id}": image ${src} not found in public/`);
        continue;
      }
      const size = imageSize(file);
      if (!size) continue; // ratio is only read from PNG/JPEG
      const ratio = size.width / size.height;
      if (Math.abs(ratio / MEDIA_RATIO[kind] - 1) > 0.01)
        errors.push(
          `project "${p.id}": ${src} is ${size.width}×${size.height}; a ${kind} capture must be ${RATIO_LABEL[kind]} (±1%)`,
        );
    }
  }

  return { content, errors, warnings };
}

const PUBLIC_DIR = path.join(process.cwd(), "public");
const RATIO_LABEL = { web: "16:10", mobile: "6:13", photo: "4:3" } as const;

/** Pixel size from a PNG or JPEG header; `null` for other formats. */
function imageSize(file: string): { width: number; height: number } | null {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47)
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      // SOF0–SOF15 carry the frame size (C4/C8/CC are not frames)
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        ![0xc4, 0xc8, 0xcc].includes(marker)
      )
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}
