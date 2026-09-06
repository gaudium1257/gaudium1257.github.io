import { Link, useParams } from 'react-router-dom';
import { Badge, Separator } from '@/shared/ui';
import { usePortfolioContent } from '../state/use-content';
import { findPost, findProject, formatDate } from '../service/select';
import { Markdown } from './Markdown';
import { NotFoundNotice } from './NotFoundNotice';

export function PostPage() {
  const { id = '' } = useParams();
  const { posts, projects } = usePortfolioContent();
  const post = findPost(posts, id);

  if (!post) return <NotFoundNotice message="찾을 수 없는 글입니다." />;

  const related = post.projectId ? findProject(projects, post.projectId) : null;

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <time className="text-sm text-muted-foreground">{formatDate(post.publishedOn)}</time>
          <Badge variant="outline">{post.category}</Badge>
        </div>
        {related ? (
          <p className="text-sm text-muted-foreground">
            관련 프로젝트{' '}
            <Link to={`/projects/${related.id}`} className="underline underline-offset-4">
              {related.title}
            </Link>
          </p>
        ) : null}
      </header>

      {post.body ? (
        <>
          <Separator />
          <Markdown>{post.body}</Markdown>
        </>
      ) : null}

      <Link to="/" className="inline-block text-sm underline underline-offset-4">
        ← 목록으로
      </Link>
    </article>
  );
}
