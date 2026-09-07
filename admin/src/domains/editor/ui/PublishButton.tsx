import { Button } from '@portfolio/ui';
import type { PublishState } from '../state/use-publish';

/**
 * 배너의 게시 버튼 (스펙 P-1, P-2).
 * 목록은 여기 펼치지 않는다 — 모달에서 제목으로 보여준다 (PublishDialog).
 */
export function PublishButton({
  count,
  state,
  onClick,
}: {
  count: number;
  state: PublishState;
  onClick: () => void;
}) {
  return (
    <div className="ml-auto flex items-center gap-3">
      <Result state={state} />
      <Button size="sm" onClick={onClick} disabled={count === 0}>
        {count === 0 ? '게시할 변경 없음' : `게시 (${count}건)`}
      </Button>
    </div>
  );
}

function Result({ state }: { state: PublishState }) {
  if (state.status !== 'done') return null;

  const { ok, message, commit } = state.response;
  return (
    <span
      role="status"
      className={ok ? 'text-xs text-muted-foreground' : 'text-xs text-destructive'}
    >
      {ok ? `공개했습니다 (${commit}) · 약 1분 뒤 반영` : message}
    </span>
  );
}
