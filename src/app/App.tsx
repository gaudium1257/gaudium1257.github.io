import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { SessionProvider } from '@/shared/providers/session';
import { HomePage, PostPage, ProjectPage } from '@/domains/portfolio';

/**
 * 앱 조립부. 여기만 모든 것을 import 할 수 있고, 누구도 app/ 을 import 하지 않는다 (INV-1).
 *
 * 관리자 화면은 별도 청크로 지연 로딩한다. 성능 목적이지 보안이 아니다 —
 * 번들을 열면 존재는 보인다. 실제 경계는 GitHub 토큰 검증이다 (INV-11).
 */
const AdminPage = lazy(async () => {
  const module = await import('@/domains/admin');
  return { default: module.AdminPage };
});

export function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route
              path="/admin"
              element={
                <Suspense
                  fallback={<p className="text-sm text-muted-foreground">불러오는 중...</p>}
                >
                  <AdminPage />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <SiteFooter />
        </div>
      </BrowserRouter>
    </SessionProvider>
  );
}

function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <Link to="/" className="text-sm underline underline-offset-4">
        홈으로
      </Link>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t pt-6 text-xs text-muted-foreground">
      <Link to="/admin" className="hover:text-foreground">
        관리자
      </Link>
    </footer>
  );
}
