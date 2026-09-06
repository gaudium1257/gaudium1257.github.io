import { z } from 'zod';

/**
 * 콘텐츠 스키마 — 이 파일이 유일한 진실 원천이다 (INV-9).
 * viewer(읽기)와 admin(쓰기)이 모두 이 스키마를 통과한다.
 * 앱 안에서 콘텐츠 타입을 다시 정의하지 마라 — 두 앱의 진실이 갈라진다 (CB-10).
 *
 * 스펙: docs/product-specs/content-model.md
 * 주의: 공개 여부는 화면에서만 숨긴다. content/ 파일은 공개 저장소에 그대로 있다
 *       (docs/SECURITY.md).
 */

/** URL·정렬에 쓰이는 안정적 식별자. 한 번 정하면 바꾸지 않는다. */
export const idSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9-]*$/, 'id 는 소문자·숫자·하이픈만 사용한다');

/** ISO 8601 날짜. 표시 형식은 ui 레이어가 정한다. */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식이어야 한다');

export const visibilitySchema = z.enum(['public', 'private']);

/** javascript: 스킴을 막는다 (docs/SECURITY.md) */
export const linkSchema = z.object({
  label: z.string().min(1),
  url: z
    .string()
    .url()
    .refine((u) => /^https?:/i.test(u), 'http(s) URL 만 허용한다'),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  intro: z.string().default(''),
  links: z.array(linkSchema).default([]),
});

/** About 페이지의 스펙 항목. 분류는 스펙에서 확정됐다. */
export const specCategorySchema = z.enum(['education', 'experience', 'skill', 'award']);

export const specItemSchema = z.object({
  id: idSchema,
  category: specCategorySchema,
  title: z.string().min(1),
  organization: z.string().default(''),
  startedOn: isoDateSchema.nullable().default(null),
  endedOn: isoDateSchema.nullable().default(null),
  description: z.string().default(''),
  order: z.number().int().default(0),
  visibility: visibilitySchema.default('public'),
});

export const paperReviewSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  authors: z.array(z.string()).default([]),
  year: z.number().int().min(1900).max(2100).nullable().default(null),
  venue: z.string().default(''),
  paperUrl: linkSchema.shape.url.nullable().default(null),
  readOn: isoDateSchema,
  summary: z.string().default(''),
  /** 본인의 정리·평가. 이 필드가 이 페이지의 존재 이유다. */
  notes: z.string().default(''),
  tags: z.array(z.string()).default([]),
  visibility: visibilitySchema.default('public'),
});

export const projectSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  role: z.string().default(''),
  startedOn: isoDateSchema,
  endedOn: isoDateSchema.nullable().default(null),
  summary: z.string().default(''),
  body: z.string().default(''),
  stack: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
  outcome: z.string().default(''),
  order: z.number().int().default(0),
  visibility: visibilitySchema.default('public'),
});

export const blogPostSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  publishedOn: isoDateSchema,
  summary: z.string().default(''),
  body: z.string().default(''),
  tags: z.array(z.string()).default([]),
  visibility: visibilitySchema.default('public'),
});

export type Link = z.infer<typeof linkSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type SpecCategory = z.infer<typeof specCategorySchema>;
export type SpecItem = z.infer<typeof specItemSchema>;
export type PaperReview = z.infer<typeof paperReviewSchema>;
export type Project = z.infer<typeof projectSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type Visibility = z.infer<typeof visibilitySchema>;

/** 콘텐츠 종류별 레지스트리. admin 의 쓰기 경로가 이걸로 검증한다. */
export const contentSchemas = {
  profile: profileSchema,
  spec: specItemSchema,
  paper: paperReviewSchema,
  project: projectSchema,
  post: blogPostSchema,
} as const;

export type ContentKind = keyof typeof contentSchemas;

/** 종류별 저장 경로. viewer 의 로더와 admin 의 쓰기가 같은 규칙을 쓴다. */
export const CONTENT_DIRS = {
  profile: 'content',
  spec: 'content/specs',
  paper: 'content/papers',
  project: 'content/projects',
  post: 'content/posts',
} as const;
