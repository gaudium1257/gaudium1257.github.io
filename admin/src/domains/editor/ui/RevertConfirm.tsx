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

/** 복구하면 무엇이 되는지 — 동작마다 결과가 다르다 */
const OUTCOME: Record<ChangeDescription['action'], string> = {
  추가: '이 항목이 사라집니다. 아직 한 번도 게시하지 않았습니다.',
  수정: '마지막으로 게시한 내용으로 돌아갑니다.',
  삭제: '지운 항목이 되살아납니다.',
};

/**
 * 복구 확인 (EP-0004).
 *
 * **삭제보다 위험하다.** 게시된 항목은 git 에 남아 되살릴 수 있지만,
 * 아직 게시하지 않은 편집은 어디에도 없다 — 여기서 사라지면 끝이다.
 * 그래서 무엇이 없어지는지 동작별로 다르게 말해준다.
 */
export function RevertConfirm({
  change,
  onCancel,
  onConfirm,
}: {
  change: ChangeDescription | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={change !== null} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>이 변경을 되돌릴까요?</AlertDialogTitle>
          <AlertDialogDescription>
            {change ? OUTCOME[change.action] : ''} 게시하지 않은 편집은 되살릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <p className="truncate rounded-md border border-border px-3 py-2.5 font-medium">
          {change?.title}
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            되돌리기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
