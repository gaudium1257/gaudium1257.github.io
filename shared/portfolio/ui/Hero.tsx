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
 * 작은 라벨 → 괘선 → 이름 → 한 줄 소개 → 실적 표.
 * 이모지나 색면으로 시선을 끌지 않는다. 활자 크기 차이와 선만으로 위계를 만든다.
 *
 * **자기소개글은 여기 두지 않는다.** 홈은 30초 안에 훑는 화면인데(H-1)
 * 긴 글이 들어오면 그 전제가 깨진다. 자기소개는 About 이 갖는다 (A-1).
 */
export function Hero({ profile, counts, editing = {} }: Props) {
  return (
    <section className="pb-8">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
        <p className="eyebrow">Portfolio</p>
        {editing.renderItemAction?.('profile', 'profile')}
      </div>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{profile.headline}</p>

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

/** 실적 표. 값이 0 인 항목은 빼서, 없는 것을 굳이 광고하지 않는다. */
function Ledger({ counts }: { counts: Props['counts'] }) {
  const items = [
    { label: '논문 리뷰', value: counts.papers, to: '/papers' },
    { label: '프로젝트', value: counts.projects, to: '/projects' },
    { label: '글', value: counts.posts, to: '/blog' },
  ].filter((item) => item.value > 0);

  if (items.length === 0) return null;

  return (
    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-y border-border py-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="eyebrow">{item.label}</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            <Link to={item.to} className="transition-colors hover:text-brand">
              {String(item.value).padStart(2, '0')}
            </Link>
          </dd>
        </div>
      ))}
    </dl>
  );
}
