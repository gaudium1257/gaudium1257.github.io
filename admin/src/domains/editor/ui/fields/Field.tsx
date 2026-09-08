import type { Link } from '@portfolio/content';
import type { FieldSpec, FieldValue } from '../../config/forms';
import { FieldShell } from './FieldShell';
import { LinkListField, StringListField } from './ListFields';
import { DateField, MarkdownField, NumberField, SelectField, TextField } from './ScalarFields';

interface Props {
  spec: FieldSpec;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  /** 기존 항목을 수정 중인가 — immutable 필드는 이때 잠긴다 */
  existing?: boolean;
}

/** 명세의 kind 에 따라 입력을 고른다. 새 kind 를 추가하면 여기에 한 줄이 는다. */
export function Field({ spec, value, onChange, existing = false }: Props) {
  const id = `field-${spec.name}`;
  const locked = Boolean(spec.immutable) && existing;
  const scalar = { id, spec, value, onChange, disabled: locked };

  return (
    <FieldShell spec={spec} htmlFor={id} locked={locked}>
      {spec.kind === 'markdown' ? <MarkdownField {...scalar} /> : null}
      {spec.kind === 'date' ? <DateField {...scalar} /> : null}
      {spec.kind === 'number' ? <NumberField {...scalar} /> : null}
      {spec.kind === 'select' ? <SelectField {...scalar} /> : null}
      {spec.kind === 'text' ? <TextField {...scalar} /> : null}
      {spec.kind === 'stringList' ? (
        <StringListField
          id={id}
          values={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      ) : null}
      {spec.kind === 'linkList' ? (
        <LinkListField
          id={id}
          values={Array.isArray(value) ? (value as Link[]) : []}
          onChange={onChange}
        />
      ) : null}
    </FieldShell>
  );
}
