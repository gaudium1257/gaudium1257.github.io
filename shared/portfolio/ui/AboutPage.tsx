import { SPEC_SECTIONS, sectionLabel } from '../config';
import type { EditingSlots, PortfolioContent } from '../types';
import { PageHeading } from './common';
import { SpecSection } from './SpecSection';

/**
 * About — 소개 + 스펙 분류 (스펙 A-1~A-4). 빈 분류는 숨긴다.
 *
 * 편집은 **보이는 자리에서** 한다 — 프로필은 소개 옆에서, 스펙 항목은 그 항목 옆에서.
 */
export function AboutPage({
  content,
  editing = {},
}: {
  content: PortfolioContent;
  editing?: EditingSlots;
}) {
  const { profile, specs } = content;

  return (
    <div className="space-y-10">
      <PageHeading
        title={sectionLabel('about')}
        eyebrow="About"
        description={profile.headline}
        action={
          <div className="flex items-center gap-2">
            {editing.renderItemAction?.('profile', 'profile')}
            {editing.renderAddAction?.('spec')}
          </div>
        }
      />

      {profile.intro ? <p className="max-w-3xl leading-relaxed">{profile.intro}</p> : null}

      {profile.links.length > 0 ? (
        <ul className="flex flex-wrap gap-4">
          {profile.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm underline underline-offset-4 transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {SPEC_SECTIONS.map(({ category, label }) => (
        <SpecSection
          key={category}
          category={category}
          label={label}
          items={specs.filter((spec) => spec.category === category)}
          editing={editing}
        />
      ))}
    </div>
  );
}
