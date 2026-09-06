import { Link } from 'react-router-dom';
import type { BlogPost } from '@portfolio/content';
import { formatDate } from '../service/select';

export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={`/blog/${post.id}`} className="group block space-y-1.5 py-4">
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
        </li>
      ))}
    </ul>
  );
}
