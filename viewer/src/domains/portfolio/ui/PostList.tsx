import { Link } from 'react-router-dom';
import type { BlogPost } from '@portfolio/content';
import { formatDate } from '../service/select';

export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="divide-y divide-border">
      {posts.map((post) => (
        <li key={post.id} className="py-3">
          <Link to={`/blog/${post.id}`} className="group block space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium group-hover:underline">{post.title}</span>
              <time className="text-xs text-muted-foreground">{formatDate(post.publishedOn)}</time>
            </div>
            {post.summary ? <p className="text-sm text-muted-foreground">{post.summary}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
