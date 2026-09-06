import type { EditingSlots, PortfolioContent } from '../types';
import { PageHeading } from './common';
import { PaperList } from './PaperList';

export function PapersPage({
  content,
  editing = {},
}: {
  content: PortfolioContent;
  editing?: EditingSlots;
}) {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Paper Review"
        description="공부한 논문과 정리"
        action={editing.renderAddAction?.('paper')}
      />
      <PaperList papers={content.papers} editing={editing} />
    </div>
  );
}
