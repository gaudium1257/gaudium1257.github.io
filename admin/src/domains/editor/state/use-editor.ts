import { useCallback, useEffect, useState } from 'react';
import type { ContentKind } from '@portfolio/content';
import { ContentApiError, readEntry, writeEntry } from '../data/content-api';
import { templateFor, validateContent } from '../service/validate';

export type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'invalid'; issues: string[] }
  | { status: 'error'; message: string }
  | { status: 'saved'; path: string };

/**
 * 편집 초안 — 불러오기·검증·저장 순서를 담당한다.
 * ui 는 이 훅이 주는 값을 렌더만 한다 (INV-1, GR-6).
 */
export function useDraft(kind: ContentKind, id: string) {
  const [text, setText] = useState('');
  const [state, setState] = useState<SaveState>({ status: 'idle' });
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setState({ status: 'idle' });
    setLoadError(null);
    if (!id) {
      setText(templateFor(kind));
      return;
    }
    try {
      const json = await readEntry(kind, id);
      setText(json ?? templateFor(kind));
    } catch (e) {
      setLoadError(e instanceof ContentApiError ? e.message : '불러오지 못했습니다.');
    }
  }, [kind, id]);

  useEffect(() => {
    void load();
  }, [load]);

  /** 검증이 먼저다. 통과하지 못한 값은 파일에 쓰지 않는다 (스펙 E-2) */
  const save = useCallback(async () => {
    const result = validateContent(kind, text);
    if (!result.ok) {
      setState({ status: 'invalid', issues: result.issues });
      return null;
    }

    const parsed = JSON.parse(result.json) as Record<string, unknown>;
    const targetId = kind === 'profile' ? 'profile' : String(parsed.id ?? '');
    if (!targetId) {
      setState({ status: 'invalid', issues: ['id 가 비어 있습니다.'] });
      return null;
    }

    setState({ status: 'saving' });
    try {
      const path = await writeEntry(kind, targetId, result.json);
      setState({ status: 'saved', path });
      return targetId;
    } catch (e) {
      const message = e instanceof ContentApiError ? e.message : '저장에 실패했습니다.';
      setState({ status: 'error', message });
      return null;
    }
  }, [kind, text]);

  return { text, setText, state, loadError, load, save };
}
