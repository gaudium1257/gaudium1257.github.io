import type { SpecCategory } from '@portfolio/content';

/** About 페이지의 분류 표시 순서와 이름 (스펙 A-2) */
export const SPEC_SECTIONS: ReadonlyArray<{ category: SpecCategory; label: string }> = [
  { category: 'education', label: '학력' },
  { category: 'experience', label: '경력 · 활동' },
  { category: 'skill', label: '기술' },
  { category: 'award', label: '수상 · 자격' },
];

/** Home 에서 각 섹션을 몇 개씩 보여줄지 (스펙 H-3~H-5) */
export const HOME_PREVIEW_COUNT = 3;
