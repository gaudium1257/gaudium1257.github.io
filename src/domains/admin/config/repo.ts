/**
 * 콘텐츠가 저장되는 리포지터리 좌표 (ADR-0003).
 * 이 값들은 비밀이 아니다 — 공개 리포지터리의 공개 정보다. 토큰만이 비밀이다 (INV-8).
 */
export const REPO_OWNER = 'gaudium1257';
export const REPO_NAME = 'gaudium1257.github.io';
export const REPO_BRANCH = 'main';

/** 콘텐츠 종류별 저장 경로. 스키마 레지스트리와 짝을 이룬다. */
export const CONTENT_PATHS = {
  profile: () => 'content/profile.json',
  project: (id: string) => `content/projects/${id}.json`,
  post: (id: string) => `content/posts/${id}.json`,
} as const;

/** 게시 후 공개 반영까지 걸리는 대략의 시간. 화면 안내에 쓴다 (DESIGN.md). */
export const DEPLOY_DELAY_HINT = '약 1분 뒤 공개 사이트에 반영됩니다.';
