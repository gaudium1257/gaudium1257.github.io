/**
 * 사이트 설정. 이름은 여기 한 줄만 바꾸면 된다 (스펙: navigation-shell.md).
 */
export const SITE_NAME = '김태호';

/** 상단 배너의 섹션 탭. 순서가 화면 순서다. */
export const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/papers', label: 'Paper Review' },
  { path: '/projects', label: 'Project' },
  { path: '/blog', label: 'Blog' },
] as const;
