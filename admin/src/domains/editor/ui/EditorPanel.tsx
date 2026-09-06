import { Button } from '@portfolio/ui';
import type { ContentKind } from '@portfolio/content';
import { useDraft } from '../state/use-editor';
import { SaveStatus } from './SaveStatus';

const KIND_LABEL: Record<ContentKind, string> = {
  profile: '프로필',
  spec: '스펙',
  paper: '논문 리뷰',
  project: '프로젝트',
  post: '블로그 글',
};

/**
 * 편집 패널. 화면 오른쪽에서 밀려 들어온다 —
 * 사이트를 가리지 않아야 편집 결과를 바로 확인할 수 있다 (스펙 E-7).
 */
export function EditorPanel({
  kind,
  id,
  onClose,
  onSaved,
}: {
  kind: ContentKind;
  id: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { text, setText, state, loadError, save } = useDraft(kind, id);

  async function handleSave() {
    const saved = await save();
    if (saved) onSaved();
  }

  return (
    <aside
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-xl flex-col border-l border-border bg-background shadow-2xl"
      role="dialog"
      aria-label={`${KIND_LABEL[kind]} 편집`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div>
          <h2 className="font-semibold">{KIND_LABEL[kind]}</h2>
          <p className="text-xs text-muted-foreground">{id || '새 항목'}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose} aria-label="편집 닫기">
          닫기
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          aria-label={`${KIND_LABEL[kind]} 내용`}
          className="h-full min-h-96 w-full resize-none rounded-md border border-input bg-background p-3 font-mono text-xs"
        />
      </div>

      <footer className="space-y-3 border-t border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => void handleSave()} disabled={state.status === 'saving'}>
            {state.status === 'saving' ? '저장 중...' : '저장'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
        </div>
        <SaveStatus state={state} loadError={loadError} />
      </footer>
    </aside>
  );
}
