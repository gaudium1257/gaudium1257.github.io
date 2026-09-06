import { Separator } from '@portfolio/ui';
import { usePortfolioContent } from '../state/use-content';
import { preview } from '../service/select';
import { HOME_PREVIEW_COUNT } from '../config';
import { Hero } from './Hero';
import { PaperList } from './PaperList';
import { PostList } from './PostList';
import { ProjectList } from './ProjectList';
import { SectionHeading } from './SectionHeading';

/** Home 은 요약이다. 전체는 각 섹션에 있다 (스펙 H-1~H-6, PRODUCT_SENSE). */
export function HomePage() {
  const { profile, papers, projects, posts } = usePortfolioContent();
  const isEmpty = papers.length === 0 && projects.length === 0 && posts.length === 0;

  return (
    <div className="space-y-14">
      <Hero
        profile={profile}
        counts={{ papers: papers.length, projects: projects.length, posts: posts.length }}
      />

      {/* 비어 있는 섹션은 통째로 숨긴다 (H-6) */}
      {papers.length > 0 ? (
        <section aria-labelledby="papers-heading" className="space-y-4">
          <SectionHeading id="papers-heading" title="Paper Review" moreTo="/papers" />
          <PaperList papers={preview(papers, HOME_PREVIEW_COUNT)} />
        </section>
      ) : null}

      {projects.length > 0 ? (
        <section aria-labelledby="projects-heading" className="space-y-4">
          <SectionHeading id="projects-heading" title="Project" moreTo="/projects" />
          <ProjectList projects={preview(projects, HOME_PREVIEW_COUNT)} />
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section aria-labelledby="posts-heading" className="space-y-4">
          <SectionHeading id="posts-heading" title="Blog" moreTo="/blog" />
          <PostList posts={preview(posts, HOME_PREVIEW_COUNT)} />
        </section>
      ) : null}

      {isEmpty ? (
        <>
          <Separator />
          <p className="text-sm text-muted-foreground">
            아직 공개된 콘텐츠가 없습니다. admin 에서 추가할 수 있습니다.
          </p>
        </>
      ) : null}
    </div>
  );
}
