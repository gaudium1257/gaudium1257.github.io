import { Link } from 'react-router-dom';
import type { BlogPost } from '@portfolio/content';
import { formatDate } from '../service/select';
import type { EditingSlots } from '../types';

export function PostList({ posts, editing = {} }: { posts: BlogPost[]; editing?: EditingSlots }) {
  if (posts.length === 0) {
    return <p className="t-body py-4 text-muted-foreground">아직 등록된 글이 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-border border-t border-border">
      {posts.map((post) => (
        <li key={post.id} className="flex items-start gap-3">
          <Link to={`/blog/${post.id}`} className="group flex flex-1 gap-4 py-5 sm:gap-6">
            {/* 넓은 화면은 날짜 열이 줄을 잡고, 좁은 화면은 가운뎃점이 대신한다 (EP-0009) */}
            <time className="t-label hidden w-24 shrink-0 pt-1 text-muted-foreground tabular-nums sm:block">
              {formatDate(post.publishedOn)}
            </time>
            <span
              aria-hidden="true"
              className="mt-[0.7rem] h-[3px] w-3 shrink-0 rounded-full bg-brand sm:hidden"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[1.0625rem] font-semibold tracking-tight transition-colors group-hover:text-brand">
                  {post.title}
                </span>
                <time className="t-label shrink-0 text-muted-foreground tabular-nums sm:hidden">
                  {formatDate(post.publishedOn)}
                </time>
              </div>
              {post.summary ? (
                <p className="t-body max-w-[62ch] text-muted-foreground">{post.summary}</p>
              ) : null}
            </div>
          </Link>
          {editing.renderItemAction ? (
            <div className="pt-5">{editing.renderItemAction('post', post.id)}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
