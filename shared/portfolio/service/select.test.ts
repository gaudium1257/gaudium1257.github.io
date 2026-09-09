import { describe, expect, it } from 'vitest';
import type { BlogPost, PaperReview, Project, SpecItem } from '@portfolio/content';
import {
  findById,
  formatPeriod,
  preview,
  visiblePapers,
  visiblePosts,
  visibleProjects,
  visibleSpecs,
  introPreview,
} from './select';

const paper = (o: Partial<PaperReview>): PaperReview => ({
  id: 'p',
  title: '논문',
  authors: [],
  year: null,
  venue: '',
  paperUrl: null,
  readOn: '2026-01-01',
  summary: '',
  notes: '',
  tags: [],
  visibility: 'public',
  ...o,
});

const project = (o: Partial<Project>): Project => ({
  id: 'x',
  title: '프로젝트',
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
  ...o,
});

const post = (o: Partial<BlogPost>): BlogPost => ({
  id: 'b',
  title: '글',
  publishedOn: '2026-01-01',
  summary: '',
  body: '',
  tags: [],
  visibility: 'public',
  ...o,
});

const spec = (o: Partial<SpecItem>): SpecItem => ({
  id: 's',
  category: 'education',
  title: '항목',
  organization: '',
  startedOn: null,
  endedOn: null,
  description: '',
  order: 0,
  visibility: 'public',
  ...o,
});

describe('공개 여부', () => {
  it('includePrivate 를 주면 비공개도 포함한다 (admin 전용)', () => {
    expect(
      visiblePapers([paper({ id: 'a', visibility: 'private' })], { includePrivate: true }),
    ).toHaveLength(1);
    expect(
      visibleProjects([project({ id: 'a', visibility: 'private' })], { includePrivate: true }),
    ).toHaveLength(1);
  });

  it('비공개 항목은 화면에서 제외한다', () => {
    expect(
      visiblePapers([paper({ id: 'a' }), paper({ id: 'b', visibility: 'private' })]),
    ).toHaveLength(1);
    expect(visibleProjects([project({ id: 'a', visibility: 'private' })])).toHaveLength(0);
    expect(visiblePosts([post({ id: 'a', visibility: 'private' })])).toHaveLength(0);
    expect(visibleSpecs([spec({ id: 'a', visibility: 'private' })])).toHaveLength(0);
  });
});

describe('정렬', () => {
  it('논문은 읽은 날짜 최신 순이다 (R-4)', () => {
    const result = visiblePapers([
      paper({ id: 'old', readOn: '2025-01-01' }),
      paper({ id: 'new', readOn: '2026-05-01' }),
    ]);
    expect(result.map((p) => p.id)).toEqual(['new', 'old']);
  });

  it('프로젝트는 order 오름차순, 같으면 최신 시작일 순이다', () => {
    const result = visibleProjects([
      project({ id: 'second', order: 2 }),
      project({ id: 'first', order: 1 }),
    ]);
    expect(result.map((p) => p.id)).toEqual(['first', 'second']);
  });

  it('글은 작성일 최신 순이다 (B-1)', () => {
    const result = visiblePosts([
      post({ id: 'old', publishedOn: '2024-01-01' }),
      post({ id: 'new', publishedOn: '2026-01-01' }),
    ]);
    expect(result.map((p) => p.id)).toEqual(['new', 'old']);
  });
});

describe('preview', () => {
  it('Home 은 지정한 개수만 보여준다 (H-3~H-5)', () => {
    expect(preview([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
  });

  it('항목이 적으면 있는 만큼만 준다', () => {
    expect(preview([1], 3)).toEqual([1]);
  });
});

describe('findById', () => {
  it('없는 id 는 null 을 돌려준다 (C-4)', () => {
    expect(findById([project({ id: 'a' })], 'zzz')).toBeNull();
  });
});

describe('formatPeriod', () => {
  it('종료일이 없으면 진행 중으로 표시한다', () => {
    expect(formatPeriod('2026-09-01', null)).toBe('2026.09 — 진행 중');
  });

  it('종료일이 있으면 기간으로 표시한다', () => {
    expect(formatPeriod('2025-03-01', '2026-01-31')).toBe('2025.03 — 2026.01');
  });

  it('시작일이 없으면 빈 문자열이다 (스펙 항목은 기간이 없을 수 있다)', () => {
    expect(formatPeriod(null, null)).toBe('');
  });
});

/**
 * 홈의 소개 미리보기 (EP-0008).
 * 마크다운 기호가 그대로 새어나오면 깨진 글로 읽힌다.
 */
describe('introPreview', () => {
  it('첫 문단만 가져온다', () => {
    expect(introPreview('첫 문단입니다.\n\n둘째 문단입니다.')).toBe('첫 문단입니다.');
  });

  it('마크다운 기호를 떼어낸다', () => {
    expect(introPreview('## 제목\n**굵게** 와 *기울임* 과 `코드`')).toBe(
      '제목 굵게 와 기울임 과 코드',
    );
  });

  it('링크는 문구만 남긴다', () => {
    expect(introPreview('[깃허브](https://github.com) 봐주세요')).toBe('깃허브 봐주세요');
  });

  it('길면 자르고 말줄임을 붙인다', () => {
    const long = '가'.repeat(300);
    const result = introPreview(long, 50);
    expect(result.length).toBeLessThanOrEqual(51);
    expect(result.endsWith('…')).toBe(true);
  });

  it('비어 있으면 빈 문자열이다 — 홈이 그 자리를 숨길 수 있게', () => {
    expect(introPreview('')).toBe('');
    expect(introPreview('   \n\n  ')).toBe('');
  });
});
