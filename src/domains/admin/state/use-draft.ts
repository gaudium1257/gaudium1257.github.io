import { useCallback, useEffect, useState } from 'react';
import type { ContentKind } from '@/shared/content';
import { parseStoredJson } from '../service/publish';
import { useContentEditor } from './use-admin';

/**
 * 편집 초안의 오케스트레이션 — 불러오기·낙관적 잠금(sha)·저장 순서를 담당한다.
 * ui 레이어는 이 훅이 주는 값을 렌더하기만 한다 (INV-1, GR-6).
 */
export function useContentDraft(kind: ContentKind, id: string, template: string) {
  const { state, load, save } = useContentEditor();
  const [text, setText] = useState(template);
  const [sha, setSha] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLocalError(null);
    try {
      const file = await load(kind, id);
      if (file) {
        setText(file.text);
        setSha(file.sha);
      } else {
        // 없는 파일과 실패를 구분한다 — 없으면 새 항목이다
        setSha(null);
      }
    } catch {
      setLocalError('기존 내용을 불러오지 못했습니다. 저장하면 덮어쓸 수 있습니다.');
    }
  }, [kind, id, load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const publish = useCallback(async () => {
    // JSON 이 깨진 경우는 스키마 검증 이전 단계다
    const parsed = parseStoredJson(text);
    if (parsed === null) {
      setLocalError('JSON 형식이 올바르지 않습니다.');
      return;
    }
    setLocalError(null);
    const nextSha = await save(kind, id, parsed, sha);
    if (nextSha) setSha(nextSha);
  }, [text, save, kind, id, sha]);

  return { state, text, setText, sha, localError, refresh, publish };
}
