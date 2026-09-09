import { Link } from 'react-router-dom';
import type { Project } from '@portfolio/content';
import { formatPeriod } from '../service/select';
import type { EditingSlots } from '../types';
import { TagList } from './common';

/**
 * 프로젝트 목록 (EP-0006, 시안 07 문서 도구).
 *
 * 카드 격자를 버리고 논문·글과 같은 문서 블록으로 맞췄다.
 * 좌측 목차가 생겨 본문 폭이 좁아졌으므로, 2단 격자를 유지하면 칸마다 글이 뭉개진다.
 */
export function ProjectList({
  projects,
  editing = {},
}: {
  projects: Project[];
  editing?: EditingSlots;
}) {
  if (projects.length === 0) {
    return <p className="t-body py-4 text-muted-foreground">아직 등록된 프로젝트가 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-border border-t border-border">
      {projects.map((project) => (
        <li key={project.id} className="flex items-start gap-3">
          <Link to={`/projects/${project.id}`} className="group flex flex-1 gap-4 py-5 sm:gap-6">
            {/* 넓은 화면은 날짜 열이 줄을 잡고, 좁은 화면은 가운뎃점이 대신한다 (EP-0009) */}
            <time className="t-label hidden w-24 shrink-0 pt-1 text-muted-foreground tabular-nums sm:block">
              {formatPeriod(project.startedOn, project.endedOn)}
            </time>
            <span
              aria-hidden="true"
              className="mt-[0.7rem] h-[3px] w-3 shrink-0 rounded-full bg-brand sm:hidden"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[1.0625rem] font-semibold tracking-tight transition-colors group-hover:text-brand">
                  {project.title}
                </span>
                <time className="t-label shrink-0 text-muted-foreground tabular-nums sm:hidden">
                  {formatPeriod(project.startedOn, project.endedOn)}
                </time>
              </div>
              {project.role ? (
                <p className="t-label text-muted-foreground">{project.role}</p>
              ) : null}
              {project.summary ? (
                <p className="t-body max-w-[62ch] text-muted-foreground">{project.summary}</p>
              ) : null}
              <TagList tags={project.stack} />
            </div>
          </Link>
          {editing.renderItemAction ? (
            <div className="pt-5">{editing.renderItemAction('project', project.id)}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
