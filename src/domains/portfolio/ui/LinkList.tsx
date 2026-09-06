import { Badge } from '@/shared/ui';
import type { Link as ContentLink } from '@/shared/content';

export function LinkList({ links }: { links: ContentLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm underline underline-offset-4"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag}>
          <Badge variant="secondary">{tag}</Badge>
        </li>
      ))}
    </ul>
  );
}
