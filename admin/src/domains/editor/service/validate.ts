import { contentSchemas, type ContentKind } from '@portfolio/content';

/**
 * 저장 전 검증 — 순수 함수. I/O 도 React 도 없다 (INV-1).
 * 검증을 통과하지 못한 값은 절대 파일에 쓰이지 않는다 (INV-3, 스펙 E-2).
 */

export type ValidationResult = { ok: true; json: string } | { ok: false; issues: string[] };

/** JSON 파싱 실패와 스키마 검증 실패를 구분한다 — 사용자에게 다른 문제다 */
export function validateContent(kind: ContentKind, rawJson: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { ok: false, issues: ['JSON 형식이 올바르지 않습니다.'] };
  }

  const result = contentSchemas[kind].safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      issues: result.error.issues.map((i) => `${i.path.join('.') || '(전체)'}: ${i.message}`),
    };
  }

  // 사람이 읽는 diff 가 되도록 안정적으로 직렬화한다
  return { ok: true, json: `${JSON.stringify(result.data, null, 2)}\n` };
}

/** 새 항목의 초기값. 스키마의 필수 필드를 빠짐없이 담는다. */
export function templateFor(kind: ContentKind): string {
  const templates: Record<ContentKind, unknown> = {
    profile: { name: '', headline: '', intro: '', links: [] },
    spec: {
      id: '',
      category: 'education',
      title: '',
      organization: '',
      startedOn: null,
      endedOn: null,
      description: '',
      order: 0,
      visibility: 'public',
    },
    paper: {
      id: '',
      title: '',
      authors: [],
      year: null,
      venue: '',
      paperUrl: null,
      readOn: '2026-01-01',
      summary: '',
      notes: '',
      tags: [],
      visibility: 'public',
    },
    project: {
      id: '',
      title: '',
      role: '',
      startedOn: '2026-01-01',
      endedOn: null,
      summary: '',
      body: '',
      stack: [],
      links: [],
      outcome: '',
      order: 0,
      visibility: 'public',
    },
    post: {
      id: '',
      title: '',
      publishedOn: '2026-01-01',
      summary: '',
      body: '',
      tags: [],
      visibility: 'public',
    },
  };
  return `${JSON.stringify(templates[kind], null, 2)}\n`;
}
