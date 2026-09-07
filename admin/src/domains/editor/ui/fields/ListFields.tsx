import { Badge, Button, Input } from '@portfolio/ui';
import { useState } from 'react';
import type { Link } from '@portfolio/content';

/**
 * 문자열 목록 (태그·저자·기술 스택).
 * 칩으로 보여주고 Enter 로 추가한다 — 쉼표 규칙을 외우게 하지 않는다.
 */
export function StringListField({
  id,
  values,
  onChange,
}: {
  id: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  function add() {
    const value = draft.trim();
    if (!value || values.includes(value)) {
      setDraft('');
      return;
    }
    onChange([...values, value]);
    setDraft('');
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="입력 후 Enter"
        />
        <Button type="button" size="sm" variant="outline" onClick={add}>
          추가
        </Button>
      </div>
      <Chips values={values} onRemove={(index) => onChange(values.filter((_, i) => i !== index))} />
    </div>
  );
}

function Chips({ values, onRemove }: { values: string[]; onRemove: (index: number) => void }) {
  if (values.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {values.map((value, index) => (
        <li key={value}>
          <Badge variant="secondary" className="gap-1.5 font-normal">
            {value}
            <button
              type="button"
              aria-label={`${value} 제거`}
              onClick={() => onRemove(index)}
              className="text-muted-foreground hover:text-destructive"
            >
              ×
            </button>
          </Badge>
        </li>
      ))}
    </ul>
  );
}

/** 링크 목록 (라벨 + URL). 행 단위로 추가·삭제한다. */
export function LinkListField({
  id,
  values,
  onChange,
}: {
  id: string;
  values: Link[];
  onChange: (next: Link[]) => void;
}) {
  function update(index: number, patch: Partial<Link>) {
    onChange(values.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-2">
      {values.map((link, index) => (
        <div key={index} className="flex flex-wrap gap-2">
          <Input
            aria-label={`링크 ${index + 1} 이름`}
            value={link.label}
            onChange={(e) => update(index, { label: e.target.value })}
            placeholder="GitHub"
            className="w-32"
          />
          <Input
            aria-label={`링크 ${index + 1} 주소`}
            value={link.url}
            onChange={(e) => update(index, { url: e.target.value })}
            placeholder="https://..."
            className="min-w-0 flex-1"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={`링크 ${index + 1} 제거`}
            onClick={() => onChange(values.filter((_, i) => i !== index))}
          >
            삭제
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        id={id}
        onClick={() => onChange([...values, { label: '', url: '' }])}
      >
        + 링크 추가
      </Button>
    </div>
  );
}
