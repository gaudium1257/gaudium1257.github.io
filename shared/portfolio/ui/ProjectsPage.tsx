import type { EditingSlots, PortfolioContent } from '../types';
import { PageHeading } from './common';
import { ProjectList } from './ProjectList';

export function ProjectsPage({
  content,
  editing = {},
}: {
  content: PortfolioContent;
  editing?: EditingSlots;
}) {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Project"
        description="만든 것들"
        action={editing.renderAddAction?.('project')}
      />
      <ProjectList projects={content.projects} editing={editing} />
    </div>
  );
}
