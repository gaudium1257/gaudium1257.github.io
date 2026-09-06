/**
 * 공통 레이아웃 폭. 헤더와 본문이 같은 폭을 써야 세로선이 맞는다.
 *
 * max-w-4xl(896px) 은 넓은 화면에서 좌우 여백이 과해 본문이 떠 보였다.
 * 6xl(1152px) 로 넓히되, 긴 글은 PROSE_WIDTH 로 따로 좁혀 가독성을 지킨다.
 */
export const SHELL = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

/** 읽는 글의 최대 폭. 한 줄이 너무 길면 눈이 다음 줄을 놓친다. */
export const PROSE_WIDTH = 'max-w-3xl';
