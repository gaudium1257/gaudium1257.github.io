import { useCallback, useState } from 'react';
import type { ContentKind } from '@portfolio/content';
import { ContentApiError, deleteEntry } from '../data/content-api';

/**
 * 삭제 흐름 — 확인 → 실행 (EP-0003).
 *
 * 저장 상태(`useContentForm`)와 **섞지 않는다.** 섞으면 삭제 실패가
 * "저장에 실패했습니다" 로 보인다. 원인을 구분해 보여주는 게 스펙 E-4 다.
 */
type DeleteState =
  | { status: 'idle' }
  | { status: 'confirming' }
  | { status: 'deleting' }
  | { status: 'error'; message: string };

export function useDelete(kind: ContentKind, id: string, onDeleted: () => void) {
  const [state, setState] = useState<DeleteState>({ status: 'idle' });

  const confirm = useCallback(() => setState({ status: 'confirming' }), []);
  const cancel = useCallback(() => setState({ status: 'idle' }), []);

  const run = useCallback(async () => {
    setState({ status: 'deleting' });
    try {
      await deleteEntry(kind, id);
      setState({ status: 'idle' });
      onDeleted();
    } catch (e) {
      setState({
        status: 'error',
        message: e instanceof ContentApiError ? e.message : '삭제하지 못했습니다.',
      });
    }
  }, [kind, id, onDeleted]);

  return { state, confirm, cancel, run };
}
