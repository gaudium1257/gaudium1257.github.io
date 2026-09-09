import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * 섹션 제목 (EP-0006, 시안 07 문서 도구).
 *
 * `## 제목` 형태다: 아이콘 + 굵은 제목 + 아래 실선.
 * 본문 제목과 같은 리듬이라 목록이 문서의 일부처럼 읽힌다.
 */
export function SectionHeading({
  id,
  title,
  icon,
  moreTo,
  action,
}: {
  id: string;
  title: string;
  /** 섹션 아이콘. 없으면 생략된다 */
  icon?: string;
  moreTo?: string;
  /** 편집 모드에서만 채워진다 (ADR-0005) */
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-1.5">
      <h2 id={id} className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {title}
      </h2>
      <div className="flex shrink-0 items-center gap-3">
        {moreTo ? (
          <Link
            to={moreTo}
            className="text-xs text-muted-foreground transition-colors hover:text-brand"
          >
            전체 보기 →
          </Link>
        ) : null}
        {action}
      </div>
    </div>
  );
}
