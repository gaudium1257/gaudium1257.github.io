import { Link } from 'react-router-dom';
import type { Project } from '@portfolio/content';
import { formatPeriod } from '../service/select';
import { TagList } from './common';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <article
          key={project.id}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/50"
        >
          {/* 호버 시 위쪽에 강조 막대가 차오른다 — 카드가 눌리는 느낌 대신 반응하는 느낌 */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
          />
          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">
                <Link to={`/projects/${project.id}`} className="after:absolute after:inset-0">
                  {project.title}
                </Link>
              </h3>
              <time className="text-xs text-muted-foreground">
                {formatPeriod(project.startedOn, project.endedOn)}
              </time>
            </div>
            {project.role ? <p className="text-xs text-muted-foreground">{project.role}</p> : null}
            {project.summary ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
            ) : null}
            <TagList tags={project.stack} />
          </div>
        </article>
      ))}
    </div>
  );
}
