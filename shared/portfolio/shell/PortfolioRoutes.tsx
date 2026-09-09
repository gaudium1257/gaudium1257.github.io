import { Route, Routes } from 'react-router-dom';
import type { EditingSlots, PortfolioContent } from '../types';
import { AboutPage } from '../ui/AboutPage';
import { BlogDetailPage } from '../ui/BlogDetailPage';
import { BlogPage } from '../ui/BlogPage';
import { HomePage } from '../ui/HomePage';
import { PaperDetailPage } from '../ui/PaperDetailPage';
import { PapersPage } from '../ui/PapersPage';
import { ProjectDetailPage } from '../ui/ProjectDetailPage';
import { ProjectsPage } from '../ui/ProjectsPage';
import { NotFoundPage } from './NotFoundPage';
import { useHashScroll } from './use-hash-scroll';

/**
 * 두 앱이 같은 라우트를 쓴다 (ADR-0005).
 * 다른 것은 콘텐츠 출처와 편집 슬롯뿐이다.
 */
export function PortfolioRoutes({
  content,
  editing,
}: {
  content: PortfolioContent;
  editing?: EditingSlots;
}) {
  // 검색 결과가 About 의 특정 항목을 가리킨다 — 해시로 이동하면 거기까지 데려간다 (EP-0010)
  useHashScroll();

  return (
    <Routes>
      <Route path="/" element={<HomePage content={content} editing={editing} />} />
      <Route path="/about" element={<AboutPage content={content} editing={editing} />} />
      <Route path="/papers" element={<PapersPage content={content} editing={editing} />} />
      <Route path="/papers/:id" element={<PaperDetailPage content={content} />} />
      <Route path="/projects" element={<ProjectsPage content={content} editing={editing} />} />
      <Route path="/projects/:id" element={<ProjectDetailPage content={content} />} />
      <Route path="/blog" element={<BlogPage content={content} editing={editing} />} />
      <Route path="/blog/:id" element={<BlogDetailPage content={content} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
