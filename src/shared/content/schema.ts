import { z } from 'zod';

/**
 * 콘텐츠 스키마 — 읽기(공개 모드)와 쓰기(관리자 모드)가 모두 통과하는 단일 진실 원천.
 * 스펙: docs/product-specs/content-model.md
 *
 * 주의: visibility 는 화면에서 숨길 뿐이다. content/ 는 공개 리포지터리에 커밋되므로
 * 파일 자체는 누구나 볼 수 있다. 정말 감출 것은 아예 넣지 않는다 (docs/SECURITY.md §6).
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

export const linkSchema = z.object({
  label: z.string().min(1),
  // javascript: 스킴 차단 (docs/SECURITY.md §4)
  url: z.string().url().refine((u) => /^https?:/i.test(u), 'http(s) URL 만 허용한다'),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  affiliation: z.string().default(''),
  summary: z.string().default(''),
  links: z.array(linkSchema).default([]),
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

export const postSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  publishedOn: isoDateSchema,
  category: z.enum(['review', 'retrospective', 'note']).default('note'),
  summary: z.string().default(''),
  body: z.string().default(''),
  projectId: idSchema.nullable().default(null),
  visibility: visibilitySchema.default('public'),
});

export type Link = z.infer<typeof linkSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Post = z.infer<typeof postSchema>;
export type Visibility = z.infer<typeof visibilitySchema>;

/** 콘텐츠 종류별 스키마 레지스트리. 관리자 쓰기 경로가 이걸로 검증한다. */
export const contentSchemas = {
  profile: profileSchema,
  project: projectSchema,
  post: postSchema,
} as const;

export type ContentKind = keyof typeof contentSchemas;
