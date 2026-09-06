import { Link } from 'react-router-dom';
import type { BlogPost } from '@portfolio/content';
import { formatDate } from '../service/select';
import type { EditingSlots } from '../types';

export function PostList({ posts, editing = {} }: { posts: BlogPost[]; editing?: EditingSlots }) {
  if (posts.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">아직 등록된 글이 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      {posts.map((post) => (
        <li key={post.id} className="flex items-start gap-3">
          <Link to={`/blog/${post.id}`} className="group block flex-1 space-y-1.5 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium transition-colors group-hover:text-brand">
                {post.title}
              </span>
              <time className="text-xs text-muted-foreground tabular-nums">
                {formatDate(post.publishedOn)}
              </time>
            </div>
            {post.summary ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{post.summary}</p>
            ) : null}
          </Link>
          {editing.renderItemAction ? (
            <div className="pt-4">{editing.renderItemAction('post', post.id)}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
