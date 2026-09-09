import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * 섹션 제목 (EP-0006, 시안 07 문서 도구).
 *
 * `01 — 제목 ————————— 전체 보기` 형태다.
 * 번호와 괘선이 페이지 전체에 같은 리듬을 준다.
 */
export function SectionHeading({
  id,
  title,
  index,
  moreTo,
  action,
}: {
  id: string;
  title: string;
  /** 목차 번호. 없으면 번호를 숨긴다 */
  index?: number;
  moreTo?: string;
  /** 편집 모드에서만 채워진다 (ADR-0005) */
  action?: ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4">
      {index !== undefined ? (
        <span aria-hidden="true" className="hanging-index text-xs">
          {String(index).padStart(2, '0')}
        </span>
      ) : null}

      <h2 id={id} className="shrink-0 text-lg font-semibold tracking-tight">
        {title}
      </h2>

      {/* 제목과 오른쪽 도구 사이를 괘선으로 잇는다 — 빈 공간이 아니라 선이 지나간다 */}
      <span aria-hidden="true" className="rule-trail h-px min-w-6 flex-1" />

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
