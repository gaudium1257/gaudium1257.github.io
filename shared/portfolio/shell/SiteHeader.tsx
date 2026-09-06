import { NavLink, Link } from 'react-router-dom';
import { cn } from '@portfolio/ui';
import { NAV_ITEMS, SITE_NAME } from './site';
import { SHELL } from './layout';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';
import type { SearchEntry } from '../service/search';

/**
 * 상단 배너 (스펙: docs/product-specs/navigation-shell.md).
 * 좌상단 이름 · 가운데 탭 5개 · 우상단 도구 2개(검색·테마).
 */
export function SiteHeader({ searchIndex }: { searchIndex: SearchEntry[] }) {
  return (
    <header className="no-print border-b border-border bg-background/80 backdrop-blur-md">
      <div className={cn(SHELL, 'flex flex-wrap items-center gap-x-6 gap-y-2 py-3')}>
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-md text-base font-semibold tracking-tight"
          aria-label={`${SITE_NAME} 홈으로`}
        >
          <span className="size-2 rounded-full bg-brand transition-transform group-hover:scale-125" />
          {SITE_NAME}
        </Link>

        <nav aria-label="주요 섹션" className="order-3 w-full sm:order-none sm:w-auto">
          <ul className="-mx-1 flex items-center gap-2 overflow-x-auto overflow-y-hidden">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} end={item.path === '/'} className="block px-1">
                  {({ isActive }) => <NavTab label={item.label} isActive={isActive} />}
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

/** 현재 탭은 색만이 아니라 굵기와 밑줄 막대로도 구분한다 (docs/DESIGN.md) */
function NavTab({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <span
      className={cn(
        'relative block px-0.5 pt-1.5 pb-2 text-sm whitespace-nowrap transition-colors',
        isActive ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          'absolute bottom-0 left-0 h-0.5 w-full rounded-full transition-opacity',
          isActive ? 'bg-brand opacity-100' : 'bg-transparent opacity-0',
        )}
      />
    </span>
  );
}
