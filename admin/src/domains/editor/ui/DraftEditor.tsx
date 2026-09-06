import { Button } from '@portfolio/ui';
import type { ContentKind } from '@portfolio/content';
import { useDraft } from '../state/use-editor';
import { SaveStatus } from './SaveStatus';

/** 편집기 — 렌더만 한다. 불러오기·검증·저장 순서는 useDraft 가 담당한다 (INV-1). */
export function DraftEditor({
  kind,
  id,
  onSaved,
}: {
  kind: ContentKind;
  id: string;
  onSaved: () => void;
}) {
  const { text, setText, state, loadError, load, save } = useDraft(kind, id);

  async function handleSave() {
    const saved = await save();
    if (saved) onSaved();
  }

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor="draft" className="text-sm font-medium">
          {kind} · {id || '(새 항목)'}
        </label>
        <span className="text-xs text-muted-foreground">
          저장하면 content/ 파일에 바로 쓰입니다
        </span>
      </div>

      <textarea
        id="draft"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={24}
        spellCheck={false}
        className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => void handleSave()} disabled={state.status === 'saving'}>
          {state.status === 'saving' ? '저장 중...' : '저장'}
        </Button>
        <Button variant="outline" onClick={() => void load()}>
          다시 불러오기
        </Button>
      </div>

      <SaveStatus state={state} loadError={loadError} />
    </section>
  );
}
