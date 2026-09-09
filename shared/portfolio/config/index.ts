import type { SpecCategory } from '@portfolio/content';

/** About 페이지의 분류 표시 순서와 이름 (스펙 A-2) */
export const SPEC_SECTIONS: ReadonlyArray<{ category: SpecCategory; label: string }> = [
  { category: 'education', label: '학력 / 학적' },
  { category: 'experience', label: '경력 · 활동' },
  { category: 'skill', label: '기술' },
  { category: 'award', label: '수상' },
  { category: 'certificate', label: '자격증' },
];

/** Home 에서 각 섹션을 몇 개씩 보여줄지 (스펙 H-3~H-5) */
export const HOME_PREVIEW_COUNT = 3;

/**
 * 섹션 이름의 **유일한 출처.** 배너 탭도, 페이지 제목도 여기서 읽는다.
 *
 * 두 곳에 따로 적어두면 배너는 '논문 리뷰' 인데 페이지 제목은 'Paper Review' 로
 * 갈라진다. 언어 전환을 나중에 넣기로 했으니(2026-09-08) 더더욱 한 곳이어야 한다 —
 * 그때 `ko`/`en` 중 무엇을 고를지만 바꾸면 된다.
 */
export const SECTION_LABELS = {
  home: { ko: '홈', en: 'Home' },
  about: { ko: '소개', en: 'About' },
  papers: { ko: '논문 리뷰', en: 'Paper Review' },
  projects: { ko: '프로젝트', en: 'Project' },
  blog: { ko: '블로그', en: 'Blog' },
} as const;

export type SectionKey = keyof typeof SECTION_LABELS;

/** 지금은 한국어만 쓴다. 언어 전환이 들어오면 이 함수만 바뀐다. */
export function sectionLabel(key: SectionKey): string {
  return SECTION_LABELS[key].ko;
}
