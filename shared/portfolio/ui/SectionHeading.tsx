import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * 섹션 제목 (EP-0006, 시안 07 문서 도구).
 *
 * `제목 ———————————— 전체 보기` 형태다.
 * 괘선이 페이지 전체에 같은 리듬을 준다. 번호는 쓰지 않는다 — 순서에 의미가 없다 (EP-0009).
 */
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
    <div className="flex items-baseline gap-4">
      <h2 id={id} className="shrink-0 text-xl font-bold tracking-tight">
        {title}
      </h2>

      {/* 제목과 오른쪽 도구 사이를 괘선으로 잇는다 — 빈 공간이 아니라 선이 지나간다 */}
      <span aria-hidden="true" className="rule-trail h-px min-w-6 flex-1" />

      <div className="flex shrink-0 items-center gap-3">
        {moreTo ? (
          <Link
            to={moreTo}
            className="t-label shrink-0 text-muted-foreground transition-colors hover:text-brand"
          >
            전체 보기 →
          </Link>
        ) : null}
        {action}
      </div>
    </div>
  );
}
