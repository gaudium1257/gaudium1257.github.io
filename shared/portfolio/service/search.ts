import type { BlogPost, PaperReview, Project, SpecItem } from '@portfolio/content';

/**
 * 검색 인덱스와 조회 (ADR-0004, 스펙 S-2·S-5).
 * 인덱스는 콘텐츠에서 파생된다 — 따로 관리하지 않는다.
 */

export type SearchKind = 'paper' | 'project' | 'post' | 'spec';

export interface SearchEntry {
  kind: SearchKind;
  id: string;
  title: string;
  summary: string;
  /** 소문자로 정규화한 검색 대상 문자열 */
  haystack: string;
  path: string;
}

/** 화면에 보이는 이름과 같아야 한다 — 검색 결과만 영어면 다른 사이트처럼 읽힌다 */
const KIND_LABEL: Record<SearchKind, string> = {
  paper: '논문 리뷰',
  project: '프로젝트',
  post: '블로그',
  spec: '소개',
};

export const kindLabel = (kind: SearchKind): string => KIND_LABEL[kind];

function entry(
  kind: SearchKind,
  id: string,
  title: string,
  summary: string,
  extra: string[],
  path: string,
): SearchEntry {
  return {
    kind,
    id,
    title,
    summary,
    haystack: [title, summary, ...extra].filter(Boolean).join(' ').toLowerCase(),
    path,
  };
}

/**
 * 스펙은 제 주소가 없다 — About 안의 한 줄이다.
 * 그래서 **항목 앵커**로 보낸다. 섹션 맨 위에 떨구면 사용자가 다시 훑어야 한다 (EP-0010).
 */
export const specAnchorId = (id: string): string => `spec-${id}`;

export function buildIndex(input: {
  papers: PaperReview[];
  projects: Project[];
  posts: BlogPost[];
  specs?: SpecItem[];
}): SearchEntry[] {
  return [
    ...input.papers.map((p) =>
      entry(
        'paper',
        p.id,
        p.title,
        p.summary,
        [...p.authors, ...p.tags, p.venue, p.notes],
        `/papers/${p.id}`,
      ),
    ),
    ...input.projects.map((p) =>
      entry('project', p.id, p.title, p.summary, [...p.stack, p.role, p.body], `/projects/${p.id}`),
    ),
    ...input.posts.map((p) =>
      entry('post', p.id, p.title, p.summary, [...p.tags, p.body], `/blog/${p.id}`),
    ),
    ...(input.specs ?? []).map((s) =>
      entry(
        'spec',
        s.id,
        s.title,
        s.organization,
        [s.description, s.category],
        `/about#${specAnchorId(s.id)}`,
      ),
    ),
  ];
}

/** 공백으로 나눈 모든 조각을 포함해야 결과다. 빈 질의는 결과 없음. */
export function search(index: SearchEntry[], query: string, limit = 20): SearchEntry[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return index.filter((e) => terms.every((t) => e.haystack.includes(t))).slice(0, limit);
}
