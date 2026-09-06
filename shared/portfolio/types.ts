import type {
  BlogPost,
  ContentKind,
  PaperReview,
  Profile,
  Project,
  SpecItem,
} from '@portfolio/content';
import type { SearchEntry } from './service/search';

/**
 * 두 앱이 공유하는 표시 계약 (ADR-0005).
 *
 * 페이지는 콘텐츠를 **props 로 받는다.** 훅을 직접 부르지 않으므로
 * 출처(viewer=빌드타임 glob, admin=개발서버 API)가 달라도 같은 컴포넌트를 쓴다.
 */
export interface PortfolioContent {
  profile: Profile;
  specs: SpecItem[];
  papers: PaperReview[];
  projects: Project[];
  posts: BlogPost[];
  searchIndex: SearchEntry[];
}

/**
 * 편집 슬롯. **viewer 는 넘기지 않는다** — 넘기지 않으면 편집 UI 가 렌더되지 않고,
 * 공개 번들에 편집 코드가 들어가지 않는다 (INV-8).
 */
export interface EditingSlots {
  /** 섹션 제목 옆의 '추가' 버튼 */
  renderAddAction?: (kind: ContentKind) => React.ReactNode;
  /** 개별 항목 옆의 '수정' 버튼 */
  renderItemAction?: (kind: ContentKind, id: string) => React.ReactNode;
}

/** 편집 슬롯이 없으면 아무것도 렌더하지 않는다 — viewer 의 기본 상태 */
export const NO_EDITING: EditingSlots = {};
