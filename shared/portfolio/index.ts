/** 공유 표시 레이어의 공개 표면 (ADR-0005). */
export { PortfolioApp } from './shell/PortfolioApp';
export { useSearch } from './shell/use-search';
export { useTheme, ThemeProvider } from './shell/theme';
export { SITE_NAME, NAV_ITEMS } from './shell/site';
export { HOME_PREVIEW_COUNT, SPEC_SECTIONS } from './config';

/**
 * admin 의 미리보기가 이걸 그대로 쓴다 (EP-0007).
 * 미리보기 전용 렌더를 따로 만들면 공개 사이트와 갈라진다.
 */
export { Markdown } from './ui/Markdown';

export {
  visiblePapers,
  visiblePosts,
  visibleProjects,
  visibleSpecs,
  findById,
  preview,
  formatDate,
  formatPeriod,
} from './service/select';
export { buildIndex, search, kindLabel } from './service/search';
export type { SearchEntry, SearchKind } from './service/search';

export type { PortfolioContent, EditingSlots } from './types';
