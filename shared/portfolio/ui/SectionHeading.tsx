import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

/** 섹션 제목. 앞의 강조 막대가 페이지 전체에 같은 리듬을 준다 (docs/DESIGN.md). */
export function SectionHeading({
  id,
  title,
  moreTo,
  action,
}: {
  id: string;
  title: string;
  moreTo?: string;
  /** 편집 모드에서만 채워진다 (ADR-0005) */
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="eyebrow-rule text-sm font-semibold tracking-wide uppercase">
        {title}
      </h2>
      <div className="flex items-center gap-3">
        {moreTo ? (
          <Link
            to={moreTo}
            className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-brand"
          >
            전체 보기
          </Link>
        ) : null}
        {action}
      </div>
    </div>
  );
}
