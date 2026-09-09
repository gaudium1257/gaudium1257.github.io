import { sectionLabel, type SectionKey } from '../config';

/**
 * 사이트 설정. 이름은 여기 한 줄만 바꾸면 된다 (스펙: navigation-shell.md).
 */
export const SITE_NAME = '김태호';

/**
 * 상단 배너의 섹션 탭. 순서가 화면 순서다.
 *
 * `path` 는 **공개 URL 이라 바꾸지 않는다** — 이미 나간 링크가 깨지고,
 * 프리렌더 경로도 여기서 나온다. 화면에 보이는 이름은 config 의 SECTION_LABELS 에서 온다.
 */
const NAV_PATHS: ReadonlyArray<{ path: string; key: SectionKey }> = [
  { path: '/', key: 'home' },
  { path: '/about', key: 'about' },
  { path: '/papers', key: 'papers' },
  { path: '/projects', key: 'projects' },
  { path: '/blog', key: 'blog' },
];

export const NAV_ITEMS = NAV_PATHS.map(({ path, key }) => ({
  path,
  key,
  label: sectionLabel(key),
}));
