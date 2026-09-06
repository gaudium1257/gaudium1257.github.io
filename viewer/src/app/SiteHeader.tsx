import { NavLink, Link } from 'react-router-dom';
import { cn } from '@portfolio/ui';
import { NAV_ITEMS, SITE_NAME } from './site';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';
import type { SearchEntry } from '@viewer/domains/portfolio';

/**
 * 상단 배너 (스펙: docs/product-specs/navigation-shell.md).
 * 좌상단 이름 · 가운데 탭 5개 · 우상단 도구 2개(검색·테마).
 */
export function SiteHeader({ searchIndex }: { searchIndex: SearchEntry[] }) {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 sm:px-8">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight hover:opacity-80"
          aria-label={`${SITE_NAME} 홈으로`}
        >
          {SITE_NAME}
        </Link>

        <nav aria-label="주요 섹션" className="order-3 w-full sm:order-none sm:w-auto">
          <ul className="-mx-1 flex items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors',
                      // 현재 탭은 색만이 아니라 굵기로도 구분한다 (docs/DESIGN.md)
                      isActive
                        ? 'bg-accent font-semibold text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchBox index={searchIndex} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
