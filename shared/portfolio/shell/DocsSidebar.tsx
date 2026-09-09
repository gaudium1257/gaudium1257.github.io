import { NavLink, Link } from 'react-router-dom';
import { cn } from '@portfolio/ui';
import { NAV_ITEMS, SITE_NAME } from './site';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';
import type { SearchEntry } from '../service/search';

/**
 * 좌측 목차 (EP-0006).
 *
 * 탭이 세로로 서면 항목을 늘려도 줄이 밀리지 않고, 본문 폭이 좁아져
 * 글이 읽기 좋은 길이로 떨어진다.
 *
 * 항목 앞에는 **번호**를 세운다. 이모지를 쓰면 어느 도구에서나 본 화면이 되고,
 * 서체와 따로 놀아 크기도 제각각이다. 번호는 활자라 목록과 같은 리듬으로 정렬된다.
 *
 * **좁은 화면에서는 가로로 눕는다.** 224px 짜리 열을 모바일에 그대로 두면
 * 본문이 설 자리가 없다 — 세로 목차는 넓은 화면의 사치다.
 */
export function DocsSidebar({ searchIndex }: { searchIndex: SearchEntry[] }) {
  return (
    <aside
      className={cn(
        'no-print rail-surface bg-background',
        'flex flex-col border-b border-border md:h-full md:w-56 md:border-r md:border-b-0 lg:w-64',
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 md:pt-6 md:pb-5">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight transition-colors hover:text-brand"
          aria-label={`${SITE_NAME} 홈으로`}
        >
          {SITE_NAME}
        </Link>
        {/* 좁은 화면에서는 도구를 제호 옆으로 올린다 — 아래로 내리면 목차와 겹친다 */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <SearchBox index={searchIndex} />
          <ThemeToggle />
        </div>
      </div>

      <nav aria-label="주요 섹션" className="flex-1 px-2 pb-2 md:px-0 md:pb-0">
        <p className="eyebrow hidden px-5 pb-2 md:block">Index</p>
        <ul className="flex gap-1 overflow-x-auto md:block md:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end={item.path === '/'}>
                {({ isActive }) => <NavRow label={item.label} isActive={isActive} />}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden items-center gap-1 border-t border-border px-4 py-3 md:flex">
        <SearchBox index={searchIndex} />
        <ThemeToggle />
      </div>
    </aside>
  );
}

/**
 * 현재 항목은 **왼쪽 막대 + 굵기 + 색** 세 가지로 구분한다.
 * 색만으로 구분하면 색각 이상에서 사라지고, 배경만으로는 노션의 그 회색 칩이 된다.
 *
 * 번호는 쓰지 않는다 — 목차의 순서에는 의미가 없다 (EP-0009).
 */
function NavRow({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center gap-2.5 border-l-2 py-2.5 pr-4 pl-5 text-[0.9375rem] whitespace-nowrap transition-colors',
        isActive
          ? 'border-brand bg-brand-subtle font-semibold text-foreground'
          : 'border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      )}
    >
      {/*
       * 가운뎃점은 너무 작아 안 보였다. 짧은 막대는 크기를 직접 정할 수 있고,
       * 활성일 때 길이와 진하기로 상태까지 말한다 (EP-0009 후속).
       */}
      <span
        aria-hidden="true"
        className={cn(
          'h-[3px] shrink-0 rounded-full transition-all',
          isActive ? 'w-4 bg-brand' : 'w-2.5 bg-muted-foreground/40',
        )}
      />
      {label}
    </span>
  );
}
