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
    return <p className="t-body py-4 text-muted-foreground">아직 등록된 논문 리뷰가 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-border border-t border-border">
      {papers.map((paper) => (
        <li key={paper.id} className="flex items-start gap-3">
          <Link to={`/papers/${paper.id}`} className="group flex flex-1 gap-4 py-5 sm:gap-6">
            {/*
             * 넓은 화면에서는 날짜를 왼쪽 고정 열로 뺀다 — 줄이 맞아 표처럼 훑힌다 (EP-0009).
             * 좁은 화면에서는 그 열이 사라지고 제목 옆으로 붙는다.
             */}
            <time className="t-label hidden w-24 shrink-0 pt-1 text-muted-foreground tabular-nums sm:block">
              {formatDate(paper.readOn)}
            </time>
            <span
              aria-hidden="true"
              className="mt-[0.7rem] h-[3px] w-3 shrink-0 rounded-full bg-brand sm:hidden"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[1.0625rem] font-semibold tracking-tight transition-colors group-hover:text-brand">
                  {paper.title}
                </span>
                <time className="t-label shrink-0 text-muted-foreground tabular-nums sm:hidden">
                  {formatDate(paper.readOn)}
                </time>
              </div>
              <p className="t-label text-muted-foreground">
                {[paper.authors.join(', '), paper.venue, paper.year].filter(Boolean).join(' · ')}
              </p>
              {paper.summary ? (
                <p className="t-body max-w-[62ch] text-muted-foreground">{paper.summary}</p>
              ) : null}
            </div>
          </Link>
          {editing.renderItemAction ? (
            <div className="pt-5">{editing.renderItemAction('paper', paper.id)}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
