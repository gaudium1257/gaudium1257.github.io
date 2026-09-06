import { Button, Label, Textarea } from '@/shared/ui';
import type { ContentKind } from '@/shared/content';
import { useContentDraft } from '../state/use-draft';
import { SaveStatus } from './SaveStatus';

interface Props {
  kind: ContentKind;
  id: string;
  /** 새 항목을 만들 때 폼에 채울 초기값 */
  template: string;
}

/**
 * 콘텐츠 편집기 — 렌더만 한다. 불러오기·저장 순서는 useContentDraft 가 담당한다 (INV-1).
 *
 * 저장 실패 시 입력값을 잃지 않는다 (스펙 A-7). 검증 실패는 커밋 이전에 잡는다 (INV-3).
 */
export function ContentEditor({ kind, id, template }: Props) {
  const { state, text, setText, sha, localError, refresh, publish } = useContentDraft(
    kind,
    id,
    template,
  );

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor="content-body">
          {kind} · {id}
        </Label>
        <span className="text-xs text-muted-foreground">{sha ? '기존 항목 수정' : '새 항목'}</span>
      </div>

      <Textarea
        id="content-body"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={18}
        spellCheck={false}
        className="font-mono text-xs"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => void publish()} disabled={state.status === 'saving'}>
          {state.status === 'saving' ? '게시 중...' : '게시'}
        </Button>
        <Button variant="outline" onClick={() => void refresh()}>
          다시 불러오기
        </Button>
      </div>

      <SaveStatus state={state} loadError={localError} />
    </section>
  );
}
