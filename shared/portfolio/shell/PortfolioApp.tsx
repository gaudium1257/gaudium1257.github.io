import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { EditingSlots, PortfolioContent } from '../types';
import { SHELL } from './layout';
import { PortfolioRoutes } from './PortfolioRoutes';
import { SiteHeader } from './SiteHeader';
import { ThemeProvider } from './theme';

/**
 * 앱 셸. viewer 와 admin 이 이걸 그대로 쓴다 (ADR-0005).
 *
 * `editing` 을 넘기지 않으면 편집 UI 가 전혀 렌더되지 않는다 — viewer 의 기본값이다 (INV-8).
 * `banner` 는 admin 이 "편집 중"임을 알리는 데 쓴다 (docs/DESIGN.md).
 */
export function PortfolioApp({
  content,
  editing,
  banner,
  overlay,
}: {
  content: PortfolioContent;
  editing?: EditingSlots;
  banner?: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="hero-surface min-h-dvh">
          {/* 배너와 헤더를 한 덩어리로 고정한다 — 각자 sticky 하면 서로 겹친다 */}
          <div className="sticky top-0 z-30">
            {banner}
            <SiteHeader searchIndex={content.searchIndex} />
          </div>
          <main className={`${SHELL} py-10 sm:py-14`}>
            <PortfolioRoutes content={content} editing={editing} />
          </main>
          {overlay}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
