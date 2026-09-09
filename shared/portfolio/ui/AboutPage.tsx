import { SPEC_SECTIONS, sectionLabel } from '../config';
import type { EditingSlots, PortfolioContent } from '../types';
import { Markdown } from './Markdown';
import { PageHeading } from './common';
import { SpecSection } from './SpecSection';

/**
 * 자기소개글 (스펙 A-1).
 *
 * **마크다운으로 렌더한다.** 편집 폼이 마크다운으로 받는데 화면이 평문으로 그리면
 * 문단을 나누거나 소제목을 쓴 글이 한 덩어리로 뭉개진다 — 실제로 그랬다.
 *
 * 비어 있을 때: viewer 는 통째로 숨기고, admin 에만 안내를 남긴다.
 * 공개 사이트에 "여기에 소개를 쓰세요" 가 뜨면 안 된다.
 */
function IntroSection({ intro, editing }: { intro: string; editing: EditingSlots }) {
  if (!intro) {
    if (!editing.renderItemAction) return null;
    return (
      <p className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
        자기소개글이 비어 있습니다. 위 <span className="font-medium">수정</span> 을 눌러 프로필의
        <span className="font-medium"> 소개</span> 칸에 쓰면 이 자리에 나옵니다. 마크다운을 씁니다.
      </p>
    );
  }

  return (
    <section aria-labelledby="intro-heading">
      <div className="flex items-baseline gap-4">
        <h2 id="intro-heading" className="shrink-0 text-base font-semibold tracking-tight">
          자기소개
        </h2>
        <span aria-hidden="true" className="rule-trail h-px flex-1" />
      </div>
      <div className="mt-4">
        <Markdown>{intro}</Markdown>
      </div>
    </section>
  );
}

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

      <IntroSection intro={profile.intro} editing={editing} />

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
