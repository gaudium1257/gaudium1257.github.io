import { z } from 'zod';
import { PUBLISH_API } from '../config';

/**
 * 게시 API 경계 (ADR-0003 개정). 응답을 추측하지 않고 파싱한다 (INV-3).
 */

const changeSchema = z.object({
  status: z.string(),
  path: z.string(),
  /** 삭제된 항목은 작업트리에 없다 — 서버가 git 에서 꺼내 준다 (EP-0003) */
  deletedTitle: z.string().optional(),
});

const changesResponseSchema = z.object({ changes: z.array(changeSchema) });

const publishResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  reason: z.enum(['nothing', 'conflict', 'auth', 'no-remote', 'failed']).optional(),
  commit: z.string().optional(),
});

export type PendingChange = z.infer<typeof changeSchema>;
export type PublishResponse = z.infer<typeof publishResponseSchema>;

export async function fetchPendingChanges(): Promise<PendingChange[]> {
  const res = await fetch(PUBLISH_API);
  if (!res.ok) return [];
  return changesResponseSchema.parse(await res.json()).changes;
}

const revertResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  reason: z.enum(['nothing', 'unknown-path', 'failed']).optional(),
});

export type RevertResponse = z.infer<typeof revertResponseSchema>;

async function post(url: string, paths?: string[]): Promise<unknown> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paths ? { paths } : {}),
  });
  return res.json();
}

/** `paths` 를 주면 그 항목만 게시한다. 없으면 전체 (EP-0004). */
export async function requestPublish(paths?: string[]): Promise<PublishResponse> {
  try {
    return publishResponseSchema.parse(await post(PUBLISH_API, paths));
  } catch {
    return { ok: false, message: '개발 서버에 연결할 수 없습니다.', reason: 'failed' };
  }
}

/** 미게시 변경을 되돌린다. **되살릴 수 없다** — 확인은 화면이 받는다 (EP-0004). */
export async function requestRevert(paths: string[]): Promise<RevertResponse> {
  try {
    return revertResponseSchema.parse(await post(`${PUBLISH_API}/revert`, paths));
  } catch {
    return { ok: false, message: '개발 서버에 연결할 수 없습니다.', reason: 'failed' };
  }
}
