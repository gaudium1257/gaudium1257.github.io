import { describe, expect, it } from 'vitest';
import { templateFor, validateContent } from './validate';

/**
 * 쓰기 경로의 검증은 이 앱의 안전장치다 (QUALITY_SCORE).
 * 여기서 확인하는 것: 잘못된 값이 파일에 쓰이지 않는다는 것.
 */

const validProject = JSON.stringify({
  id: 'my-project',
  title: '프로젝트',
  startedOn: '2026-01-01',
});

describe('validateContent', () => {
  it('유효한 값은 통과하고 기본값을 채운다', () => {
    const result = validateContent('project', validProject);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(JSON.parse(result.json)).toMatchObject({ visibility: 'public', order: 0 });
  });

  it('깨진 JSON 과 스키마 실패를 구분한다', () => {
    const broken = validateContent('project', '{ not json');
    expect(broken.ok).toBe(false);
    if (broken.ok) return;
    expect(broken.issues[0]).toContain('JSON');
  });

  it('id 형식이 틀리면 거부한다', () => {
    const result = validateContent(
      'project',
      JSON.stringify({ id: 'Bad ID!', title: 'x', startedOn: '2026-01-01' }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join()).toContain('id');
  });

  it('필수 필드가 없으면 거부한다', () => {
    expect(validateContent('project', JSON.stringify({ id: 'x' })).ok).toBe(false);
  });

  it('날짜 형식이 틀리면 거부한다', () => {
    const result = validateContent(
      'paper',
      JSON.stringify({ id: 'p', title: 't', readOn: '2026/01/01' }),
    );
    expect(result.ok).toBe(false);
  });

  it('javascript: 링크를 거부한다 (docs/SECURITY.md)', () => {
    const result = validateContent(
      'profile',
      JSON.stringify({
        name: 'n',
        headline: 'h',
        links: [{ label: 'x', url: 'javascript:alert(1)' }],
      }),
    );
    expect(result.ok).toBe(false);
  });

  it('알 수 없는 분류를 거부한다', () => {
    const result = validateContent(
      'spec',
      JSON.stringify({ id: 's', category: 'unknown', title: 't' }),
    );
    expect(result.ok).toBe(false);
  });
});

describe('templateFor', () => {
  it('모든 종류의 템플릿이 유효한 JSON 이다', () => {
    for (const kind of ['profile', 'spec', 'paper', 'project', 'post'] as const) {
      expect(() => JSON.parse(templateFor(kind))).not.toThrow();
    }
  });

  it('템플릿은 id 가 비어 있어 그대로 저장되지 않는다', () => {
    expect(validateContent('project', templateFor('project')).ok).toBe(false);
  });
});
