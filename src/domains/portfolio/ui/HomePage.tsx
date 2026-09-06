import { Separator } from '@/shared/ui';
import { usePortfolioContent } from '../state/use-content';
import { PostList } from './PostList';
import { ProfileHeader } from './ProfileHeader';
import { ProjectCard } from './ProjectCard';

/** 첫 화면의 목표: 30초 안에 "이 사람이 무엇을 할 수 있는가"가 보이는 것 (PRODUCT_SENSE). */
export function HomePage() {
  const { profile, projects, posts } = usePortfolioContent();
  const isEmpty = projects.length === 0 && posts.length === 0;

  return (
    <div className="space-y-12">
      <ProfileHeader profile={profile} />

      {/* 콘텐츠가 없으면 섹션 자체를 숨긴다 (스펙 P-7) */}
      {projects.length > 0 ? (
        <Section id="projects" title="프로젝트">
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>
      ) : null}

      {posts.length > 0 ? (
        <Section id="posts" title="글">
          <PostList posts={posts} />
        </Section>
      ) : null}

      {isEmpty ? (
        <>
          <Separator />
          <p className="text-sm text-muted-foreground">
            아직 공개된 콘텐츠가 없습니다. 관리자 모드에서 추가할 수 있습니다.
          </p>
        </>
      ) : null}
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-4">
      <h2 id={`${id}-heading`} className="text-sm font-semibold tracking-wide uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
