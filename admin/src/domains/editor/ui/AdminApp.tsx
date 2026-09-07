import { useCallback, useState } from 'react';
import { PortfolioApp, type EditingSlots } from '@portfolio/portfolio';
import type { ContentKind } from '@portfolio/content';
import { useApiContent } from '../state/use-api-content';
import { usePublish } from '../state/use-publish';
import { AddButton, EditButton } from './EditButton';
import { EditorPanel } from './EditorPanel';
import { EditingBanner } from './EditingBanner';
import { PublishDialog } from './PublishDialog';
import { describeChanges } from '../service/describe-change';

const ADD_LABEL: Record<ContentKind, string> = {
  profile: '프로필',
  spec: '항목',
  paper: '논문',
  project: '프로젝트',
  post: '글',
};

interface Target {
  kind: ContentKind;
  id: string;
}

/**
 * admin — viewer 와 **같은 화면**에 편집 버튼만 얹는다 (ADR-0005).
 * 표시 코드는 shared/portfolio 한 벌뿐이라 디자인이 갈라질 수 없다.
 */
export function AdminApp() {
  const { content, error, loaded, refresh } = useApiContent();
  const publish = usePublish();
  const [target, setTarget] = useState<Target | null>(null);

  const open = useCallback((kind: ContentKind, id: string) => setTarget({ kind, id }), []);
  const close = useCallback(() => setTarget(null), []);

  const handleSaved = useCallback(() => {
    void refresh();
    void publish.refreshChanges();
  }, [refresh, publish]);

  /** 삭제하면 편집할 대상이 사라진다 — 패널을 닫아야 한다 (EP-0003) */
  const handleDeleted = useCallback(() => {
    setTarget(null);
    void refresh();
    void publish.refreshChanges();
  }, [refresh, publish]);

  const editing: EditingSlots = {
    renderAddAction: (kind) => <AddButton label={ADD_LABEL[kind]} onClick={() => open(kind, '')} />,
    renderItemAction: (kind, id) => <EditButton onClick={() => open(kind, id)} />,
  };

  if (!loaded) {
    return <p className="p-8 text-sm text-muted-foreground">콘텐츠를 불러오는 중…</p>;
  }

  return (
    <PortfolioApp
      content={content}
      editing={editing}
      banner={
        <EditingBanner
          error={error}
          changeCount={publish.changes.length}
          publishState={publish.state}
          onPublishClick={publish.confirm}
        />
      }
      overlay={
        <>
          <PublishDialog
            open={publish.state.status === 'confirming' || publish.state.status === 'publishing'}
            changes={describeChanges(publish.changes, content)}
            publishing={publish.state.status === 'publishing'}
            onCancel={publish.cancel}
            onConfirm={() => void publish.run()}
          />
          <ActiveEditor
            target={target}
            onClose={close}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
          />
        </>
      }
    />
  );
}

/** key 로 대상이 바뀔 때 폼 상태를 초기화한다 — 이전 항목의 값이 새 항목에 남으면 안 된다 */
function ActiveEditor({
  target,
  onClose,
  onSaved,
  onDeleted,
}: {
  target: Target | null;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  if (!target) return null;
  return (
    <EditorPanel
      key={`${target.kind}:${target.id}`}
      kind={target.kind}
      id={target.id}
      onClose={onClose}
      onSaved={onSaved}
      onDeleted={onDeleted}
    />
  );
}
