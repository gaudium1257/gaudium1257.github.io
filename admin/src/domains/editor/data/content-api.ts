import { z } from 'zod';
import { CONTENT_API } from '../config';
import type { ContentKind } from '@portfolio/content';

/**
 * 개발 서버 미들웨어와의 경계 (ADR-0003).
 * 파일시스템은 미들웨어가 만진다 — 앱은 HTTP 로만 말한다.
 * 응답을 추측하지 않고 경계에서 파싱한다 (INV-3).
 */

const listResponseSchema = z.object({
  items: z.array(z.object({ id: z.string(), title: z.string() })),
});
const readResponseSchema = z.object({ json: z.string().nullable() });
const writeResponseSchema = z.object({ ok: z.literal(true), path: z.string() });
const errorResponseSchema = z.object({ error: z.string(), issues: z.array(z.string()).optional() });

export class ContentApiError extends Error {
  readonly issues: string[];
  constructor(message: string, issues: string[] = []) {
    super(message);
    this.name = 'ContentApiError';
    this.issues = issues;
  }
}

/** 실패를 삼키지 않고 원인을 구분해 올린다 (GR-4, 스펙 E-4) */
async function request(url: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ContentApiError('개발 서버에 연결할 수 없습니다. npm run dev:admin 이 떠 있나요?');
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const parsed = errorResponseSchema.safeParse(body);
    if (parsed.success) throw new ContentApiError(parsed.data.error, parsed.data.issues ?? []);
    throw new ContentApiError(`요청 실패 (${response.status})`);
  }
  return body;
}

export async function listEntries(kind: ContentKind) {
  const raw = await request(`${CONTENT_API}?kind=${encodeURIComponent(kind)}`);
  return listResponseSchema.parse(raw).items;
}

export async function readEntry(kind: ContentKind, id: string): Promise<string | null> {
  const raw = await request(
    `${CONTENT_API}?kind=${encodeURIComponent(kind)}&id=${encodeURIComponent(id)}`,
  );
  return readResponseSchema.parse(raw).json;
}

export async function writeEntry(kind: ContentKind, id: string, json: string): Promise<string> {
  const raw = await request(CONTENT_API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, id, json }),
  });
  return writeResponseSchema.parse(raw).path;
}

interface ParserLike<T> {
  safeParse: (value: unknown) => { success: boolean; data?: T };
}

/**
 * 한 종류를 통째로 읽어 스키마로 파싱한다 (INV-3).
 * 깨진 항목은 화면 전체를 죽이지 않고 건너뛴다 — 편집 도구는 나머지를 계속 보여줘야 한다.
 */
export async function loadAll<T>(kind: ContentKind, schema: ParserLike<T>): Promise<T[]> {
  const ids = kind === 'profile' ? ['profile'] : (await listEntries(kind)).map((entry) => entry.id);
  const texts = await Promise.all(ids.map((id) => readEntry(kind, id)));

  const items: T[] = [];
  for (const text of texts) {
    if (!text) continue;
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      continue;
    }
    const result = schema.safeParse(raw);
    if (result.success && result.data) items.push(result.data);
  }
  return items;
}
