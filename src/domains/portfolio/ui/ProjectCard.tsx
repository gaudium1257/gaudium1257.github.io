import { Link } from 'react-router-dom';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { formatPeriod } from '../service/select';
import type { Project } from '@/shared/content';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="transition-colors hover:border-foreground/30">
      <CardHeader>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <CardTitle className="text-base">
            <Link to={`/projects/${project.id}`} className="hover:underline">
              {project.title}
            </Link>
          </CardTitle>
          <time className="text-xs text-muted-foreground">
            {formatPeriod(project.startedOn, project.endedOn)}
          </time>
        </div>
        {project.role ? <p className="text-xs text-muted-foreground">{project.role}</p> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {project.summary ? <p className="text-sm">{project.summary}</p> : null}
        {project.stack.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li key={tech}>
                <Badge variant="secondary">{tech}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
