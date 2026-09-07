import { Button } from '@portfolio/ui';
import type { ContentKind } from '@portfolio/content';
import { FORM_FIELDS, type FieldValue } from '../config/forms';
import { useContentForm, type FormValues, type SaveState } from '../state/use-form';
import { useDelete } from '../state/use-delete';
import { Field } from './fields/Field';
import { SaveStatus } from './SaveStatus';
import { DeleteDialog } from './DeleteDialog';

const KIND_LABEL: Record<ContentKind, string> = {
  profile: '프로필',
  spec: '스펙',
  paper: '논문 리뷰',
  project: '프로젝트',
  post: '블로그 글',
};

/**
 * 편집 패널 — 필드별 폼 (스펙 E-2).
 * 화면 오른쪽에서 밀려 들어온다. 사이트를 다 가리지 않아야 결과를 바로 확인할 수 있다 (E-7).
 *
 * 검증은 JSON 편집기 때와 같은 경로를 쓴다 — 스키마가 유일한 판단자다 (INV-9).
 */
interface EditorPanelProps {
  kind: ContentKind;
  id: string;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export function EditorPanel({ kind, id, onClose, onSaved, onDeleted }: EditorPanelProps) {
  const { values, setField, state, loadError, save } = useContentForm(kind, id);
  const remove = useDelete(kind, id, onDeleted);

  /**
   * 프로필은 지울 수 없다 — 정확히 하나뿐이고, 없으면 Hero 와 About 가 빈 화면이 된다.
   * 아직 저장하지 않은 새 항목도 지울 대상이 없다 (EP-0003).
   */
  const canDelete = kind !== 'profile' && id !== '';
  const itemTitle = typeof values.title === 'string' && values.title ? values.title : id;

  async function handleSave() {
    const saved = await save();
    if (saved) onSaved();
  }

  return (
    <aside
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-2xl flex-col border-l border-border bg-background shadow-2xl"
      role="dialog"
      aria-label={`${KIND_LABEL[kind]} 편집`}
    >
      <PanelHeader title={KIND_LABEL[kind]} subtitle={id || '새 항목'} onClose={onClose} />

      <PanelForm
        kind={kind}
        values={values}
        setField={setField}
        onSubmit={() => void handleSave()}
      />

      <PanelFooter
        state={state}
        loadError={loadError}
        deleteError={remove.state.status === 'error' ? remove.state.message : null}
        canDelete={canDelete}
        onSave={() => void handleSave()}
        onClose={onClose}
        onDelete={remove.confirm}
      />

      <DeleteDialog
        open={remove.state.status === 'confirming' || remove.state.status === 'deleting'}
        title={itemTitle}
        deleting={remove.state.status === 'deleting'}
        onCancel={remove.cancel}
        onConfirm={() => void remove.run()}
      />
    </aside>
  );
}

/** 스키마가 아니라 폼 스펙(config/forms)이 필드 순서를 정한다 */
function PanelForm({
  kind,
  values,
  setField,
  onSubmit,
}: {
  kind: ContentKind;
  values: FormValues;
  setField: (name: string, value: FieldValue) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {FORM_FIELDS[kind].map((spec) => (
        <Field
          key={spec.name}
          spec={spec}
          value={values[spec.name] ?? null}
          onChange={(value) => setField(spec.name, value)}
        />
      ))}
      {/* Enter 로도 저장되게 하되 버튼은 아래 고정 영역에 둔다 */}
      <button type="submit" className="hidden" aria-hidden="true" />
    </form>
  );
}

/** 저장·취소·삭제. 삭제는 오른쪽 끝으로 밀어 저장과 헷갈리지 않게 한다 */
function PanelFooter({
  state,
  loadError,
  deleteError,
  canDelete,
  onSave,
  onClose,
  onDelete,
}: {
  state: SaveState;
  loadError: string | null;
  deleteError: string | null;
  canDelete: boolean;
  onSave: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <footer className="space-y-3 border-t border-border px-6 py-4">
      <SaveStatus state={state} loadError={loadError} />
      {deleteError ? (
        <p role="alert" className="text-sm text-destructive">
          {deleteError}
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={state.status === 'saving'}>
          {state.status === 'saving' ? '저장 중...' : '저장'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        {canDelete ? (
          <Button
            variant="ghost"
            className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
          >
            삭제
          </Button>
        ) : null}
      </div>
    </footer>
  );
}

function PanelHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <Button size="sm" variant="ghost" onClick={onClose} aria-label="편집 닫기">
        닫기
      </Button>
    </header>
  );
}
