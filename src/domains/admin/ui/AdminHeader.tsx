import { Link } from 'react-router-dom';
import { Badge, Button } from '@/shared/ui';

/**
 * 관리자 모드임이 항상 보여야 한다. 공개 화면과 구분되지 않으면 실수로 편집한다 (docs/DESIGN.md).
 */
export function AdminHeader({ login, onSignOut }: { login?: string; onSignOut?: () => void }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold tracking-tight">관리자 모드</h1>
        <Badge variant="destructive">편집 중</Badge>
      </div>
      <div className="flex items-center gap-3 text-sm">
        {login ? <span className="text-muted-foreground">{login}</span> : null}
        {onSignOut ? (
          <Button size="sm" variant="outline" onClick={onSignOut}>
            로그아웃
          </Button>
        ) : null}
        <Link to="/" className="underline underline-offset-4">
          공개 화면
        </Link>
      </div>
    </header>
  );
}
