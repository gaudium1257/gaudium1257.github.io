import { useState } from 'react';
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
import { RevertConfirm } from './RevertConfirm';

const ACTION_VARIANT: Record<ChangeDescription['action'], 'default' | 'secondary' | 'destructive'> =
  {
    추가: 'default',
    수정: 'secondary',
    삭제: 'destructive',
  };

interface Props {
  open: boolean;
  changes: ChangeDescription[];
  publishing: boolean;
  busyPath: string | null;
  itemError: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  onPublishOne: (path: string) => void;
  onRevertOne: (path: string) => void;
}

/**
 * 게시 확인 모달 (스펙 P-3, EP-0004).
 *
 * 목록이 아니라 **작업대다.** 각 줄에서 그 항목만 복구하거나 게시한다.
 * 공개는 되돌리기 비싼 동작이라, 파일 경로가 아니라 제목으로 보여준다.
 */
export function PublishDialog({
  open,
  changes,
  publishing,
  busyPath,
  itemError,
  onCancel,
  onConfirm,
  onPublishOne,
  onRevertOne,
}: Props) {
  const [pendingRevert, setPendingRevert] = useState<ChangeDescription | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>공개할 내용</DialogTitle>
            <DialogDescription>
              줄마다 따로 복구하거나 게시할 수 있습니다. 반영까지 약 1분 걸립니다.
            </DialogDescription>
          </DialogHeader>

          {itemError ? (
            <p role="alert" className="text-sm text-destructive">
              {itemError}
            </p>
          ) : null}

          <ChangeList
            changes={changes}
            busyPath={busyPath}
            publishing={publishing}
            onPublishOne={onPublishOne}
            onRevertRequest={setPendingRevert}
          />

          <DialogFooter>
            <Button variant="outline" onClick={onCancel} disabled={publishing}>
              닫기
            </Button>
            <Button onClick={onConfirm} disabled={publishing || changes.length === 0}>
              {publishing ? '공개하는 중…' : `전체 공개 (${changes.length}건)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RevertConfirm
        change={pendingRevert}
        onCancel={() => setPendingRevert(null)}
        onConfirm={() => {
          if (pendingRevert) onRevertOne(pendingRevert.path);
          setPendingRevert(null);
        }}
      />
    </>
  );
}

function ChangeList({
  changes,
  busyPath,
  publishing,
  onPublishOne,
  onRevertRequest,
}: {
  changes: ChangeDescription[];
  busyPath: string | null;
  publishing: boolean;
  onPublishOne: (path: string) => void;
  onRevertRequest: (change: ChangeDescription) => void;
}) {
  return (
    <ul className="max-h-80 divide-y divide-border overflow-y-auto rounded-md border border-border">
      {changes.map((change) => (
        <ChangeRow
          key={`${change.kindLabel}:${change.id}`}
          change={change}
          busy={busyPath === change.path || publishing}
          onPublish={() => onPublishOne(change.path)}
          onRevert={() => onRevertRequest(change)}
        />
      ))}
    </ul>
  );
}

function ChangeRow({
  change,
  busy,
  onPublish,
  onRevert,
}: {
  change: ChangeDescription;
  busy: boolean;
  onPublish: () => void;
  onRevert: () => void;
}) {
  return (
    <li className="flex items-center gap-3 p-3">
      <Badge variant={ACTION_VARIANT[change.action]} className="shrink-0 font-normal">
        {change.action}
      </Badge>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{change.title}</p>
        <p className="text-xs text-muted-foreground">{change.kindLabel}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onRevert} disabled={busy}>
          복구
        </Button>
        <Button variant="secondary" size="sm" onClick={onPublish} disabled={busy}>
          {busy ? '…' : '게시'}
        </Button>
      </div>
    </li>
  );
}
