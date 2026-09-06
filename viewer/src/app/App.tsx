import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@viewer/shared/providers/theme';
import {
  AboutPage,
  BlogDetailPage,
  BlogPage,
  HomePage,
  PaperDetailPage,
  PapersPage,
  ProjectDetailPage,
  ProjectsPage,
  usePortfolioContent,
} from '@viewer/domains/portfolio';
import { SiteHeader } from './SiteHeader';
import { NotFoundPage } from './NotFoundPage';

/**
 * 앱 조립부. 여기만 모든 것을 import 할 수 있고, 누구도 app/ 을 import 하지 않는다 (INV-1).
 * 도메인은 자기가 어느 탭 아래 있는지 모른다.
 */
export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function Shell() {
  // 검색 인덱스는 셸이 만들어 배너에 넘긴다 (ADR-0004)
  const { searchIndex } = usePortfolioContent();

  return (
    <div className="min-h-dvh">
      <SiteHeader searchIndex={searchIndex} />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/papers/:id" element={<PaperDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
