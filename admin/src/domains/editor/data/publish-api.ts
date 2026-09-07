import { z } from 'zod';
import { PUBLISH_API } from '../config';

/**
 * 게시 API 경계 (ADR-0003 개정). 응답을 추측하지 않고 파싱한다 (INV-3).
 */

const changeSchema = z.object({ status: z.string(), path: z.string() });

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

export async function requestPublish(): Promise<PublishResponse> {
  let res: Response;
  try {
    res = await fetch(PUBLISH_API, { method: 'POST' });
  } catch {
    return { ok: false, message: '개발 서버에 연결할 수 없습니다.', reason: 'failed' };
  }
  return publishResponseSchema.parse(await res.json());
}
