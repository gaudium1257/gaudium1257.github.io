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

/**
 * 삭제 확인 (EP-0003).
 *
 * 게시 모달(`Dialog`)과 달리 `AlertDialog` 를 쓴다 — 파괴적 확인은
 * 보조기술에 다르게 알려야 하고(role=alertdialog), 실수로 진행되면 안 된다.
 * **무엇이 지워지는지 제목으로** 보여준다. 파일명은 답이 아니다.
 */
export function DeleteDialog({
  open,
  title,
  deleting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            게시하기 전까지는 공개 사이트에 그대로 남아 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* 제목을 문장에 끼우면 조사가 '을(를)' 로 어색해진다 — 게시 모달처럼 한 줄로 세운다 */}
        <p className="truncate rounded-md border border-border px-3 py-2.5 font-medium">{title}</p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={deleting} onClick={onConfirm}>
            {deleting ? '삭제하는 중…' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
