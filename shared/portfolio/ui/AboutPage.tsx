import { SPEC_SECTIONS } from '../config';
import type { EditingSlots, PortfolioContent } from '../types';
import { PageHeading } from './common';
import { SpecSection } from './SpecSection';

/** About — 소개 + 스펙 4개 분류 (스펙 A-1~A-4). 빈 분류는 숨긴다. */
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
        title="About"
        description={profile.headline}
        action={editing.renderAddAction?.('spec')}
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
        />
      ))}
    </div>
  );
}
