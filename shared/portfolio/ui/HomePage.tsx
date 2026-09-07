import { Separator } from '@portfolio/ui';
import { preview } from '../service/select';
import { HOME_PREVIEW_COUNT } from '../config';
import type { EditingSlots, PortfolioContent } from '../types';
import { Hero } from './Hero';
import { PaperList } from './PaperList';
import { PostList } from './PostList';
import { ProjectList } from './ProjectList';
import { SectionHeading } from './SectionHeading';

interface Props {
  content: PortfolioContent;
  editing?: EditingSlots;
}

/** Home 은 요약이다. 전체는 각 섹션에 있다 (스펙 H-1~H-6, PRODUCT_SENSE). */
export function HomePage({ content, editing = {} }: Props) {
  const { profile, papers, projects, posts } = content;
  const isEmpty = papers.length === 0 && projects.length === 0 && posts.length === 0;

  return (
    <div className="space-y-14">
      <Hero
        profile={profile}
        counts={{ papers: papers.length, projects: projects.length, posts: posts.length }}
        editing={editing}
      />

      {/* 편집 중에는 비어 있어도 섹션을 보여준다 — 그래야 첫 항목을 추가할 수 있다 */}
      {papers.length > 0 || editing.renderAddAction ? (
        <section aria-labelledby="papers-heading" className="space-y-4">
          <SectionHeading
            id="papers-heading"
            title="Paper Review"
            moreTo="/papers"
            action={editing.renderAddAction?.('paper')}
          />
          <PaperList papers={preview(papers, HOME_PREVIEW_COUNT)} editing={editing} />
        </section>
      ) : null}

      {projects.length > 0 || editing.renderAddAction ? (
        <section aria-labelledby="projects-heading" className="space-y-4">
          <SectionHeading
            id="projects-heading"
            title="Project"
            moreTo="/projects"
            action={editing.renderAddAction?.('project')}
          />
          <ProjectList projects={preview(projects, HOME_PREVIEW_COUNT)} editing={editing} />
        </section>
      ) : null}

      {posts.length > 0 || editing.renderAddAction ? (
        <section aria-labelledby="posts-heading" className="space-y-4">
          <SectionHeading
            id="posts-heading"
            title="Blog"
            moreTo="/blog"
            action={editing.renderAddAction?.('post')}
          />
          <PostList posts={preview(posts, HOME_PREVIEW_COUNT)} editing={editing} />
        </section>
      ) : null}

      {isEmpty && !editing.renderAddAction ? (
        <>
          <Separator />
          <p className="text-sm text-muted-foreground">아직 공개된 콘텐츠가 없습니다.</p>
        </>
      ) : null}
    </div>
  );
}
