import { useCallback, useEffect, useState } from 'react';
import {
  fetchPendingChanges,
  requestPublish,
  type PendingChange,
  type PublishResponse,
} from '../data/publish-api';

export type PublishState =
  | { status: 'idle' }
  | { status: 'confirming' }
  | { status: 'publishing' }
  | { status: 'done'; response: PublishResponse };

/**
 * 게시 상태 (ADR-0003 개정).
 * 저장과 공개는 분리한다 — 저장할 때마다 자동으로 푸시하지 않는다.
 */
export function usePublish() {
  const [changes, setChanges] = useState<PendingChange[]>([]);
  const [state, setState] = useState<PublishState>({ status: 'idle' });

  const refreshChanges = useCallback(async () => {
    setChanges(await fetchPendingChanges());
  }, []);

  useEffect(() => {
    void refreshChanges();
  }, [refreshChanges]);

  const confirm = useCallback(() => setState({ status: 'confirming' }), []);
  const cancel = useCallback(() => setState({ status: 'idle' }), []);

  const run = useCallback(async () => {
    setState({ status: 'publishing' });
    const response = await requestPublish();
    setState({ status: 'done', response });
    await refreshChanges();
  }, [refreshChanges]);

  return { changes, state, confirm, cancel, run, refreshChanges };
}
