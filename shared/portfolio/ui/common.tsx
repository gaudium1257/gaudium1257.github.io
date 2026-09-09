import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Badge } from '@portfolio/ui';

/** 페이지 제목 + 설명. 다섯 페이지가 같은 리듬을 갖게 한다. */
export function PageHeading({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  /** 문서 도구 배치의 큰 아이콘 (EP-0006). 없으면 생략된다 */
  icon?: string;
  /** 편집 모드에서만 채워진다 (ADR-0005) */
  action?: ReactNode;
}) {
  return (
    <header className="pb-6">
      {icon ? (
        <div aria-hidden="true" className="text-5xl leading-none">
          {icon}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          {description ? <p className="text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
    </header>
  );
}

/** 없는 항목 안내 (스펙 C-4) */
export function NotFoundNotice({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{message}</p>
      <Link to="/" className="text-sm underline underline-offset-4 hover:text-brand">
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
          <Badge variant="secondary" className="font-normal">
            {tag}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

export function BackLink() {
  return (
    <Link
      to="/"
      className="inline-block text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-brand"
    >
      ← 홈으로
    </Link>
  );
}
