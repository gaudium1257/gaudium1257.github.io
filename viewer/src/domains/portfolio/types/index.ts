/**
 * 포트폴리오 도메인 타입.
 * 스키마는 shared/content 가 단일 진실 원천이다 (INV-9). 여기서 다시 정의하지 않는다.
 * 이 레이어는 내부 모듈을 import 하지 않는다 (INV-1).
 */
export type {
  Profile,
  SpecItem,
  SpecCategory,
  PaperReview,
  Project,
  BlogPost,
  Link,
  Visibility,
} from '@portfolio/content';
