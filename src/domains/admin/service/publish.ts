import { contentSchemas, type ContentKind } from '@/shared/content';

/**
 * 게시 규칙 — 순수 함수. 네트워크도 React 도 없다 (INV-1).
 * 검증을 통과하지 못한 값은 절대 커밋 대상이 되지 않는다 (INV-3, TESTING.md).
 */

export interface ValidationOk {
  ok: true;
  json: string;
}
export interface ValidationFail {
  ok: false;
  issues: string[];
}
export type ValidationResult = ValidationOk | ValidationFail;

/** 입력을 스키마로 검증하고 커밋할 JSON 문자열을 만든다. */
export function prepareContent(kind: ContentKind, input: unknown): ValidationResult {
  const result = contentSchemas[kind].safeParse(input);
  if (!result.success) {
    return {
      ok: false,
      issues: result.error.issues.map((i) => `${i.path.join('.') || '(전체)'}: ${i.message}`),
    };
  }
  // 사람이 읽는 diff 가 되도록 안정적으로 직렬화한다
  return { ok: true, json: `${JSON.stringify(result.data, null, 2)}\n` };
}

export function commitMessage(kind: ContentKind, id: string, isNew: boolean): string {
  const verb = isNew ? 'add' : 'update';
  return `content: ${verb} ${kind} ${id}`;
}

/** JSON 텍스트를 폼이 쓸 수 있는 값으로 되돌린다. 실패는 null 로 구분한다. */
export function parseStoredJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
