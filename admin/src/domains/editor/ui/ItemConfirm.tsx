import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@portfolio/ui';
import type { ChangeDescription } from '../service/describe-change';

export type ItemAction = 'publish' | 'revert';

/** 복구하면 무엇이 되는지 — 변경 종류마다 결과가 다르다 */
const REVERT_OUTCOME: Record<ChangeDescription['action'], string> = {
  추가: '이 항목이 사라집니다. 아직 한 번도 게시하지 않았습니다.',
  수정: '마지막으로 게시한 내용으로 돌아갑니다.',
  삭제: '지운 항목이 되살아납니다.',
};

/** 게시하면 무엇이 공개되는지 — 삭제를 게시한다는 건 사이트에서 내린다는 뜻이다 */
const PUBLISH_OUTCOME: Record<ChangeDescription['action'], string> = {
  추가: '이 항목이 공개 사이트에 올라갑니다.',
  수정: '고친 내용이 공개 사이트에 반영됩니다.',
  삭제: '이 항목이 공개 사이트에서 내려갑니다.',
};

/**
 * 항목별 동작 확인 (EP-0004).
 *
 * 둘 다 되돌리기 비싼 동작이라 확인을 받되, **위험의 종류가 다르다**:
 *  - 복구: 미게시 편집이 영영 사라진다 (git 에도 없다)
 *  - 게시: 공개 사이트에 나간다. 되돌리려면 다시 게시해야 한다
 */
export function ItemConfirm({
  action,
  change,
  remaining,
  onCancel,
  onConfirm,
}: {
  action: ItemAction;
  change: ChangeDescription | null;
  /** 이번에 함께 나가지 않고 남는 변경 건수 */
  remaining: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const revert = action === 'revert';
  const outcome = change ? (revert ? REVERT_OUTCOME : PUBLISH_OUTCOME)[change.action] : '';

  return (
    <AlertDialog open={change !== null} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {revert ? '이 변경을 되돌릴까요?' : '이 항목만 공개할까요?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {outcome}{' '}
            {revert
              ? '게시하지 않은 편집은 되살릴 수 없습니다.'
              : remaining > 0
                ? `나머지 ${remaining}건은 게시하지 않고 그대로 둡니다. 반영까지 약 1분.`
                : '반영까지 약 1분 걸립니다.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <p className="truncate rounded-md border border-border px-3 py-2.5 font-medium">
          {change?.title}
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction variant={revert ? 'destructive' : 'default'} onClick={onConfirm}>
            {revert ? '되돌리기' : '공개하기'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
