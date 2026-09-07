import type { SaveState } from '../state/use-form';

/** 실패를 원인별로 구분해 보여준다 (스펙 E-4, GR-4). */
export function SaveStatus({ state, loadError }: { state: SaveState; loadError: string | null }) {
  return (
    <>
      {loadError ? (
        <p role="alert" className="text-sm text-destructive">
          {loadError}
        </p>
      ) : null}

      {state.status === 'invalid' ? (
        <div role="alert" className="space-y-1 text-sm text-destructive">
          <p>검증에 실패해 저장하지 않았습니다.</p>
          <ul className="list-disc pl-5">
            {state.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.status === 'error' ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      {state.status === 'saved' ? (
        <p role="status" className="text-sm text-muted-foreground">
          저장했습니다 — {state.path}. 공개하려면 위 배너의 게시 버튼을 누르세요.
        </p>
      ) : null}
    </>
  );
}
