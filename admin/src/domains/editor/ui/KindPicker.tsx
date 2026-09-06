import { Button, Input } from '@portfolio/ui';
import type { ContentKind } from '@portfolio/content';
import { EDITABLE_KINDS } from '../config';

export function KindTabs({
  kind,
  onSelect,
}: {
  kind: ContentKind;
  onSelect: (kind: ContentKind) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {EDITABLE_KINDS.map((item) => (
        <Button
          key={item.kind}
          size="sm"
          variant={item.kind === kind ? 'default' : 'outline'}
          aria-pressed={item.kind === kind}
          onClick={() => onSelect(item.kind)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}

export function IdInput({ id, onChange }: { id: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-2">
      <Input
        value={id}
        onChange={(e) => onChange(e.target.value)}
        placeholder="새 항목 id"
        aria-label="항목 id"
        className="h-9"
      />
      <Button size="sm" variant="outline" onClick={() => onChange('')}>
        새로
      </Button>
    </div>
  );
}
