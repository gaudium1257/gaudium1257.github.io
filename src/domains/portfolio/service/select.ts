import type { Post, Project } from '@/shared/content';

/**
 * 표시 규칙 — 순수 함수. I/O 도 React 도 없다 (INV-1).
 * visibility 는 화면에서 숨길 뿐 파일은 공개다 (docs/SECURITY.md §6).
 */

export function visibleProjects(projects: Project[]): Project[] {
  return projects
    .filter((p) => p.visibility === 'public')
    .sort((a, b) => a.order - b.order || b.startedOn.localeCompare(a.startedOn));
}

export function visiblePosts(posts: Post[]): Post[] {
  return posts
    .filter((p) => p.visibility === 'public')
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export function findProject(projects: Project[], id: string): Project | null {
  return projects.find((p) => p.id === id) ?? null;
}

export function findPost(posts: Post[], id: string): Post | null {
  return posts.find((p) => p.id === id) ?? null;
}

/** 기간 표시. 종료일이 없으면 진행 중으로 본다. */
export function formatPeriod(startedOn: string, endedOn: string | null): string {
  const start = startedOn.slice(0, 7).replace('-', '.');
  if (!endedOn) return `${start} — 진행 중`;
  return `${start} — ${endedOn.slice(0, 7).replace('-', '.')}`;
}

export function formatDate(iso: string): string {
  return iso.replace(/-/g, '.');
}
