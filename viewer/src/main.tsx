import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PortfolioApp } from '@portfolio/portfolio';
import { usePortfolioContent } from './domains/portfolio/state/use-content';
import './app/styles.css';

/**
 * 공개 사이트. 표시 레이어는 shared/portfolio 가 전부 담당하고,
 * viewer 는 **콘텐츠 출처만** 제공한다 (ADR-0005).
 *
 * editing 을 넘기지 않으므로 편집 UI 는 렌더되지도, 번들에 들어가지도 않는다 (INV-8).
 */
function Viewer() {
  return <PortfolioApp content={usePortfolioContent()} />;
}

const container = document.getElementById('root');
if (!container) throw new Error('#root 를 찾을 수 없습니다');

createRoot(container).render(
  <StrictMode>
    <Viewer />
  </StrictMode>,
);
