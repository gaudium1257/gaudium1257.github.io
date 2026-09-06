import { useParams } from 'react-router-dom';
import { Separator } from '@portfolio/ui';
import { findById, formatDate } from '../service/select';
import type { PortfolioContent } from '../types';
import { Markdown } from './Markdown';
import { BackLink, NotFoundNotice, TagList } from './common';

export function PaperDetailPage({ content }: { content: PortfolioContent }) {
  const { id = '' } = useParams();
  const { papers } = content;
  const paper = findById(papers, id);

  if (!paper) return <NotFoundNotice message="찾을 수 없는 논문 리뷰입니다." />;

  return (
    <article className="max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{paper.title}</h1>
        <p className="text-sm text-muted-foreground">
          {[paper.authors.join(', '), paper.venue, paper.year].filter(Boolean).join(' · ')}
        </p>
        <p className="text-xs text-muted-foreground">읽은 날짜 {formatDate(paper.readOn)}</p>
        {paper.paperUrl ? (
          <a
            href={paper.paperUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-block text-sm underline underline-offset-4"
          >
            원문 보기
          </a>
        ) : null}
      </header>

      <TagList tags={paper.tags} />

      {paper.summary ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide uppercase">요약</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{paper.summary}</p>
        </section>
      ) : null}

      {paper.notes ? (
        <>
          <Separator />
          <section className="space-y-2">
            <h2 className="text-sm font-semibold tracking-wide uppercase">정리</h2>
            <Markdown>{paper.notes}</Markdown>
          </section>
        </>
      ) : null}

      <BackLink />
    </article>
  );
}
