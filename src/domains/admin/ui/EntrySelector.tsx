import { Button, Input, Label } from '@/shared/ui';
import type { ContentKind } from '@/shared/content';

const KINDS: ContentKind[] = ['profile', 'project', 'post'];

interface Props {
  kind: ContentKind;
  id: string;
  onKindChange: (kind: ContentKind) => void;
  onIdChange: (id: string) => void;
}

export function EntrySelector({ kind, id, onKindChange, onIdChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <span className="text-sm font-medium">종류</span>
        <div className="flex gap-1.5">
          {KINDS.map((k) => (
            <Button
              key={k}
              size="sm"
              variant={k === kind ? 'default' : 'outline'}
              aria-pressed={k === kind}
              onClick={() => onKindChange(k)}
            >
              {k}
            </Button>
          ))}
        </div>
      </div>

      {kind !== 'profile' ? (
        <div className="space-y-1.5">
          <Label htmlFor="entry-id">id</Label>
          <Input
            id="entry-id"
            value={id}
            onChange={(e) => onIdChange(e.target.value)}
            placeholder="my-project"
            className="w-56"
          />
        </div>
      ) : null}
    </div>
  );
}
