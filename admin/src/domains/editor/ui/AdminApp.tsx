import { PortfolioApp, type EditingSlots, type PortfolioContent } from '@portfolio/portfolio';
import type { ContentKind } from '@portfolio/content';
import { useApiContent } from '../state/use-api-content';
import { usePublish } from '../state/use-publish';
import { useEditorTarget, type EditorTarget } from '../state/use-editor-target';
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

/**
 * admin — viewer 와 **같은 화면**에 편집 버튼만 얹는다 (ADR-0005).
 * 표시 코드는 shared/portfolio 한 벌뿐이라 디자인이 갈라질 수 없다.
 */
export function AdminApp() {
  const { content, error, loaded, refresh } = useApiContent();
  const publish = usePublish();
  const { target, open, close, onSaved, onDeleted, onReverted } = useEditorTarget(refresh, publish);

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
          <PublishOverlay publish={publish} content={content} onRevert={onReverted} />
          <ActiveEditor target={target} onClose={close} onSaved={onSaved} onDeleted={onDeleted} />
        </>
      }
    />
  );
}

/** 게시 모달 배선. 경로→제목 변환은 여기서 한 번만 한다 */
function PublishOverlay({
  publish,
  content,
  onRevert,
}: {
  publish: ReturnType<typeof usePublish>;
  content: PortfolioContent;
  onRevert: (path: string) => Promise<void>;
}) {
  const busy = publish.state.status === 'publishing';
  return (
    <PublishDialog
      open={publish.state.status === 'confirming' || busy}
      changes={describeChanges(publish.changes, content)}
      publishing={busy}
      busyPath={publish.busyPath}
      itemError={publish.itemError}
      onCancel={publish.cancel}
      onConfirm={() => void publish.run()}
      onPublishOne={(path) => void publish.publishOne(path)}
      onRevertOne={(path) => void onRevert(path)}
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
  target: EditorTarget | null;
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
