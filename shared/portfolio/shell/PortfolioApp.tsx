import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { EditingSlots, PortfolioContent } from '../types';
import { DocsSidebar } from './DocsSidebar';
import { PortfolioRoutes } from './PortfolioRoutes';
import { ThemeProvider } from './theme';

/**
 * 앱 셸. viewer 와 admin 이 이걸 그대로 쓴다 (ADR-0005).
 *
 * 배치는 **좌측 목차 + 본문** 한 가지다 (EP-0006, 시안 07 문서 도구).
 * 선택지를 두지 않는다 — 레이아웃이 둘이면 어느 쪽도 끝까지 다듬지 않게 된다.
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
        <div className="flex min-h-dvh flex-col md:flex-row">
          {/* 목차는 늘 보여야 이동이 빠르다 — 넓은 화면에서만 고정한다 */}
          <div className="md:sticky md:top-0 md:h-dvh">
            <DocsSidebar searchIndex={content.searchIndex} />
          </div>

          <div className="min-w-0 flex-1">
            {banner ? <div className="sticky top-0 z-30">{banner}</div> : null}
            <main className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-8 sm:py-12">
              <PortfolioRoutes content={content} editing={editing} />
            </main>
          </div>
        </div>
        {overlay}
      </BrowserRouter>
    </ThemeProvider>
  );
}
