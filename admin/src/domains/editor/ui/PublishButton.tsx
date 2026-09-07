import { Button } from '@portfolio/ui';
import type { PendingChange } from '../data/publish-api';
import type { PublishState } from '../state/use-publish';

/**
 * 게시 (ADR-0003 개정, 스펙 P-1~P-5).
 *
 * 누르기 전에 **무엇이 올라가는지 보여주고 확인을 받는다** —
 * 공개 사이트는 심사자가 보는 곳이라 되돌리기가 비싸다.
 */
export function PublishButton({
  changes,
  state,
  onConfirm,
  onCancel,
  onRun,
}: {
  changes: PendingChange[];
  state: PublishState;
  onConfirm: () => void;
  onCancel: () => void;
  onRun: () => void;
}) {
  if (state.status === 'confirming') {
    return <ConfirmPanel changes={changes} onCancel={onCancel} onRun={onRun} />;
  }

  return (
    <div className="ml-auto flex items-center gap-3">
      <Result state={state} />
      <Button size="sm" onClick={onConfirm} disabled={changes.length === 0}>
        {changes.length === 0 ? '게시할 변경 없음' : `게시 (${changes.length}건)`}
      </Button>
    </div>
  );
}

function Result({ state }: { state: PublishState }) {
  if (state.status === 'publishing') {
    return <span className="text-xs text-muted-foreground">게시 중…</span>;
  }
  if (state.status !== 'done') return null;

  const { ok, message, commit } = state.response;
  return (
    <span
      role="status"
      className={ok ? 'text-xs text-muted-foreground' : 'text-xs text-destructive'}
    >
      {ok ? `게시했습니다 (${commit}) · 약 1분 뒤 공개 반영` : message}
    </span>
  );
}

function ConfirmPanel({
  changes,
  onCancel,
  onRun,
}: {
  changes: PendingChange[];
  onCancel: () => void;
  onRun: () => void;
}) {
  return (
    <div className="ml-auto flex flex-wrap items-center gap-3">
      <details open className="text-xs">
        <summary className="cursor-pointer text-muted-foreground">
          {changes.length}건을 공개합니다
        </summary>
        <ul className="mt-1 max-h-24 overflow-y-auto">
          {changes.map((change) => (
            <li key={change.path} className="text-muted-foreground">
              <span className="font-mono">{change.status}</span> {change.path}
            </li>
          ))}
        </ul>
      </details>
      <Button size="sm" onClick={onRun}>
        공개
      </Button>
      <Button size="sm" variant="outline" onClick={onCancel}>
        취소
      </Button>
    </div>
  );
}
