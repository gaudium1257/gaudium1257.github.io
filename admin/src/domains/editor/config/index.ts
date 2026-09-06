import type { ContentKind } from '@portfolio/content';

/** 편집 대상 종류와 화면 이름 (스펙 E-1) */
export const EDITABLE_KINDS: ReadonlyArray<{ kind: ContentKind; label: string }> = [
  { kind: 'profile', label: '프로필' },
  { kind: 'spec', label: '스펙 (About)' },
  { kind: 'paper', label: '논문 리뷰' },
  { kind: 'project', label: '프로젝트' },
  { kind: 'post', label: '블로그 글' },
];

/** 개발 서버 미들웨어의 엔드포인트 (ADR-0003) */
export const CONTENT_API = '/api/content';
