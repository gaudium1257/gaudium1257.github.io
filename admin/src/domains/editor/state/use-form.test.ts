import { describe, expect, it } from 'vitest';
import { toPayload } from './use-form';

/**
 * id 는 파일 이름이자 URL 이다. 기존 항목의 id 가 바뀐 채로 저장되면
 * **새 파일이 생기고 원본이 남는다** — 사본이 늘고 이미 나간 링크가 깨진다.
 *
 * 입력을 disabled 로 잠그는 것은 화면일 뿐이다. 진짜 강제는 여기서 한다.
 */

describe('toPayload — id 고정', () => {
  it('기존 항목은 폼에서 id 가 바뀌어도 원래 id 로 저장한다', () => {
    const payload = toPayload(
      'post',
      { id: '바꿔치기', title: '제목', date: '2026-01-01', visibility: 'public' },
      'original-id',
    );
    expect(payload.id).toBe('original-id');
  });

  it('새 항목은 입력한 id 를 그대로 쓴다', () => {
    const payload = toPayload(
      'post',
      { id: 'my-new-post', title: '제목', date: '2026-01-01', visibility: 'public' },
      '',
    );
    expect(payload.id).toBe('my-new-post');
  });

  it('id 를 고정해도 다른 필드는 편집한 값이 간다', () => {
    const payload = toPayload(
      'post',
      { id: '무시됨', title: '고친 제목', date: '2026-01-01', visibility: 'private' },
      'original-id',
    );
    expect(payload.title).toBe('고친 제목');
    expect(payload.visibility).toBe('private');
  });

  it('프로필에는 id 필드가 없으므로 아무 일도 일어나지 않는다', () => {
    const payload = toPayload('profile', { name: '김태호', headline: '', intro: '' }, 'profile');
    expect(payload.id).toBeUndefined();
    expect(payload.name).toBe('김태호');
  });

  it('비운 nullable 필드는 여전히 null 로 간다 — 진행 중인 프로젝트', () => {
    const payload = toPayload(
      'project',
      { id: 'p', title: 't', role: '', startedOn: '2026-01-01', endedOn: '' },
      'p',
    );
    expect(payload.endedOn).toBeNull();
  });
});
