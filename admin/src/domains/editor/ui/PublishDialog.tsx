import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@portfolio/ui';
import type { ChangeDescription } from '../service/describe-change';

const ACTION_VARIANT: Record<ChangeDescription['action'], 'default' | 'secondary' | 'destructive'> =
  {
    추가: 'default',
    수정: 'secondary',
    삭제: 'destructive',
  };

/**
 * 게시 확인 모달 (스펙 P-3).
 *
 * 공개는 되돌리기 비싼 동작이다 — 심사자가 보는 사이트에 나간다.
 * 그래서 **파일 경로가 아니라 제목으로** 무엇이 올라가는지 보여주고 확인을 받는다.
 */
export function PublishDialog({
  open,
  changes,
  publishing,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  changes: ChangeDescription[];
  publishing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>공개할 내용</DialogTitle>
          <DialogDescription>
            아래 {changes.length}건이 공개 사이트에 올라갑니다. 반영까지 약 1분 걸립니다.
          </DialogDescription>
        </DialogHeader>

        <ul className="max-h-72 divide-y divide-border overflow-y-auto rounded-md border border-border">
          {changes.map((change) => (
            <li key={`${change.kindLabel}:${change.id}`} className="flex items-start gap-3 p-3">
              <Badge variant={ACTION_VARIANT[change.action]} className="shrink-0 font-normal">
                {change.action}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{change.title}</p>
                <p className="text-xs text-muted-foreground">{change.kindLabel}</p>
              </div>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={publishing}>
            취소
          </Button>
          <Button onClick={onConfirm} disabled={publishing}>
            {publishing ? '공개하는 중…' : '공개하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
