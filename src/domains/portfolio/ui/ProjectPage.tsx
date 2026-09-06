import { Link, useParams } from 'react-router-dom';
import { Separator } from '@/shared/ui';
import { usePortfolioContent } from '../state/use-content';
import { findProject, formatPeriod } from '../service/select';
import { LinkList, TagList } from './LinkList';
import { Markdown } from './Markdown';
import { NotFoundNotice } from './NotFoundNotice';

export function ProjectPage() {
  const { id = '' } = useParams();
  const { projects } = usePortfolioContent();
  const project = findProject(projects, id);

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

      <LinkList links={project.links} />

      <Link to="/" className="inline-block text-sm underline underline-offset-4">
        ← 목록으로
      </Link>
    </article>
  );
}
