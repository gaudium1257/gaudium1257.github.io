/**
 * 편집 도메인 타입. 콘텐츠 스키마는 shared/content 가 단일 진실 원천이다 (INV-9).
 * 이 레이어는 내부 모듈을 import 하지 않는다 (INV-1).
 */
export type { ContentKind } from '@portfolio/content';

/** 목록에 보여줄 최소 정보 */
export interface ContentEntry {
  id: string;
  title: string;
}
