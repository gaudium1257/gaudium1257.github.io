import { Input, Textarea, cn } from '@portfolio/ui';
import type { FieldSpec, FieldValue } from '../../config/forms';

export const asText = (value: FieldValue): string =>
  value === null || value === undefined ? '' : String(value);

interface ScalarProps {
  id: string;
  spec: FieldSpec;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
}

/** 긴 본문. notes·body 는 실제로 길게 쓰므로 더 크게 준다. */
export function MarkdownField({ id, spec, value, onChange }: ScalarProps) {
  const long = spec.name === 'notes' || spec.name === 'body';
  return (
    <Textarea
      id={id}
      value={asText(value)}
      onChange={(e) => onChange(e.target.value)}
      rows={long ? 12 : 4}
      placeholder={spec.placeholder}
      className="font-mono text-xs leading-relaxed"
    />
  );
}

/** 비우면 null — 그래야 '진행 중'이 스키마를 통과한다 */
export function DateField({ id, spec, value, onChange }: ScalarProps) {
  return (
    <Input
      id={id}
      type="date"
      value={asText(value)}
      onChange={(e) => onChange(e.target.value || (spec.nullable ? null : ''))}
      className="w-48"
    />
  );
}

export function NumberField({ id, spec, value, onChange }: ScalarProps) {
  return (
    <Input
      id={id}
      type="number"
      value={asText(value)}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '') return onChange(spec.nullable ? null : 0);
        onChange(Number(raw));
      }}
      className="w-32"
    />
  );
}

export function SelectField({ id, spec, value, onChange }: ScalarProps) {
  return (
    <select
      id={id}
      value={asText(value)}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-9 rounded-md border border-input bg-background px-3 text-sm',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
      )}
    >
      {spec.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function TextField({ id, spec, value, onChange }: ScalarProps) {
  return (
    <Input
      id={id}
      value={asText(value)}
      onChange={(e) => onChange(e.target.value || (spec.nullable ? null : ''))}
      placeholder={spec.placeholder}
    />
  );
}
