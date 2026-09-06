import { usePortfolioContent } from '../state/use-content';
import { PageHeading } from './common';
import { PaperList } from './PaperList';

export function PapersPage() {
  const { papers } = usePortfolioContent();
  return (
    <div className="space-y-6">
      <PageHeading title="Paper Review" description="공부한 논문과 정리" />
      {papers.length > 0 ? (
        <PaperList papers={papers} />
      ) : (
        <p className="text-sm text-muted-foreground">아직 등록된 논문 리뷰가 없습니다.</p>
      )}
    </div>
  );
}
