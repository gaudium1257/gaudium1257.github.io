import { Link } from 'react-router-dom';
import type { BlogPost } from '@portfolio/content';
import { formatDate } from '../service/select';
import type { EditingSlots } from '../types';

export function PostList({ posts, editing = {} }: { posts: BlogPost[]; editing?: EditingSlots }) {
  if (posts.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">아직 등록된 글이 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-border border-t border-border">
      {posts.map((post, i) => (
        <li key={post.id} className="flex items-start gap-3">
          <Link to={`/blog/${post.id}`} className="group flex flex-1 gap-3 py-3">
            <span aria-hidden="true" className="hanging-index w-6 shrink-0 pt-1 text-[0.7rem]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
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
            </div>
          </Link>
          {editing.renderItemAction ? (
            <div className="pt-3">{editing.renderItemAction('post', post.id)}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
