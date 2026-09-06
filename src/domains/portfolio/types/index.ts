/**
 * 포트폴리오 도메인 타입. 스키마는 공유 콘텐츠 모듈이 단일 진실 원천이다.
 * 이 레이어는 내부 모듈을 import 하지 않는다 (INV-1).
 */
export type { Profile, Project, Post, Link, Visibility } from '@/shared/content';
