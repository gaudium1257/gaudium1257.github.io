import { Link } from 'react-router-dom';
import { Separator } from '@portfolio/ui';

import { usePortfolioContent } from '../state/use-content';
import { preview } from '../service/select';
import { HOME_PREVIEW_COUNT } from '../config';
import { PaperList } from './PaperList';
import { PostList } from './PostList';
import { ProjectList } from './ProjectList';

/** Home 은 요약이다. 전체는 각 섹션에 있다 (스펙 H-1~H-6, PRODUCT_SENSE). */
export function HomePage() {
  const { profile, papers, projects, posts } = usePortfolioContent();
  const isEmpty = papers.length === 0 && projects.length === 0 && posts.length === 0;

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="text-lg text-muted-foreground">{profile.headline}</p>
        {profile.intro ? <p className="max-w-2xl text-sm">{profile.intro}</p> : null}
        <Link to="/about" className="inline-block text-sm underline underline-offset-4">
          소개 더 보기
        </Link>
      </header>

      {/* 비어 있는 섹션은 통째로 숨긴다 (H-6) */}
      {papers.length > 0 ? (
        <PreviewSection title="Paper Review" to="/papers">
          <PaperList papers={preview(papers, HOME_PREVIEW_COUNT)} />
        </PreviewSection>
      ) : null}

      {projects.length > 0 ? (
        <PreviewSection title="Project" to="/projects">
          <ProjectList projects={preview(projects, HOME_PREVIEW_COUNT)} />
        </PreviewSection>
      ) : null}

      {posts.length > 0 ? (
        <PreviewSection title="Blog" to="/blog">
          <PostList posts={preview(posts, HOME_PREVIEW_COUNT)} />
        </PreviewSection>
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

function PreviewSection({
  title,
  to,
  children,
}: {
  title: string;
  to: string;
  children: React.ReactNode;
}) {
  const headingId = `${to.replace('/', '')}-heading`;
  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id={headingId} className="text-sm font-semibold tracking-wide uppercase">
          {title}
        </h2>
        <Link to={to} className="text-xs underline underline-offset-4 text-muted-foreground">
          전체 보기
        </Link>
      </div>
      {children}
    </section>
  );
}
