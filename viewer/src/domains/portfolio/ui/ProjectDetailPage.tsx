import { useParams } from 'react-router-dom';
import { Separator } from '@portfolio/ui';
import { usePortfolioContent } from '../state/use-content';
import { findById, formatPeriod } from '../service/select';
import { Markdown } from './Markdown';
import { BackLink, NotFoundNotice, TagList } from './common';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const { projects } = usePortfolioContent();
  const project = findById(projects, id);

  if (!project) return <NotFoundNotice message="찾을 수 없는 프로젝트입니다." />;

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
        <p className="text-sm text-muted-foreground">
          {formatPeriod(project.startedOn, project.endedOn)}
          {project.role ? ` · ${project.role}` : ''}
        </p>
        {project.summary ? <p className="text-sm">{project.summary}</p> : null}
      </header>

      <TagList tags={project.stack} />

      {project.body ? (
        <>
          <Separator />
          <Markdown>{project.body}</Markdown>
        </>
      ) : null}

      {project.outcome ? (
        <p className="text-sm">
          <span className="font-medium">결과 · </span>
          {project.outcome}
        </p>
      ) : null}

      {project.links.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {project.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm underline underline-offset-4"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <BackLink />
    </article>
  );
}
