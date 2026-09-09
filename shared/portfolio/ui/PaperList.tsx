import { Link } from 'react-router-dom';
import type { PaperReview } from '@portfolio/content';
import { SECTION_ICONS } from '../config';
import { formatDate } from '../service/select';
import type { EditingSlots } from '../types';

export function PaperList({
  papers,
  editing = {},
}: {
  papers: PaperReview[];
  editing?: EditingSlots;
}) {
  if (papers.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">아직 등록된 논문 리뷰가 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {papers.map((paper) => (
        <li key={paper.id} className="flex items-start gap-3">
          <Link to={`/papers/${paper.id}`} className="group flex flex-1 gap-3 py-3">
            {/* 문서 블록의 머리 아이콘 — 목차와 같은 기호라 어디에 속한 줄인지 바로 읽힌다 */}
            <span aria-hidden="true" className="pt-0.5 text-base">
              {SECTION_ICONS.papers}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium transition-colors group-hover:text-brand">
                  {paper.title}
                </span>
                <time className="text-xs text-muted-foreground tabular-nums">
                  {formatDate(paper.readOn)}
                </time>
              </div>
              <p className="text-xs text-muted-foreground">
                {[paper.authors.join(', '), paper.venue, paper.year].filter(Boolean).join(' · ')}
              </p>
              {paper.summary ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{paper.summary}</p>
              ) : null}
            </div>
          </Link>
          {editing.renderItemAction ? (
            <div className="pt-3">{editing.renderItemAction('paper', paper.id)}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
