import { NavLink, Link } from 'react-router-dom';
import { cn } from '@portfolio/ui';
import { SECTION_ICONS } from '../config';
import { NAV_ITEMS, SITE_NAME } from './site';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';
import type { SearchEntry } from '../service/search';

/**
 * 좌측 목차 (EP-0006, 시안 07 문서 도구).
 *
 * 탭이 세로로 서면 항목을 늘려도 줄이 밀리지 않고, 본문 폭이 좁아져
 * 글이 읽기 좋은 길이로 떨어진다.
 *
 * **좁은 화면에서는 가로로 눕는다.** 224px 짜리 열을 모바일에 그대로 두면
 * 본문이 설 자리가 없다 — 세로 목차는 넓은 화면의 사치다.
 *
 * 색과 서체는 기존 토큰 그대로다. 바뀌는 것은 배치뿐이다.
 */
export function DocsSidebar({ searchIndex }: { searchIndex: SearchEntry[] }) {
  return (
    <aside
      className={cn(
        'no-print bg-muted/40',
        'flex flex-col border-b border-border md:h-full md:w-56 md:border-r md:border-b-0',
      )}
    >
      <div className="flex items-center gap-2 px-3 pt-3 pb-1 md:pt-4 md:pb-2">
        <Link
          to="/"
          className="rounded-md px-2 py-1.5 text-sm font-semibold tracking-tight transition-colors hover:bg-accent"
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

      <nav aria-label="주요 섹션" className="flex-1 px-3 pb-2 md:pb-0">
        <ul className="flex gap-1 overflow-x-auto md:block md:space-y-0.5 md:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end={item.path === '/'}>
                {({ isActive }) => (
                  <NavRow label={item.label} icon={SECTION_ICONS[item.key]} isActive={isActive} />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden items-center gap-1 border-t border-border px-3 py-2 md:flex">
        <SearchBox index={searchIndex} />
        <ThemeToggle />
      </div>
    </aside>
  );
}

/** 현재 항목은 배경과 굵기 둘 다로 구분한다 — 색만으로는 색각 이상에서 안 보인다 */
function NavRow({ label, icon, isActive }: { label: string; icon: string; isActive: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm whitespace-nowrap transition-colors',
        isActive
          ? 'bg-accent font-medium text-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
      )}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}
