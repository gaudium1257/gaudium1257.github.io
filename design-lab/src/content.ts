import {
  blogPostSchema,
  paperReviewSchema,
  profileSchema,
  projectSchema,
  specItemSchema,
} from '@portfolio/content';
import type { BlogPost, PaperReview, Profile, Project, SpecItem } from '@portfolio/content';

/**
 * 콘텐츠 로딩 경계 (INV-3). viewer 와 같은 방식으로 빌드 타임에 읽는다.
 *
 * **실제 콘텐츠로 그린다.** 더미 텍스트는 한글 제목이 길어질 때 무너지는 레이아웃을
 * 숨겨버려서, 시안을 고르는 판단을 틀리게 만든다.
 */

const glob = <T>(
  modules: Record<string, unknown>,
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T } },
): T[] => {
  const items: T[] = [];
  for (const raw of Object.values(modules)) {
    const parsed = schema.safeParse(raw);
    if (parsed.success && parsed.data) items.push(parsed.data);
  }
  return items;
};

const profileModules: Record<string, unknown> = import.meta.glob('@content/profile.json', {
  eager: true,
  import: 'default',
});

export interface LabContent {
  profile: Profile;
  specs: SpecItem[];
  papers: PaperReview[];
  projects: Project[];
  posts: BlogPost[];
}

/** 콘텐츠가 비어 있어도 비교소는 떠야 한다 — 빈 상태의 시안도 봐야 하기 때문이다 */
const FALLBACK_PROFILE: Profile = {
  name: '김태호',
  headline: '문제를 정의하고 끝까지 만들어 내는 개발자',
  intro: '',
  links: [],
};

export function loadContent(): LabContent {
  const rawProfile = profileModules[Object.keys(profileModules)[0] ?? ''];
  const parsed = profileSchema.safeParse(rawProfile);

  return {
    profile: parsed.success ? parsed.data : FALLBACK_PROFILE,
    specs: glob(
      import.meta.glob('@content/specs/*.json', { eager: true, import: 'default' }),
      specItemSchema,
    ),
    papers: glob(
      import.meta.glob('@content/papers/*.json', { eager: true, import: 'default' }),
      paperReviewSchema,
    ),
    projects: glob(
      import.meta.glob('@content/projects/*.json', { eager: true, import: 'default' }),
      projectSchema,
    ),
    posts: glob(
      import.meta.glob('@content/posts/*.json', { eager: true, import: 'default' }),
      blogPostSchema,
    ),
  };
}
