import { Link } from 'react-router-dom';
import { Badge } from '@/shared/ui';
import { formatDate } from '../service/select';
import type { Post } from '@/shared/content';

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="divide-y">
      {posts.map((post) => (
        <li key={post.id} className="py-3">
          <Link to={`/posts/${post.id}`} className="group block space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium group-hover:underline">{post.title}</span>
              <time className="text-xs text-muted-foreground">{formatDate(post.publishedOn)}</time>
            </div>
            {post.summary ? <p className="text-sm text-muted-foreground">{post.summary}</p> : null}
            <Badge variant="outline">{post.category}</Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
