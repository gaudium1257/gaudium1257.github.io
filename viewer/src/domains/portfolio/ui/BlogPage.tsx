import { usePortfolioContent } from '../state/use-content';
import { PageHeading } from './common';
import { PostList } from './PostList';

export function BlogPage() {
  const { posts } = usePortfolioContent();
  return (
    <div className="space-y-6">
      <PageHeading title="Blog" description="글과 기록" />
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-sm text-muted-foreground">아직 등록된 글이 없습니다.</p>
      )}
    </div>
  );
}
