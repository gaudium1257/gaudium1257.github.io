import type { Profile } from '@portfolio/content';
import type { EditingSlots } from '../types';

interface Props {
  profile: Profile;
  editing?: EditingSlots;
}

/**
 * 첫 화면 (스펙 H-1). 심사자가 30초 안에 파악해야 할 것만 담는다.
 *
 * 작은 라벨 → 괘선 → 이름 → 한 줄 소개 → 링크.
 *
 * **실적 숫자는 두지 않는다** (EP-0009). 항목이 한두 개일 때 숫자를 크게 걸면
 * 적다는 사실이 강조된다. 셀 수 있는 목록이 바로 아래 있다.
 *
 * **자기소개글은 여기 두지 않는다.** 홈은 30초 안에 훑는 화면인데(H-1)
 * 긴 글이 들어오면 그 전제가 깨진다. 자기소개는 About 이 갖는다 (A-1).
 */
export function Hero({ profile, editing = {} }: Props) {
  return (
    <section className="pb-8">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
        <p className="eyebrow">Portfolio</p>
        {editing.renderItemAction?.('profile', 'profile')}
      </div>

      <h1 className="mt-6 text-[2.75rem] leading-[1.1] font-bold tracking-tight sm:text-6xl">
        {profile.name}
      </h1>
      <p className="t-lead mt-4 max-w-[52ch] text-muted-foreground">{profile.headline}</p>

      {profile.links.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {profile.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="t-meta text-muted-foreground underline underline-offset-4 transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}
