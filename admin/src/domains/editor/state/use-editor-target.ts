import { useCallback, useState } from 'react';
import type { ContentKind } from '@portfolio/content';

export interface EditorTarget {
  kind: ContentKind;
  id: string;
}

interface PublishActions {
  refreshChanges: () => Promise<void>;
  revertOne: (path: string) => Promise<void>;
}

/**
 * 무엇을 편집 중인가, 그리고 편집이 끝난 뒤 무엇을 다시 읽어야 하는가 (INV-1: ui 는 렌더만).
 *
 * 세 동작이 각각 다른 뒷정리를 요구한다:
 *  - 저장: 콘텐츠와 변경 목록을 다시 읽는다. **패널은 열어 둔다** — 이어서 고칠 수 있게
 *  - 삭제: 편집 대상이 사라졌으므로 패널을 닫는다 (EP-0003)
 *  - 복구: 디스크의 파일이 되돌아갔으므로 콘텐츠를 다시 읽고 패널을 닫는다 (EP-0004)
 */
export function useEditorTarget(refresh: () => Promise<void>, publish: PublishActions) {
  const [target, setTarget] = useState<EditorTarget | null>(null);

  const open = useCallback((kind: ContentKind, id: string) => setTarget({ kind, id }), []);
  const close = useCallback(() => setTarget(null), []);

  const onSaved = useCallback(() => {
    void refresh();
    void publish.refreshChanges();
  }, [refresh, publish]);

  const onDeleted = useCallback(() => {
    setTarget(null);
    void refresh();
    void publish.refreshChanges();
  }, [refresh, publish]);

  const onReverted = useCallback(
    async (path: string) => {
      await publish.revertOne(path);
      setTarget(null);
      void refresh();
    },
    [refresh, publish],
  );

  return { target, open, close, onSaved, onDeleted, onReverted };
}
