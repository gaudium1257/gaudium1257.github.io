/**
 * Single source of truth for every piece of portfolio content.
 *
 * - Every user-facing string is `Localized` (ko + en, both required).
 * - Content lives as JSON under `content/` and is parsed with these schemas at
 *   build time (`src/content/load.ts`) and by `npm run validate:content`.
 * - If you change a schema, also update the JSON template in
 *   `docs/prompts/project-fact-sheet.md` (the validator checks that template).
 */
import { z } from "zod";

export const LOCALES = ["ko", "en"] as const;

export const Localized = z.object({
  ko: z.string().trim().min(1),
  en: z.string().trim().min(1),
});
export type Localized = z.infer<typeof Localized>;

/** kebab-case id, also used as the file name and URL slug. */
export const Id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case id (a-z, 0-9, -)");

/** `YYYY-MM` or `YYYY-MM-DD`. */
export const DateString = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/,
    "YYYY-MM or YYYY-MM-DD",
  );

export const Period = z.object({
  start: DateString,
  /** `null` = ongoing. */
  end: DateString.nullable(),
});

export const LinkType = z.enum([
  "github",
  "demo",
  "docs",
  "video",
  "slides",
  "article",
  "store",
  "certificate",
  "other",
]);

export const Link = z.object({
  type: LinkType,
  url: z.url(),
  /** Optional; the UI falls back to a label derived from `type`. */
  label: Localized.optional(),
});

/** Ids of other content items (any collection). Resolved both ways by the loader. */
export const Related = z.array(Id).default([]);

/** Path under `public/`, e.g. `/images/projects/foo/cover.png`. */
export const PublicImage = z
  .string()
  .regex(/^\/images\/.+\.(png|jpe?g|webp|gif|svg)$/i);

/**
 * Capture box: web 16:10 · mobile (phone) 6:13 · photo 4:3. Boxes never crop,
 * so the file must already have that ratio (the validator checks ±1%).
 */
export const MediaKind = z.enum(["web", "mobile", "photo"]);
export type MediaKind = z.infer<typeof MediaKind>;

// ---------------------------------------------------------------------------
// Profile (자기소개 + connect)
// ---------------------------------------------------------------------------

export const Profile = z.object({
  name: Localized,
  /** One-line headline, e.g. "AI · 웹 개발자" */
  headline: Localized,
  /** 1–2 sentence intro shown at the top. */
  intro: Localized,
  /** Longer self-introduction, one entry per paragraph. */
  about: z.array(Localized).default([]),
  location: Localized.optional(),
  avatar: PublicImage.optional(),
  connect: z.object({
    github: z.url().optional(),
    email: z.email().optional(),
    instagram: z.url().optional(),
    /** Discord username (e.g. "name") or an invite / profile URL. */
    discord: z.string().trim().min(1).optional(),
  }),
});
export type Profile = z.infer<typeof Profile>;

// ---------------------------------------------------------------------------
// Projects (프로젝트 활동) — produced by docs/prompts/project-fact-sheet.md
// ---------------------------------------------------------------------------

export const ProjectCategory = z.enum([
  "personal",
  "team",
  "hackathon",
  "club",
  "course",
  "research",
  "work",
  "open-source",
]);

export const ProjectStatus = z.enum([
  "in-progress",
  "completed",
  "maintained",
  "archived",
]);

export const DeploymentStatus = z.enum([
  "live",
  "not-deployed",
  "discontinued",
  "unknown",
]);

export const TechCategory = z.enum([
  "language",
  "frontend",
  "backend",
  "mobile",
  "ai-ml",
  "data",
  "database",
  "infra",
  "tooling",
  "other",
]);

