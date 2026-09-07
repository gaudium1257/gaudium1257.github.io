import type { ReactNode } from 'react';
import { Label } from '@portfolio/ui';
import type { FieldSpec } from '../../config/forms';

/** 모든 필드가 같은 리듬을 갖게 한다 — 라벨·도움말·오류 위치가 고정이다. */
export function FieldShell({
  spec,
  htmlFor,
  children,
}: {
  spec: FieldSpec;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <Label htmlFor={htmlFor}>{spec.label}</Label>
        {spec.optional ? (
          <span className="text-xs text-muted-foreground">선택</span>
        ) : (
          <span className="text-xs text-brand">필수</span>
        )}
      </div>
      {children}
      {spec.help ? <p className="text-xs text-muted-foreground">{spec.help}</p> : null}
    </div>
  );
}
