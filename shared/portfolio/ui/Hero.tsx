import { Link } from 'react-router-dom';
import type { Profile } from '@portfolio/content';

interface Props {
  profile: Profile;
  counts: { papers: number; projects: number; posts: number };
}

/**
 * 첫 화면 (스펙 H-1). 심사자가 30초 안에 파악해야 할 것만 담는다.
 *
 * 숫자는 장식이 아니라 콘텐츠에서 온다 — 실제로 무엇을 얼마나 했는지가 첫 화면에서 보인다.
 */
export function Hero({ profile, counts }: Props) {
  return (
    <section className="space-y-6 pt-2 pb-4">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">{profile.headline}</p>
        {profile.intro ? (
          <p className="max-w-2xl leading-relaxed text-muted-foreground">{profile.intro}</p>
        ) : null}
      </div>

      <Stats counts={counts} />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
        <Link
          to="/about"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          소개 보기
        </Link>
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
    </section>
  );
}

function Stats({ counts }: { counts: Props['counts'] }) {
  const items = [
    { label: '논문 리뷰', value: counts.papers, to: '/papers' },
    { label: '프로젝트', value: counts.projects, to: '/projects' },
    { label: '글', value: counts.posts, to: '/blog' },
  ].filter((item) => item.value > 0);

  if (items.length === 0) return null;

  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">{item.label}</dt>
          <dd className="text-2xl font-semibold tabular-nums">
            <Link to={item.to} className="transition-colors hover:text-brand">
              {item.value}
            </Link>
          </dd>
        </div>
      ))}
    </dl>
  );
}
