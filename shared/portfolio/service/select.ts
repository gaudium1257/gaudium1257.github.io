import type { BlogPost, PaperReview, Project, SpecItem, Visibility } from '@portfolio/content';

/**
 * 표시 규칙 — 순수 함수. I/O 도 React 도 없다 (INV-1).
 *
 * 공개 여부는 화면에서만 숨긴다. 파일은 공개 저장소에 그대로 있다 (docs/SECURITY.md).
 *
 * `includePrivate` 는 **admin 전용**이다 — 편집자는 숨긴 항목도 봐야 고칠 수 있다.
 * viewer 는 이 옵션을 넘기지 않으므로 비공개 항목이 새어 나가지 않는다 (INV-8).
 */

export interface SelectOptions {
  includePrivate?: boolean;
}

interface HasVisibility {
  visibility: Visibility;
}

function keep<T extends HasVisibility>(items: T[], options: SelectOptions): T[] {
  return options.includePrivate ? items : items.filter((item) => item.visibility === 'public');
}

export function visibleSpecs(specs: SpecItem[], options: SelectOptions = {}): SpecItem[] {
  return keep(specs, options).sort(
    (a, b) => a.order - b.order || (b.startedOn ?? '').localeCompare(a.startedOn ?? ''),
  );
}

/** 읽은 날짜 최신 순 (스펙 R-4) */
export function visiblePapers(papers: PaperReview[], options: SelectOptions = {}): PaperReview[] {
  return keep(papers, options).sort((a, b) => b.readOn.localeCompare(a.readOn));
}

export function visibleProjects(projects: Project[], options: SelectOptions = {}): Project[] {
  return keep(projects, options).sort(
    (a, b) => a.order - b.order || b.startedOn.localeCompare(a.startedOn),
  );
}

/** 작성일 최신 순 (스펙 B-1) */
export function visiblePosts(posts: BlogPost[], options: SelectOptions = {}): BlogPost[] {
  return keep(posts, options).sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
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

/**
 * 자기소개의 **첫 문단만** 잘라낸다 (EP-0008).
 *
 * 홈은 30초 안에 훑는 화면이다(H-1). 전문을 넣으면 그 전제가 깨지고,
 * About 이 따로 있을 이유도 사라진다.
 *
 * 마크다운 기호는 떼어낸다 — 미리보기는 한 문단짜리 평문이라
 * `##` 나 `-` 가 그대로 보이면 깨진 글로 읽힌다.
 */
export function introPreview(intro: string, maxChars = 160): string {
  const firstBlock = intro.trim().split(/\n\s*\n/)[0] ?? '';

  const plain = firstBlock
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*>]\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= maxChars) return plain;
  // 단어 중간에서 끊지 않는다
  const cut = plain.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > maxChars * 0.6 ? cut.slice(0, lastSpace) : cut}…`;
}
