import { Link } from 'react-router-dom';

/** 없는 경로 안내 (스펙 C-4) */
export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <Link to="/" className="text-sm underline underline-offset-4">
        홈으로
      </Link>
    </div>
  );
}
