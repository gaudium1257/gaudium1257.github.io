import { describe, expect, it } from 'vitest';
import {
  imageSnippet,
  insertBlock,
  insertLink,
  toggleLinePrefix,
  toggleOrderedList,
  toggleWrap,
} from './markdown-edit';

/**
 * 서식 버튼은 **한 번 더 누르면 원래대로** 돌아가야 한다.
 * 그게 안 되면 사용자는 실수를 손으로 지워야 하고, 그 순간 도구가 아니라 짐이 된다.
 */

describe('toggleWrap — 굵게·기울임', () => {
  it('선택을 감싼다', () => {
    const r = toggleWrap({ text: '안녕 세상', start: 3, end: 5 }, '**');
    expect(r.text).toBe('안녕 **세상**');
    expect(r.text.slice(r.start, r.end)).toBe('세상');
  });

  it('이미 감싼 것을 다시 누르면 벗긴다 (기호가 선택 밖)', () => {
    const r = toggleWrap({ text: '안녕 **세상**', start: 5, end: 7 }, '**');
    expect(r.text).toBe('안녕 세상');
    expect(r.text.slice(r.start, r.end)).toBe('세상');
  });

  it('기호까지 통째로 선택해도 벗긴다', () => {
    const r = toggleWrap({ text: '**세상**', start: 0, end: 8 }, '**');
    expect(r.text).toBe('세상');
  });

  it('선택이 없으면 커서 자리에 기호만 넣는다', () => {
    const r = toggleWrap({ text: 'ab', start: 1, end: 1 }, '**');
    expect(r.text).toBe('a****b');
    // 커서가 기호 사이에 놓여야 바로 타이핑할 수 있다
    expect(r.start).toBe(3);
    expect(r.end).toBe(3);
  });
});

describe('toggleLinePrefix — 제목·인용·목록', () => {
  it('한 줄에 접두사를 붙인다', () => {
    const r = toggleLinePrefix({ text: '제목', start: 0, end: 2 }, '## ');
    expect(r.text).toBe('## 제목');
  });

  it('선택이 걸친 여러 줄을 모두 처리한다', () => {
    const r = toggleLinePrefix({ text: '하나\n둘\n셋', start: 0, end: 7 }, '- ');
    expect(r.text).toBe('- 하나\n- 둘\n- 셋');
  });

  it('전부 붙어 있으면 뗀다', () => {
    const r = toggleLinePrefix({ text: '- 하나\n- 둘', start: 0, end: 8 }, '- ');
    expect(r.text).toBe('하나\n둘');
  });

  it('선택 없이 커서만 있어도 그 줄을 처리한다', () => {
    const r = toggleLinePrefix({ text: '첫줄\n둘째줄', start: 5, end: 5 }, '> ');
    expect(r.text).toBe('첫줄\n> 둘째줄');
  });
});

describe('toggleOrderedList', () => {
  it('줄마다 번호를 매긴다', () => {
    const r = toggleOrderedList({ text: '하나\n둘\n셋', start: 0, end: 7 });
    expect(r.text).toBe('1. 하나\n2. 둘\n3. 셋');
  });

  it('이미 번호가 있으면 뗀다', () => {
    const r = toggleOrderedList({ text: '1. 하나\n2. 둘', start: 0, end: 10 });
    expect(r.text).toBe('하나\n둘');
  });
});

describe('insertLink', () => {
  it('선택한 글자를 링크 문구로 쓴다', () => {
    const r = insertLink({ text: '깃허브 보기', start: 0, end: 3 });
    expect(r.text).toBe('[깃허브]() 보기');
  });

  it('주소 자리를 선택 상태로 돌려준다 — 바로 붙여넣게', () => {
    const r = insertLink({ text: '', start: 0, end: 0 });
    expect(r.text).toBe('[링크 문구]()');
    expect(r.start).toBe(r.text.indexOf('](') + 2);
    expect(r.end).toBe(r.start);
  });
});

describe('insertBlock', () => {
  it('앞 내용이 있으면 빈 줄을 넣고 끼운다', () => {
    const r = insertBlock({ text: '문단', start: 2, end: 2 }, '---');
    expect(r.text).toBe('문단\n\n---\n');
  });

  it('줄 시작이면 빈 줄을 더 넣지 않는다', () => {
    const r = insertBlock({ text: '문단\n', start: 3, end: 3 }, '---');
    expect(r.text).toBe('문단\n---\n');
  });
});

describe('imageSnippet', () => {
  it('대체 텍스트를 넣는다', () => {
    expect(imageSnippet('/uploads/a.png', '구조도')).toBe('![구조도](/uploads/a.png)');
  });

  /** alt 가 비면 스크린리더가 파일 경로를 읽는다. 파일 이름이라도 넣는 게 낫다 (GR-7) */
  it('대체 텍스트가 비면 파일 이름을 쓴다', () => {
    expect(imageSnippet('/uploads/diagram.png', '')).toBe('![diagram](/uploads/diagram.png)');
  });
});
