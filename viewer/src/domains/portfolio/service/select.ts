import type { BlogPost, PaperReview, Project, SpecItem, Visibility } from '@portfolio/content';

/**
 * 표시 규칙 — 순수 함수. I/O 도 React 도 없다 (INV-1).
 * 공개 여부는 화면에서만 숨긴다. 파일은 공개 저장소에 그대로 있다 (docs/SECURITY.md).
 */

interface HasVisibility {
  visibility: Visibility;
}

const isPublic = <T extends HasVisibility>(item: T): boolean => item.visibility === 'public';

export function visibleSpecs(specs: SpecItem[]): SpecItem[] {
  return specs
    .filter(isPublic)
    .sort((a, b) => a.order - b.order || (b.startedOn ?? '').localeCompare(a.startedOn ?? ''));
}

/** 읽은 날짜 최신 순 (스펙 R-4) */
export function visiblePapers(papers: PaperReview[]): PaperReview[] {
  return papers.filter(isPublic).sort((a, b) => b.readOn.localeCompare(a.readOn));
}

export function visibleProjects(projects: Project[]): Project[] {
  return projects
    .filter(isPublic)
    .sort((a, b) => a.order - b.order || b.startedOn.localeCompare(a.startedOn));
}

/** 작성일 최신 순 (스펙 B-1) */
export function visiblePosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(isPublic).sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export function findById<T extends { id: string }>(items: T[], id: string): T | null {
  return items.find((item) => item.id === id) ?? null;
}

/** Home 의 미리보기 (스펙 H-3~H-5) */
export function preview<T>(items: T[], count: number): T[] {
  return items.slice(0, count);
}

/** 기간 표시. 종료일이 없으면 진행 중으로 본다. */
export function formatPeriod(startedOn: string | null, endedOn: string | null): string {
  if (!startedOn) return '';
  const start = startedOn.slice(0, 7).replace('-', '.');
  if (!endedOn) return `${start} — 진행 중`;
  return `${start} — ${endedOn.slice(0, 7).replace('-', '.')}`;
}

export function formatDate(iso: string): string {
  return iso.replace(/-/g, '.');
}
