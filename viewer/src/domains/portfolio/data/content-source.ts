import {
  blogPostSchema,
  paperReviewSchema,
  profileSchema,
  projectSchema,
  specItemSchema,
} from '@portfolio/content';
import type { BlogPost, PaperReview, Profile, Project, SpecItem } from '@portfolio/content';

/**
 * 콘텐츠 로딩 경계 — content/ 의 JSON 을 빌드 타임에 가져와 스키마로 파싱한다 (INV-3, ADR-0003).
 * 런타임 네트워크 요청이 없다. 파싱을 통과하지 못한 값은 도메인 안으로 들어오지 못한다.
 */

const profileModules: Record<string, unknown> = import.meta.glob('@content/profile.json', {
  eager: true,
  import: 'default',
});
const specModules: Record<string, unknown> = import.meta.glob('@content/specs/*.json', {
  eager: true,
  import: 'default',
});
const paperModules: Record<string, unknown> = import.meta.glob('@content/papers/*.json', {
  eager: true,
  import: 'default',
});
const projectModules: Record<string, unknown> = import.meta.glob('@content/projects/*.json', {
  eager: true,
  import: 'default',
});
const postModules: Record<string, unknown> = import.meta.glob('@content/posts/*.json', {
  eager: true,
  import: 'default',
});

interface ParserLike<T> {
  safeParse: (value: unknown) => { success: boolean; data?: T; error?: unknown };
}

/** 파싱 실패를 삼키지 않는다. 어떤 파일이 왜 틀렸는지 말해준다 (GR-4). */
function parseAll<T>(modules: Record<string, unknown>, schema: ParserLike<T>, kind: string): T[] {
  const items: T[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    const result = schema.safeParse(raw);
    if (!result.success || !result.data) {
      throw new Error(`${kind} 파싱 실패: ${path} — ${JSON.stringify(result.error)}`);
    }
    items.push(result.data);
  }
  return items;
}

export function loadProfile(): Profile {
  const raw = profileModules[Object.keys(profileModules)[0] ?? ''];
  const result = profileSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`profile 파싱 실패: ${JSON.stringify(result.error.issues)}`);
  }
  return result.data;
}

export const loadSpecs = (): SpecItem[] => parseAll(specModules, specItemSchema, 'spec');
export const loadPapers = (): PaperReview[] => parseAll(paperModules, paperReviewSchema, 'paper');
export const loadProjects = (): Project[] => parseAll(projectModules, projectSchema, 'project');
export const loadPosts = (): BlogPost[] => parseAll(postModules, blogPostSchema, 'post');
