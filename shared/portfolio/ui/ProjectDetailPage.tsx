import { useParams } from 'react-router-dom';
import { findById, formatPeriod } from '../service/select';
import type { PortfolioContent } from '../types';
import { DetailHeader, DetailSection } from './DetailShell';
import { Markdown } from './Markdown';
import { BackLink, NotFoundNotice, TagList } from './common';

/** 외부 링크 묶음. 링크가 없으면 소제목까지 통째로 숨긴다 */
function LinkSection({ links }: { links: { label: string; url: string }[] }) {
  if (links.length === 0) return null;
  return (
    <DetailSection title="링크">
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-brand"
            >
              {link.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}

export function ProjectDetailPage({ content }: { content: PortfolioContent }) {
  const { id = '' } = useParams();
  const { projects } = content;
  const project = findById(projects, id);

  if (!project) return <NotFoundNotice message="찾을 수 없는 프로젝트입니다." />;

  const meta = [formatPeriod(project.startedOn, project.endedOn), project.role]
    .filter(Boolean)
    .join(' · ');

  return (
    <article>
      <DetailHeader eyebrow="Project" title={project.title} meta={meta} />

      {project.summary ? (
        <p className="leading-relaxed text-muted-foreground">{project.summary}</p>
      ) : null}

      {project.stack.length > 0 ? (
        <div className="mt-4">
          <TagList tags={project.stack} />
        </div>
      ) : null}

      {project.body ? (
        <DetailSection title="기록">
          <Markdown>{project.body}</Markdown>
        </DetailSection>
      ) : null}

      {project.outcome ? (
        <DetailSection title="결과">
          <p className="leading-relaxed text-muted-foreground">{project.outcome}</p>
        </DetailSection>
      ) : null}

      <LinkSection links={project.links} />

      <div className="mt-10 border-t border-border pt-5">
        <BackLink />
      </div>
    </article>
  );
}
