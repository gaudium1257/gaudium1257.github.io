import { useEffect } from 'react';

/**
 * 검색 단축키 (EP-0010). `/` 또는 `Ctrl/⌘+K`.
 *
 * **입력 중에는 동작하지 않는다.** admin 이 같은 셸을 쓰기 때문에,
 * 본문에 `/` 를 못 치면 편집 도구가 망가진다.
 * `Ctrl/⌘+K` 는 조합키라 입력 중에도 안전하다 — 그쪽만 허용한다.
 */

/** 지금 글을 쓰고 있는가. contentEditable 도 포함한다 */
export function isTypingIn(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

/** 이 키 입력이 검색을 열어야 하는가 */
export function shouldOpenSearch(key: string, modifier: boolean, typing: boolean): boolean {
  if (modifier) return key.toLowerCase() === 'k';
  return key === '/' && !typing;
}

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const modifier = event.metaKey || event.ctrlKey;
      if (!shouldOpenSearch(event.key, modifier, isTypingIn(event.target))) return;

      // 브라우저 기본 동작(빠른 찾기 등)을 막고 우리 검색을 연다
      event.preventDefault();
      onOpen();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpen]);
}
