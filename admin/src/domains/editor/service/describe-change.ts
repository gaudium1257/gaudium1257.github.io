import type { PortfolioContent } from '@portfolio/portfolio';
import type { PendingChange } from '../data/publish-api';

/**
 * 게시 목록을 사람이 읽는 형태로 바꾼다 — 순수 함수 (INV-1).
 *
 * `M content/papers/attention-is-all-you-need.json` 은 무엇이 바뀌는지 알려주지 않는다.
 * 공개는 되돌리기 비싼 동작이므로, 누르기 전에 **제목으로** 확인할 수 있어야 한다.
 */

export interface ChangeDescription {
  action: '추가' | '수정' | '삭제';
  kindLabel: string;
  title: string;
  /** 같은 제목이 여러 개일 때 구분용. 화면에서는 보조 정보로만 쓴다 */
  id: string;
}

const KIND_LABEL: Record<string, string> = {
  papers: '논문 리뷰',
  projects: '프로젝트',
  posts: '글',
  specs: '스펙',
};

/** git 상태 코드 → 사람 말. '??' 는 아직 추적되지 않는 새 파일이다. */
function actionOf(status: string): ChangeDescription['action'] {
  if (status.includes('D')) return '삭제';
  if (status.includes('?') || status.includes('A')) return '추가';
  return '수정';
}

/** content/<폴더>/<id>.json 에서 종류와 id 를 뽑는다 */
function parsePath(path: string): { segment: string; id: string } {
  const parts = path.split('/');
  const file = parts[parts.length - 1] ?? '';
  return {
    segment: parts.length >= 3 ? (parts[1] ?? '') : '',
    id: file.replace(/\.json$/, ''),
  };
}

/** 로드된 콘텐츠에서 제목을 찾는다. 삭제된 항목은 파일이 없으므로 id 로 대체한다. */
function findTitle(segment: string, id: string, content: PortfolioContent): string | null {
  const pools: Record<string, ReadonlyArray<{ id: string; title: string }>> = {
    papers: content.papers,
    projects: content.projects,
    posts: content.posts,
    specs: content.specs,
  };
  return pools[segment]?.find((item) => item.id === id)?.title ?? null;
}

export function describeChange(
  change: PendingChange,
  content: PortfolioContent,
): ChangeDescription {
  const action = actionOf(change.status);

  if (change.path.endsWith('profile.json')) {
    return { action, kindLabel: '프로필', title: content.profile.name || '프로필', id: 'profile' };
  }

  const { segment, id } = parsePath(change.path);
  return {
    action,
    kindLabel: KIND_LABEL[segment] ?? '콘텐츠',
    // 삭제된 항목은 파일이 없어 content 에도 없다 — 서버가 git 에서 꺼내 준 제목을 쓴다
    title: findTitle(segment, id, content) ?? change.deletedTitle ?? id,
    id,
  };
}

export function describeChanges(
  changes: PendingChange[],
  content: PortfolioContent,
): ChangeDescription[] {
  return changes.map((change) => describeChange(change, content));
}
