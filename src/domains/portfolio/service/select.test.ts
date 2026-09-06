import { describe, expect, it } from 'vitest';
import type { Post, Project } from '@/shared/content';
import { findProject, formatPeriod, visiblePosts, visibleProjects } from './select';

function project(overrides: Partial<Project>): Project {
  return {
    id: 'p',
    title: '제목',
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
    ...overrides,
  };
}

function post(overrides: Partial<Post>): Post {
  return {
    id: 'x',
    title: '글',
    publishedOn: '2026-01-01',
    category: 'note',
    summary: '',
    body: '',
    projectId: null,
    visibility: 'public',
    ...overrides,
  };
}

describe('visibleProjects', () => {
  it('비공개 항목은 화면에서 제외한다', () => {
    const result = visibleProjects([
      project({ id: 'a' }),
      project({ id: 'b', visibility: 'private' }),
    ]);
    expect(result.map((p) => p.id)).toEqual(['a']);
  });

  it('order 오름차순으로 정렬한다', () => {
    const result = visibleProjects([
      project({ id: 'second', order: 2 }),
      project({ id: 'first', order: 1 }),
    ]);
    expect(result.map((p) => p.id)).toEqual(['first', 'second']);
  });

  it('order 가 같으면 최신 시작일이 앞에 온다', () => {
    const result = visibleProjects([
      project({ id: 'old', startedOn: '2024-01-01' }),
      project({ id: 'new', startedOn: '2026-01-01' }),
    ]);
    expect(result.map((p) => p.id)).toEqual(['new', 'old']);
  });
});

describe('visiblePosts', () => {
  it('최신 글이 먼저 오고 비공개는 제외한다', () => {
    const result = visiblePosts([
      post({ id: 'old', publishedOn: '2025-01-01' }),
      post({ id: 'hidden', publishedOn: '2026-05-01', visibility: 'private' }),
      post({ id: 'new', publishedOn: '2026-01-01' }),
    ]);
    expect(result.map((p) => p.id)).toEqual(['new', 'old']);
  });
});

describe('findProject', () => {
  it('없는 id 는 null 을 돌려준다', () => {
    expect(findProject([project({ id: 'a' })], 'zzz')).toBeNull();
  });
});

describe('formatPeriod', () => {
  it('종료일이 없으면 진행 중으로 표시한다', () => {
    expect(formatPeriod('2026-09-01', null)).toBe('2026.09 — 진행 중');
  });

  it('종료일이 있으면 기간으로 표시한다', () => {
    expect(formatPeriod('2025-03-01', '2026-01-31')).toBe('2025.03 — 2026.01');
  });
});
