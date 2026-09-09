import { Link } from 'react-router-dom';
import type { Profile } from '@portfolio/content';
import type { EditingSlots } from '../types';

interface Props {
  profile: Profile;
  counts: { papers: number; projects: number; posts: number };
  editing?: EditingSlots;
}

/**
 * 첫 화면 (스펙 H-1). 심사자가 30초 안에 파악해야 할 것만 담는다.
 *
 * 문서 도구 배치(EP-0006)라 문서의 첫 장처럼 짠다:
 * 큰 아이콘 → 제목 → 부제 → 본문. 숫자는 표 대신 한 줄로 눕혔다 —
 * 좌측 목차가 이미 세로선을 만들고 있어 표를 또 세우면 화면이 조각난다.
 */
export function Hero({ profile, counts, editing = {} }: Props) {
  return (
    <section className="pb-8">
      <div aria-hidden="true" className="text-5xl leading-none">
        📓
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
        {editing.renderItemAction?.('profile', 'profile')}
      </div>

      <p className="mt-3 text-lg text-muted-foreground">{profile.headline}</p>

      {profile.intro ? (
        <p className="mt-4 leading-relaxed text-muted-foreground">{profile.intro}</p>
      ) : null}

      <Ledger counts={counts} />

      {profile.links.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {profile.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

/** 실적을 한 줄로 놓는다. 값이 0 인 항목은 빼서, 없는 것을 굳이 광고하지 않는다. */
function Ledger({ counts }: { counts: Props['counts'] }) {
  const items = [
    { label: '논문 리뷰', value: counts.papers, to: '/papers' },
    { label: '프로젝트', value: counts.projects, to: '/projects' },
    { label: '글', value: counts.posts, to: '/blog' },
  ].filter((item) => item.value > 0);

  if (items.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-md bg-muted/60 px-4 py-3 text-sm">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="text-muted-foreground transition-colors hover:text-brand"
        >
          {item.label} <span className="font-semibold tabular-nums">{item.value}</span>
        </Link>
      ))}
    </div>
  );
}
