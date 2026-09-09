import type { EditingSlots, PortfolioContent } from '../types';
import { PageHeading } from './common';
import { ProjectList } from './ProjectList';
import { SECTION_ICONS, sectionLabel } from '../config';

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
        title={sectionLabel('projects')}
        icon={SECTION_ICONS.projects}
        description="만든 것들"
        action={editing.renderAddAction?.('project')}
      />
      <ProjectList projects={content.projects} editing={editing} />
    </div>
  );
}
