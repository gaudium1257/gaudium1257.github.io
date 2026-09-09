import { Link } from 'react-router-dom';
import type { PaperReview } from '@portfolio/content';
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
    <ul className="divide-y divide-border border-t border-border">
      {papers.map((paper, i) => (
        <li key={paper.id} className="flex items-start gap-3">
          <Link to={`/papers/${paper.id}`} className="group flex flex-1 gap-3 py-3">
            {/* 걸린 번호. 목록이 색인처럼 읽히게 하는 장치다 */}
            <span aria-hidden="true" className="hanging-index w-6 shrink-0 pt-1 text-[0.7rem]">
              {String(i + 1).padStart(2, '0')}
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
