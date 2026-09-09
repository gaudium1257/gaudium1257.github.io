import { useParams } from 'react-router-dom';
import { findById, formatDate } from '../service/select';
import type { PortfolioContent } from '../types';
import { DetailHeader } from './DetailShell';
import { Markdown } from './Markdown';
import { BackLink, NotFoundNotice, TagList } from './common';

export function BlogDetailPage({ content }: { content: PortfolioContent }) {
  const { id = '' } = useParams();
  const { posts } = content;
  const post = findById(posts, id);

  if (!post) return <NotFoundNotice message="찾을 수 없는 글입니다." />;

  return (
    <article>
      <DetailHeader eyebrow="Blog" title={post.title} meta={formatDate(post.publishedOn)} />

      {post.summary ? (
        <p className="leading-relaxed text-muted-foreground">{post.summary}</p>
      ) : null}

      {post.tags.length > 0 ? (
        <div className="mt-4">
          <TagList tags={post.tags} />
        </div>
      ) : null}

      {/* 글은 소제목 없이 본문이 바로 이어진다 — 읽는 흐름을 끊지 않는다 */}
      {post.body ? (
        <div className="mt-8">
          <Markdown>{post.body}</Markdown>
        </div>
      ) : null}

      <div className="mt-10 border-t border-border pt-5">
        <BackLink />
      </div>
    </article>
  );
}
