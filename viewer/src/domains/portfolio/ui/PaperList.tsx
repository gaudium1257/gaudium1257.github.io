import { Link } from 'react-router-dom';
import type { PaperReview } from '@portfolio/content';
import { formatDate } from '../service/select';

export function PaperList({ papers }: { papers: PaperReview[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {papers.map((paper) => (
        <li key={paper.id}>
          <Link
            to={`/papers/${paper.id}`}
            className="group block space-y-1.5 py-4 transition-colors"
          >
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
        </li>
      ))}
    </ul>
  );
}
