import { Separator } from '@portfolio/ui';
import { introPreview, preview } from '../service/select';
import { HOME_PREVIEW_COUNT, sectionLabel } from '../config';
import type { ContentKind } from '@portfolio/content';
import type { EditingSlots, PortfolioContent } from '../types';
import { Hero } from './Hero';
import { Link } from 'react-router-dom';
import { PaperList } from './PaperList';
import { PostList } from './PostList';
import { ProjectList } from './ProjectList';
import { SectionHeading } from './SectionHeading';

interface Props {
  content: PortfolioContent;
  editing?: EditingSlots;
}

/**
 * 홈의 자기소개 미리보기 (EP-0008, 스펙 H-2).
 *
 * **첫 문단만** 보여주고 About 으로 넘긴다. 전문을 실으면 홈이 30초 화면이 아니게 되고,
 * About 이 따로 있을 이유도 사라진다. 소개가 비어 있으면 통째로 숨긴다.
 */
function IntroPreview({ intro }: { intro: string }) {
  const text = introPreview(intro);
  if (!text) return null;

  return (
    <section aria-labelledby="intro-preview" className="space-y-3">
      <h2 id="intro-preview" className="eyebrow">
        소개
      </h2>
      <p className="t-lead max-w-[62ch] text-foreground/85">{text}</p>
      <Link
        to="/about"
        className="t-meta inline-block font-medium text-brand underline-offset-4 hover:underline"
      >
        소개 더 보기 →
      </Link>
    </section>
  );
}

/** 홈의 섹션 셋은 형태가 같다. 따로 쓰면 하나만 고쳐 어긋난다 */
function PreviewSection({
  id,
  label,
  count,
  kind,
  editing,
  children,
}: {
  id: string;
  label: string;
  count: number;
  kind: ContentKind;
  editing: EditingSlots;
  children: React.ReactNode;
}) {
  if (count === 0 && !editing.renderAddAction) return null;
  const to = kind === 'post' ? '/blog' : `/${kind}s`;

  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-4">
      <SectionHeading
        id={`${id}-heading`}
        title={label}
        moreTo={to}
        action={editing.renderAddAction?.(kind)}
      />
      {children}
    </section>
  );
}

/** Home 은 요약이다. 전체는 각 섹션에 있다 (스펙 H-1~H-6, PRODUCT_SENSE). */
export function HomePage({ content, editing = {} }: Props) {
  const { profile, papers, projects, posts } = content;
  const isEmpty = papers.length === 0 && projects.length === 0 && posts.length === 0;

  return (
    <div className="space-y-14">
      <Hero profile={profile} editing={editing} />

      <IntroPreview intro={profile.intro} />

      {/* 편집 중에는 비어 있어도 섹션을 보여준다 — 그래야 첫 항목을 추가할 수 있다 */}
      <PreviewSection
        id="papers"
        label={sectionLabel('papers')}
        count={papers.length}
        editing={editing}
        kind="paper"
      >
        <PaperList papers={preview(papers, HOME_PREVIEW_COUNT)} editing={editing} />
      </PreviewSection>

      <PreviewSection
        id="projects"
        label={sectionLabel('projects')}
        count={projects.length}
        editing={editing}
        kind="project"
      >
        <ProjectList projects={preview(projects, HOME_PREVIEW_COUNT)} editing={editing} />
      </PreviewSection>

      <PreviewSection
        id="posts"
        label={sectionLabel('blog')}
        count={posts.length}
        editing={editing}
        kind="post"
      >
        <PostList posts={preview(posts, HOME_PREVIEW_COUNT)} editing={editing} />
      </PreviewSection>

      {isEmpty && !editing.renderAddAction ? (
        <>
          <Separator />
          <p className="text-sm text-muted-foreground">아직 공개된 콘텐츠가 없습니다.</p>
        </>
      ) : null}
    </div>
  );
}
