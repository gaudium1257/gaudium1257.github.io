import type { EditingSlots, PortfolioContent } from '../types';
import { PageHeading } from './common';
import { PostList } from './PostList';

export function BlogPage({
  content,
  editing = {},
}: {
  content: PortfolioContent;
  editing?: EditingSlots;
}) {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Blog"
        description="글과 기록"
        action={editing.renderAddAction?.('post')}
      />
      <PostList posts={content.posts} editing={editing} />
    </div>
  );
}
