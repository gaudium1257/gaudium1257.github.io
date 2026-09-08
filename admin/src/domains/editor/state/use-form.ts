import { useCallback, useEffect, useState } from 'react';
import type { ContentKind } from '@portfolio/content';
import { FORM_FIELDS, type FieldValue } from '../config/forms';
import { ContentApiError, readEntry, writeEntry } from '../data/content-api';
import { templateFor, validateContent } from '../service/validate';

export type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'invalid'; issues: string[] }
  | { status: 'error'; message: string }
  | { status: 'saved'; path: string };

export type FormValues = Record<string, FieldValue>;

/** 저장된 JSON → 폼 값. 없는 필드는 템플릿 기본값으로 채운다. */
function toFormValues(kind: ContentKind, raw: unknown): FormValues {
  const source = (raw ?? {}) as Record<string, unknown>;
  const fallback = JSON.parse(templateFor(kind)) as Record<string, unknown>;
  const values: FormValues = {};
  for (const field of FORM_FIELDS[kind]) {
    const found = source[field.name] ?? fallback[field.name] ?? null;
    values[field.name] = found as FieldValue;
  }
  return values;
}

/**
 * 빈 문자열은 저장 전에 정리한다 — 비운 날짜는 null 이어야 스키마를 통과한다.
 *
 * `lockedId` 가 있으면(= 기존 항목을 수정 중이면) immutable 필드를 원래 값으로 되돌린다.
 * id 는 **파일 이름이자 URL** 이라, 바뀐 채로 저장하면 새 파일이 생기고 원본이 남는다 —
 * 사본이 조용히 늘고 기존 링크가 깨진다. 입력을 잠그는 것만으로는 부족해 여기서 강제한다.
 */
export function toPayload(
  kind: ContentKind,
  values: FormValues,
  lockedId: string,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const field of FORM_FIELDS[kind]) {
    const value = values[field.name];
    if (field.immutable && lockedId) {
      payload[field.name] = lockedId;
      continue;
    }
    payload[field.name] = field.nullable && value === '' ? null : value;
  }
  return payload;
}

/**
 * 폼 상태 — 불러오기·검증·저장 순서를 담당한다 (INV-1: ui 는 렌더만).
 * 검증은 JSON 편집기 때와 **같은 경로**를 쓴다: 스키마가 유일한 판단자다.
 */
export function useContentForm(kind: ContentKind, id: string) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(kind, null));
  const [state, setState] = useState<SaveState>({ status: 'idle' });
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setState({ status: 'idle' });
    setLoadError(null);
    if (!id) {
      setValues(toFormValues(kind, null));
      return;
    }
    try {
      const json = await readEntry(kind, id);
      setValues(toFormValues(kind, json ? (JSON.parse(json) as unknown) : null));
    } catch (e) {
      setLoadError(e instanceof ContentApiError ? e.message : '불러오지 못했습니다.');
    }
  }, [kind, id]);

  useEffect(() => {
    void load();
  }, [load]);

  const setField = useCallback((name: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setState({ status: 'idle' });
  }, []);

  const save = useCallback(async () => {
    const payload = toPayload(kind, values, id);
    const result = validateContent(kind, JSON.stringify(payload));
    if (!result.ok) {
      setState({ status: 'invalid', issues: result.issues });
      return null;
    }

    const targetId = kind === 'profile' ? 'profile' : String(payload.id ?? '');
    if (!targetId) {
      setState({ status: 'invalid', issues: ['id 가 비어 있습니다.'] });
      return null;
    }

    setState({ status: 'saving' });
    try {
      const path = await writeEntry(kind, targetId, result.json);
      setState({ status: 'saved', path });
      return targetId;
    } catch (e) {
      setState({
        status: 'error',
        message: e instanceof ContentApiError ? e.message : '저장에 실패했습니다.',
      });
      return null;
    }
  }, [kind, values, id]);

  return { values, setField, state, loadError, load, save };
}
