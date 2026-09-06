/** 공유 표시 레이어의 공개 표면 (ADR-0005). */
export { PortfolioApp } from './shell/PortfolioApp';
export { useSearch } from './shell/use-search';
export { useTheme, ThemeProvider } from './shell/theme';
export { SHELL, PROSE_WIDTH } from './shell/layout';
export { SITE_NAME, NAV_ITEMS } from './shell/site';
export { HOME_PREVIEW_COUNT, SPEC_SECTIONS } from './config';

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
