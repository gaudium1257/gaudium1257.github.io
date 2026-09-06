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
    <ul className="divide-y divide-border border-y border-border">
      {papers.map((paper) => (
        <li key={paper.id} className="flex items-start gap-3">
          <Link to={`/papers/${paper.id}`} className="group block flex-1 space-y-1.5 py-4">
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
          </Link>
          {editing.renderItemAction ? (
            <div className="pt-4">{editing.renderItemAction('paper', paper.id)}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
