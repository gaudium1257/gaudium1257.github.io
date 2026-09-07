import type { PendingChange } from '../data/publish-api';
import type { PublishState } from '../state/use-publish';
import { PublishButton } from './PublishButton';

/**
 * 편집 중임이 항상 보여야 한다 — 공개 화면과 구분되지 않으면 실수한다 (docs/DESIGN.md).
 *
 * 편집 버튼은 여기 두지 않는다. **보이는 자리에서 고친다.**
 * 게시는 예외다 — 어느 페이지에서든 올릴 수 있어야 한다.
 */
export function EditingBanner({
  error,
  changes,
  publishState,
  onConfirm,
  onCancel,
  onRun,
}: {
  error: string | null;
  changes: PendingChange[];
  publishState: PublishState;
  onConfirm: () => void;
  onCancel: () => void;
  onRun: () => void;
}) {
  return (
    <div className="border-b border-brand/40 bg-brand/10 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-5 py-2 sm:px-8">
        <span className="text-xs font-semibold tracking-wide text-brand uppercase">편집 모드</span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          저장은 즉시, 공개는 게시할 때.
        </span>
        <PublishButton
          changes={changes}
          state={publishState}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onRun={onRun}
        />
      </div>
      {error ? (
        <p role="alert" className="px-5 pb-2 text-xs text-destructive sm:px-8">
          {error}
        </p>
      ) : null}
    </div>
  );
}