export const Project = z.object({
  id: Id,
  title: Localized,
  /** Card one-liner (ko ≤ 40자, en ≤ 80 chars recommended). */
  tagline: Localized,
  /** 2–4 sentences: what it is, who it is for, what problem it solves. */
  summary: Localized,
  category: ProjectCategory,
  status: ProjectStatus,
  period: Period,
  team: z.object({
    /** `1` for solo projects, `null` if unknown. */
    size: z.number().int().positive().nullable(),
    role: Localized,
  }),
  /** What *I* did. Concrete, verifiable, one item per bullet. */
  contributions: z.array(Localized).min(1),
  features: z
    .array(z.object({ title: Localized, description: Localized }))
    .min(1),
  techStack: z
    .array(
      z.object({
        category: TechCategory,
        items: z.array(z.string().trim().min(1)).min(1),
      }),
    )
    .min(1),
  /** Where each tech was used in this project, keyed by its exact `techStack` name. Only with evidence. */
  techNotes: z.record(z.string(), Localized).default({}),
  /** AI coding assistants used (e.g. "Claude Code"). Kept out of techStack and shown on its own line. */
  aiTools: z.array(z.string().trim().min(1)).default([]),
  deployment: z.object({
    status: DeploymentStatus,
    platform: z.string().trim().min(1).optional(),
    url: z.url().optional(),
    /** Date the URL / status was last confirmed. */
    checkedAt: DateString.optional(),
  }),
  /** Results with evidence: awards, users, metrics, shipped releases… */
  outcomes: z.array(Localized).default([]),
  /** Short description of how the system is put together (from the code). */
  architecture: Localized.optional(),
  /** Problems met and how they were solved — only with evidence. */
  challenges: z
    .array(z.object({ problem: Localized, solution: Localized }))
    .default([]),
  /** What I learned — the author's own words, confirmed by them. */
  learnings: z.array(Localized).default([]),
  /** Up to 3 bullets for cards / quick scanning. */
  highlights: z.array(Localized).max(3).default([]),
  links: z.array(Link).default([]),
  related: Related,
  tags: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
  /** Square app icon / logo mark (PNG, WebP or SVG; ≥256px, ideally 512×512), shown beside the title. */
  logo: PublicImage.optional(),
  /**
   * Lead image (16:10) prepared for cards and the detail header — a store graphic or a composite of
   * screens. When set it leads alone; without it the first web/photo screenshot leads.
   */
  thumbnail: PublicImage.optional(),
  /** First `mobile` shot = the phone box beside the lead; the gallery lists them all. */
  screenshots: z
    .array(
      z.object({
        src: PublicImage,
        alt: Localized,
        kind: MediaKind.default("web"),
      }),
    )
    .default([]),
});
export type Project = z.infer<typeof Project>;

// ---------------------------------------------------------------------------
// Activities (활동)
// ---------------------------------------------------------------------------

export const ActivityType = z.enum([
  "program",
  "competition",
  "bootcamp",
  "internship",
  "volunteer",
  "community",
  "conference",
  "other",
]);

export const Activity = z.object({
  id: Id,
  title: Localized,
  organization: Localized,
  type: ActivityType,
  period: Period,
  role: Localized,
  description: Localized,
  highlights: z.array(Localized).default([]),
  links: z.array(Link).default([]),
  related: Related,
});
export type Activity = z.infer<typeof Activity>;

// ---------------------------------------------------------------------------
// Awards (수상경력)
// ---------------------------------------------------------------------------

export const Award = z.object({
  id: Id,
  title: Localized,
  /** e.g. "대상", "1st place" */
  prize: Localized,
  organizer: Localized,
  date: DateString,
  description: Localized.optional(),
  links: z.array(Link).default([]),
  related: Related,
});
export type Award = z.infer<typeof Award>;

// ---------------------------------------------------------------------------
// Skills (개발 역량)
// ---------------------------------------------------------------------------

export const Skills = z.object({
  groups: z
    .array(
      z.object({
        category: TechCategory,
        label: Localized,
        items: z
          .array(
            z.object({
              /** Must match the spelling used in projects' `techStack`. */
              name: z.string().trim().min(1),
              /** Optional context, e.g. what you've done with it. No self-rated levels. */
              note: Localized.optional(),
              /**
               * `false`: a supporting library / SDK / tool (e.g. React Router, Axios). Left out of the
               * home stack, the list filter and the cards; shown on project pages under 라이브러리.
               */
              home: z.boolean().default(true),
            }),
          )
          .min(1),
      }),
    )
    .default([]),
});
export type Skills = z.infer<typeof Skills>;

// ---------------------------------------------------------------------------
// Project order (프로젝트 순서) — the owner's own ranking for the home page and the list
// ---------------------------------------------------------------------------

export const ProjectOrder = z.object({
  /** Project ids, first shown first. Projects not listed follow, newest start first. */
  order: z.array(Id).default([]),
});
export type ProjectOrder = z.infer<typeof ProjectOrder>;

// ---------------------------------------------------------------------------
// Education & career (학력 및 경력사항)
// ---------------------------------------------------------------------------

export const EducationStatus = z.enum([
  "enrolled",
  "graduated",
  "on-leave",
  "completed",
  "dropped",
]);

export const Education = z.object({
  items: z
    .array(
      z.object({
        id: Id,
        school: Localized,
        major: Localized.optional(),
        degree: Localized.optional(),
        /** Leave out when the owner hasn't said. */
        status: EducationStatus.optional(),
        period: Period.optional(),
        details: z.array(Localized).default([]),
      }),
    )
    .default([]),
  /** 경력: positions held, e.g. a club's organizing team. */
  career: z
    .array(
      z.object({
        id: Id,
        organization: Localized,
        role: Localized,
        period: Period.optional(),
        details: z.array(Localized).default([]),
      }),
    )
    .default([]),
});
export type Education = z.infer<typeof Education>;
