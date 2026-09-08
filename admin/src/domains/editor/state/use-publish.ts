import { useCallback, useEffect, useState } from 'react';
import {
  fetchPendingChanges,
  requestPublish,
  requestRevert,
  type PendingChange,
  type PublishResponse,
} from '../data/publish-api';

export type PublishState =
  | { status: 'idle' }
  | { status: 'confirming' }
  | { status: 'publishing' }
  | { status: 'done'; response: PublishResponse };

/**
 * 게시 상태 (ADR-0003 개정, EP-0004).
 * 저장과 공개는 분리한다 — 저장할 때마다 자동으로 푸시하지 않는다.
 *
 * 전체 게시와 항목별 작업이 함께 산다. `busyPath` 는 어느 줄이 작업 중인지 나타내
 * 그 줄의 버튼만 잠근다 — 전체를 얼리면 다른 줄을 못 만진다.
 */
export function usePublish() {
  const [changes, setChanges] = useState<PendingChange[]>([]);
  const [state, setState] = useState<PublishState>({ status: 'idle' });

  const refreshChanges = useCallback(async () => {
    setChanges(await fetchPendingChanges());
  }, []);

  const item = useItemActions(refreshChanges);

  useEffect(() => {
    void refreshChanges();
  }, [refreshChanges]);

  const confirm = useCallback(() => {
    item.clearItemError();
    setState({ status: 'confirming' });
  }, [item]);
  const cancel = useCallback(() => setState({ status: 'idle' }), []);

  /** 전체 게시 */
  const run = useCallback(async () => {
    setState({ status: 'publishing' });
    const response = await requestPublish();
    setState({ status: 'done', response });
    await refreshChanges();
  }, [refreshChanges]);

  return { changes, state, confirm, cancel, run, refreshChanges, ...item };
}

type ItemAction = (paths: string[]) => Promise<{ ok: boolean; message: string }>;

/**
 * 항목별 게시·복구. 두 동작의 흐름이 같다 —
 * **그 줄만** 잠그고, 실패를 삼키지 않고, 끝나면 목록을 다시 읽는다.
 *
 * 전체를 얼리지 않는 게 핵심이다. 한 줄이 작업 중이어도 다른 줄은 누를 수 있어야 한다.
 */
function useItemActions(refreshChanges: () => Promise<void>) {
  const [busyPath, setBusyPath] = useState<string | null>(null);
  const [itemError, setItemError] = useState<string | null>(null);

  const runOnItem = useCallback(
    async (path: string, action: ItemAction) => {
      setBusyPath(path);
      setItemError(null);
      const response = await action([path]);
      if (!response.ok) setItemError(response.message);
      setBusyPath(null);
      await refreshChanges();
    },
    [refreshChanges],
  );

  return {
    busyPath,
    itemError,
    clearItemError: useCallback(() => setItemError(null), []),
    /** 한 항목만 게시한다. 나머지는 미게시로 남으므로 모달을 닫지 않는다. */
    publishOne: useCallback((path: string) => runOnItem(path, requestPublish), [runOnItem]),
    /** 한 항목만 되돌린다. 되살릴 수 없으므로 호출 전에 확인을 받아야 한다. */
    revertOne: useCallback((path: string) => runOnItem(path, requestRevert), [runOnItem]),
  };
}
