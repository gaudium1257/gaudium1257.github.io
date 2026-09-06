import { usePortfolioContent } from '../state/use-content';
import { PageHeading } from './common';
import { ProjectList } from './ProjectList';

export function ProjectsPage() {
  const { projects } = usePortfolioContent();
  return (
    <div className="space-y-6">
      <PageHeading title="Project" description="만든 것들" />
      {projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <p className="text-sm text-muted-foreground">아직 등록된 프로젝트가 없습니다.</p>
      )}
    </div>
  );
}
