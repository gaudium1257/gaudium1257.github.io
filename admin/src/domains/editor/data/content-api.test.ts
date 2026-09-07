import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContentApiError, deleteEntry } from './content-api';

/**
 * 삭제는 파일을 지운다 — 잘못된 요청이 나가면 엉뚱한 항목이 사라진다.
 * 메서드와 인코딩만큼은 고정해 둔다 (EP-0003).
 */

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(response: { ok: boolean; body: unknown }) {
  const calls: Array<{ url: string; method?: string }> = [];
  vi.stubGlobal('fetch', (url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method });
    return Promise.resolve({
      ok: response.ok,
      status: 500,
      json: () => Promise.resolve(response.body),
    });
  });
  return calls;
}

describe('deleteEntry', () => {
  it('DELETE 로 kind 와 id 를 보낸다', async () => {
    const calls = stubFetch({ ok: true, body: { ok: true, path: 'content/posts/a.json' } });
    const path = await deleteEntry('post', 'a');

    expect(path).toBe('content/posts/a.json');
    expect(calls[0]?.method).toBe('DELETE');
    expect(calls[0]?.url).toBe('/api/content?kind=post&id=a');
  });

  it('id 를 인코딩한다 — 경로가 새어나가지 않는다', async () => {
    const calls = stubFetch({ ok: true, body: { ok: true, path: 'x' } });
    await deleteEntry('post', '../secret');

    expect(calls[0]?.url).toBe('/api/content?kind=post&id=..%2Fsecret');
  });

  it('실패를 삼키지 않는다', async () => {
    stubFetch({ ok: false, body: { error: '없는 항목입니다.' } });
    await expect(deleteEntry('post', 'nothing')).rejects.toThrow(ContentApiError);
  });
});
