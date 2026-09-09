import { describe, expect, it } from 'vitest';
import { shouldOpenSearch } from './use-search-shortcut';

/**
 * 단축키 판단 (EP-0010).
 *
 * admin 이 같은 셸을 쓴다 — 본문에 `/` 를 치는데 검색이 열리면 편집 도구가 망가진다.
 * 이 규칙이 무너지면 글을 못 쓰게 되므로 기계가 지킨다.
 */
describe('shouldOpenSearch', () => {
  it('글을 쓰고 있지 않으면 / 로 연다', () => {
    expect(shouldOpenSearch('/', false, false)).toBe(true);
  });

  it('**입력 중에는 / 를 가로채지 않는다**', () => {
    expect(shouldOpenSearch('/', false, true)).toBe(false);
  });

  it('Ctrl/⌘+K 는 입력 중에도 연다 — 조합키라 글자를 뺏지 않는다', () => {
    expect(shouldOpenSearch('k', true, true)).toBe(true);
    expect(shouldOpenSearch('K', true, true)).toBe(true);
  });

  it('다른 키는 열지 않는다', () => {
    expect(shouldOpenSearch('a', false, false)).toBe(false);
    expect(shouldOpenSearch('Enter', false, false)).toBe(false);
  });

  it('조합키를 누른 채 다른 글자는 열지 않는다 — Ctrl+S 로 열리면 안 된다', () => {
    expect(shouldOpenSearch('s', true, false)).toBe(false);
    expect(shouldOpenSearch('/', true, false)).toBe(false);
  });
});
