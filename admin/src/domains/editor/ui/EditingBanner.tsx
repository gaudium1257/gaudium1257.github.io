import { Button } from '@portfolio/ui';

/**
 * 편집 중임이 항상 보여야 한다 — 공개 화면과 구분되지 않으면 실수한다 (docs/DESIGN.md).
 */
export function EditingBanner({
  error,
  onEditProfile,
}: {
  error: string | null;
  onEditProfile: () => void;
}) {
  return (
    <div className="border-b border-brand/40 bg-brand/10 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-5 py-2 sm:px-8">
        <span className="text-xs font-semibold tracking-wide text-brand uppercase">편집 모드</span>
        <span className="text-xs text-muted-foreground">
          저장하면 content/ 파일이 바뀝니다. 공개는 git push.
        </span>
        <Button size="sm" variant="outline" className="ml-auto" onClick={onEditProfile}>
          프로필 편집
        </Button>
      </div>
      {error ? (
        <p role="alert" className="px-5 pb-2 text-xs text-destructive sm:px-8">
          {error}
        </p>
      ) : null}
    </div>
  );
}
