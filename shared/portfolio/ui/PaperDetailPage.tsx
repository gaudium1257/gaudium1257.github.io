import { useParams } from 'react-router-dom';
import { findById, formatDate } from '../service/select';
import type { PortfolioContent } from '../types';
import { DetailHeader, DetailSection } from './DetailShell';
import { Markdown } from './Markdown';
import { BackLink, NotFoundNotice, TagList } from './common';

export function PaperDetailPage({ content }: { content: PortfolioContent }) {
  const { id = '' } = useParams();
  const { papers } = content;
  const paper = findById(papers, id);

  if (!paper) return <NotFoundNotice message="찾을 수 없는 논문 리뷰입니다." />;

  const meta = [paper.authors.join(', '), paper.venue, paper.year].filter(Boolean).join(' · ');

  return (
    <article>
      <DetailHeader
        eyebrow="Paper Review"
        title={paper.title}
        meta={meta}
        aside={
          paper.paperUrl ? (
            <a
              href={paper.paperUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-brand"
            >
              원문 보기 ↗
            </a>
          ) : null
        }
      />

      <p className="text-xs text-muted-foreground tabular-nums">
        읽은 날짜 {formatDate(paper.readOn)}
      </p>

      {paper.tags.length > 0 ? (
        <div className="mt-4">
          <TagList tags={paper.tags} />
        </div>
      ) : null}

      {paper.summary ? (
        <DetailSection title="요약">
          <p className="leading-relaxed text-muted-foreground">{paper.summary}</p>
        </DetailSection>
      ) : null}

      {paper.notes ? (
        <DetailSection title="정리">
          <Markdown>{paper.notes}</Markdown>
        </DetailSection>
      ) : null}

      <div className="mt-10 border-t border-border pt-5">
        <BackLink />
      </div>
    </article>
  );
}
