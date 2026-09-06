import { describe, expect, it } from 'vitest';
import { commitMessage, parseStoredJson, prepareContent } from './publish';

/**
 * 관리자 쓰기 경로는 보안 경계다 (QUALITY_SCORE.md).
 * 여기서 검증하는 것: 잘못된 값이 커밋 대상이 되지 않는다는 것 (INV-3).
 */

const validProject = {
  id: 'my-project',
  title: '프로젝트',
  startedOn: '2026-01-01',
};

describe('prepareContent', () => {
  it('유효한 프로젝트는 통과하고 기본값을 채운다', () => {
    const result = prepareContent('project', validProject);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const parsed: unknown = JSON.parse(result.json);
    expect(parsed).toMatchObject({ id: 'my-project', visibility: 'public', order: 0 });
  });

  it('id 형식이 틀리면 거부하고 이유를 알려준다', () => {
    const result = prepareContent('project', { ...validProject, id: 'Bad ID!' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join()).toContain('id');
  });

  it('필수 필드가 없으면 거부한다', () => {
    const result = prepareContent('project', { id: 'x' });
    expect(result.ok).toBe(false);
  });

  it('날짜 형식이 틀리면 거부한다', () => {
    const result = prepareContent('project', { ...validProject, startedOn: '2026/01/01' });
    expect(result.ok).toBe(false);
  });

  it('링크가 http(s) 가 아니면 거부한다 — javascript: 스킴 차단', () => {
    const result = prepareContent('profile', {
      name: '이름',
      headline: '소개',
      links: [{ label: 'x', url: 'javascript:alert(1)' }],
    });
    expect(result.ok).toBe(false);
  });

  it('알 수 없는 카테고리는 거부한다', () => {
    const result = prepareContent('post', {
      id: 'p',
      title: '제목',
      publishedOn: '2026-01-01',
      category: 'unknown',
    });
    expect(result.ok).toBe(false);
  });
});

describe('parseStoredJson', () => {
  it('깨진 JSON 은 null 로 구분된다', () => {
    expect(parseStoredJson('{ not json')).toBeNull();
  });

  it('정상 JSON 은 값을 돌려준다', () => {
    expect(parseStoredJson('{"a":1}')).toEqual({ a: 1 });
  });
});

describe('commitMessage', () => {
  it('새 항목과 수정을 구분한다', () => {
    expect(commitMessage('post', 'hello', true)).toBe('content: add post hello');
    expect(commitMessage('post', 'hello', false)).toBe('content: update post hello');
  });
});
