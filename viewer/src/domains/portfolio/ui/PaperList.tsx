import { Link } from 'react-router-dom';
import type { PaperReview } from '@portfolio/content';
import { formatDate } from '../service/select';

export function PaperList({ papers }: { papers: PaperReview[] }) {
  return (
    <ul className="divide-y divide-border">
      {papers.map((paper) => (
        <li key={paper.id} className="py-3">
          <Link to={`/papers/${paper.id}`} className="group block space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium group-hover:underline">{paper.title}</span>
              <time className="text-xs text-muted-foreground">{formatDate(paper.readOn)}</time>
            </div>
            <p className="text-xs text-muted-foreground">
              {[paper.authors.join(', '), paper.venue, paper.year].filter(Boolean).join(' · ')}
            </p>
            {paper.summary ? (
              <p className="text-sm text-muted-foreground">{paper.summary}</p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
