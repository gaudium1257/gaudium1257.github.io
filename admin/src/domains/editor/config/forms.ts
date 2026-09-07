import type { ContentKind } from '@portfolio/content';

/**
 * 폼 필드 명세 — **UI 메타데이터다. 스키마가 아니다** (INV-9).
 * 검증은 언제나 `shared/content` 의 Zod 스키마가 한다.
 *
 * 여기는 "어떤 입력으로 보여줄지"만 정한다. 순서가 곧 화면 순서다.
 *
 * ⚠️ 스키마에 필드를 추가하고 여기에 빠뜨리면 **편집할 수 없는 필드**가 생긴다.
 * forms.test.ts 가 두 목록이 어긋나면 실패시킨다.
 */

/** 폼 값이 가질 수 있는 형태. 편집 중에는 자유롭게 오가고, 최종 판단은 스키마가 한다 (INV-3). */
export type FieldValue = string | number | null | string[] | Array<{ label: string; url: string }>;

export type FieldKind =
  'text' | 'markdown' | 'date' | 'number' | 'select' | 'stringList' | 'linkList';

export interface FieldSpec {
  name: string;
  label: string;
  kind: FieldKind;
  /** 비워둘 수 있는가 (필수 여부는 스키마가 최종 판단한다) */
  optional?: boolean;
  /** null 을 허용하는 필드 — 비우면 null 로 보낸다 */
  nullable?: boolean;
  placeholder?: string;
  help?: string;
  options?: ReadonlyArray<{ value: string; label: string }>;
}

const VISIBILITY: FieldSpec = {
  name: 'visibility',
  label: '공개 여부',
  kind: 'select',
  options: [
    { value: 'public', label: '공개' },
    { value: 'private', label: '숨김' },
  ],
  help: '숨김은 화면에서만 감춥니다. 파일은 공개 저장소에 그대로 있습니다.',
};

const ORDER: FieldSpec = {
  name: 'order',
  label: '정렬 순서',
  kind: 'number',
  help: '작을수록 먼저 나옵니다.',
};

const ID: FieldSpec = {
  name: 'id',
  label: 'id',
  kind: 'text',
  placeholder: 'my-first-paper',
  help: '소문자·숫자·하이픈만. URL 이 되므로 한 번 정하면 바꾸지 마세요.',
};

export const FORM_FIELDS: Record<ContentKind, readonly FieldSpec[]> = {
  profile: [
    { name: 'name', label: '이름', kind: 'text' },
    { name: 'headline', label: '한 줄 소개', kind: 'text', placeholder: '무엇을 하는 사람인가' },
    { name: 'intro', label: '소개', kind: 'markdown', optional: true },
    { name: 'links', label: '링크', kind: 'linkList', optional: true },
  ],
  spec: [
    ID,
    {
      name: 'category',
      label: '분류',
      kind: 'select',
      options: [
        { value: 'education', label: '학력 / 학적' },
        { value: 'experience', label: '경력 · 활동' },
        { value: 'skill', label: '기술' },
        { value: 'award', label: '수상' },
        { value: 'certificate', label: '자격증' },
      ],
    },
    { name: 'title', label: '제목', kind: 'text' },
    { name: 'organization', label: '기관', kind: 'text', optional: true },
    { name: 'startedOn', label: '시작일', kind: 'date', optional: true, nullable: true },
    {
      name: 'endedOn',
      label: '종료일',
      kind: 'date',
      optional: true,
      nullable: true,
      help: '비우면 진행 중으로 표시됩니다.',
    },
    { name: 'description', label: '설명', kind: 'text', optional: true },
    ORDER,
    VISIBILITY,
  ],
  paper: [
    ID,
    { name: 'title', label: '논문 제목', kind: 'text' },
    { name: 'authors', label: '저자', kind: 'stringList', optional: true },
    { name: 'year', label: '발표 연도', kind: 'number', optional: true, nullable: true },
    { name: 'venue', label: '학회 · 저널', kind: 'text', optional: true },
    {
      name: 'paperUrl',
      label: '원문 링크',
      kind: 'text',
      optional: true,
      nullable: true,
      placeholder: 'https://arxiv.org/abs/...',
    },
    { name: 'readOn', label: '읽은 날짜', kind: 'date' },
    { name: 'summary', label: '요약', kind: 'markdown', optional: true },
    {
      name: 'notes',
      label: '내 정리',
      kind: 'markdown',
      optional: true,
      help: '이 페이지의 존재 이유입니다. 마크다운을 쓸 수 있습니다.',
    },
    { name: 'tags', label: '태그', kind: 'stringList', optional: true },
    VISIBILITY,
  ],
  project: [
    ID,
    { name: 'title', label: '제목', kind: 'text' },
    {
      name: 'role',
      label: '역할',
      kind: 'text',
      optional: true,
      placeholder: '기획 · 설계 · 개발',
    },
    { name: 'startedOn', label: '시작일', kind: 'date' },
    {
      name: 'endedOn',
      label: '종료일',
      kind: 'date',
      optional: true,
      nullable: true,
      help: '비우면 진행 중으로 표시됩니다.',
    },
    { name: 'summary', label: '한 줄 요약', kind: 'text', optional: true },
    {
      name: 'body',
      label: '본문',
      kind: 'markdown',
      optional: true,
      help: '문제 → 접근 → 결과 순서로 쓰면 읽기 좋습니다.',
    },
    { name: 'stack', label: '기술 스택', kind: 'stringList', optional: true },
    { name: 'links', label: '링크', kind: 'linkList', optional: true },
    { name: 'outcome', label: '결과', kind: 'text', optional: true },
    ORDER,
    VISIBILITY,
  ],
  post: [
    ID,
    { name: 'title', label: '제목', kind: 'text' },
    { name: 'publishedOn', label: '작성일', kind: 'date' },
    { name: 'summary', label: '요약', kind: 'text', optional: true },
    { name: 'body', label: '본문', kind: 'markdown', optional: true },
    { name: 'tags', label: '태그', kind: 'stringList', optional: true },
    VISIBILITY,
  ],
};
