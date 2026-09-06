import { Link } from 'react-router-dom';
import { Badge } from '@portfolio/ui';

/** 페이지 제목 + 설명. 다섯 페이지가 같은 리듬을 갖게 한다. */
export function PageHeading({ title, description }: { title: string; description?: string }) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </header>
  );
}

/** 없는 항목 안내 (스펙 C-4) */
export function NotFoundNotice({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Link to="/" className="text-sm underline underline-offset-4">
        홈으로
      </Link>
    </div>
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

export function BackLink() {
  return (
    <Link to="/" className="inline-block text-sm underline underline-offset-4">
      ← 홈으로
    </Link>
  );
}
