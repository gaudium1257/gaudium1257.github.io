import { useParams } from 'react-router-dom';
import { Separator } from '@portfolio/ui';
import { usePortfolioContent } from '../state/use-content';
import { findById, formatDate } from '../service/select';
import { Markdown } from './Markdown';
import { BackLink, NotFoundNotice, TagList } from './common';

export function BlogDetailPage() {
  const { id = '' } = useParams();
  const { posts } = usePortfolioContent();
  const post = findById(posts, id);

  if (!post) return <NotFoundNotice message="찾을 수 없는 글입니다." />;

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
        <time className="text-sm text-muted-foreground">{formatDate(post.publishedOn)}</time>
      </header>

      <TagList tags={post.tags} />

      {post.body ? (
        <>
          <Separator />
          <Markdown>{post.body}</Markdown>
        </>
      ) : null}

      <BackLink />
    </article>
  );
}
