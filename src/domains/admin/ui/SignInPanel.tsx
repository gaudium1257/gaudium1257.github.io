import { useState, type FormEvent } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/shared/ui';
import { useAdminAuth } from '../state/use-admin';

/**
 * 인증 화면.
 *
 * 이 화면이 관리자 여부를 판정하지 않는다 — 입력한 토큰을 GitHub 에 제시하고
 * GitHub 의 응답으로 정해진다 (ADR-0004). 화면을 숨기는 것은 보안이 아니다.
 *
 * 토큰은 마스킹하고 다시 표시하지 않는다 (docs/SECURITY.md §3).
 */
export function SignInPanel() {
  const { state, authenticate } = useAdminAuth();
  const [token, setToken] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const ok = await authenticate(token);
    // 성공이든 실패든 입력값을 메모리에 남겨두지 않는다
    if (ok) setToken('');
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>관리자 인증</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="token">GitHub 파인그레인드 토큰</Label>
            <Input
              id="token"
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="github_pat_..."
              aria-describedby="token-help"
            />
          </div>
          <Button type="submit" disabled={state.status === 'checking' || token.length === 0}>
            {state.status === 'checking' ? '확인 중...' : '인증'}
          </Button>
        </form>

        {state.status === 'error' ? (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        ) : null}

        <div id="token-help" className="space-y-1 text-xs text-muted-foreground">
          <p>이 저장소 하나에만, 권한은 contents: read/write 로 발급하세요.</p>
          <p>토큰은 이 탭에만 보관되며 탭을 닫으면 사라집니다. 저장소에 저장되지 않습니다.</p>
        </div>
      </CardContent>
    </Card>
  );
}
