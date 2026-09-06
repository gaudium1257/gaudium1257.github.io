import { DEPLOY_DELAY_HINT } from '../config/repo';
import type { SaveState } from '../state/use-admin';

/**
 * 저장 결과 표시. 원인별로 구분해서 보여준다 — "저장 실패" 한 줄로 뭉개지 않는다
 * (FRONTEND.md, GR-4).
 */
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
          <p>스키마 검증에 실패해 게시하지 않았습니다.</p>
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
          게시했습니다. {DEPLOY_DELAY_HINT}
        </p>
      ) : null}
    </>
  );
}
