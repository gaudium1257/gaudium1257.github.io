import { describe, expect, it } from 'vitest';
import type { BlogPost, PaperReview, Project } from '@portfolio/content';
import { buildIndex, kindLabel, search } from './search';

const papers: PaperReview[] = [
  {
    id: 'attention',
    title: 'Attention Is All You Need',
    authors: ['Vaswani'],
    year: 2017,
    venue: 'NeurIPS',
    paperUrl: null,
    readOn: '2026-09-01',
    summary: 'Transformer 구조를 제안한다',
    notes: '병렬화가 가능해졌다',
    tags: ['NLP'],
    visibility: 'public',
  },
];

const projects: Project[] = [
  {
    id: 'site',
    title: '포트폴리오 사이트',
    role: '개발',
    startedOn: '2026-09-01',
    endedOn: null,
    summary: '정적 사이트',
    body: '',
    stack: ['React'],
    links: [],
    outcome: '',
    order: 1,
    visibility: 'public',
  },
];

const posts: BlogPost[] = [
  {
    id: 'first',
    title: '첫 글',
    publishedOn: '2026-09-06',
    summary: '구조에 대해',
    body: '',
    tags: [],
    visibility: 'public',
  },
];

const index = buildIndex({ papers, projects, posts });

describe('buildIndex', () => {
  it('세 종류를 모두 담는다 (S-2)', () => {
    expect(index).toHaveLength(3);
    expect(new Set(index.map((e) => e.kind))).toEqual(new Set(['paper', 'project', 'post']));
  });

  it('결과가 이동할 경로를 갖는다 (S-3)', () => {
    expect(index.find((e) => e.id === 'attention')?.path).toBe('/papers/attention');
    expect(index.find((e) => e.id === 'site')?.path).toBe('/projects/site');
    expect(index.find((e) => e.id === 'first')?.path).toBe('/blog/first');
  });
});

describe('search', () => {
  it('제목으로 찾는다', () => {
    expect(search(index, 'attention').map((e) => e.id)).toEqual(['attention']);
  });

  it('대소문자를 가리지 않는다', () => {
    expect(search(index, 'ATTENTION')).toHaveLength(1);
  });

  it('본문·태그·저자까지 검색한다', () => {
    expect(search(index, '병렬화')).toHaveLength(1);
    expect(search(index, 'NLP')).toHaveLength(1);
    expect(search(index, 'Vaswani')).toHaveLength(1);
    expect(search(index, 'React')).toHaveLength(1);
  });

  it('여러 단어는 모두 포함해야 한다', () => {
    expect(search(index, 'attention transformer')).toHaveLength(1);
    expect(search(index, 'attention 포트폴리오')).toHaveLength(0);
  });

  it('결과가 없으면 빈 배열이다 (S-5)', () => {
    expect(search(index, 'zzzznotfound')).toEqual([]);
  });

  it('빈 질의는 결과가 없다 — 전체를 쏟아내지 않는다', () => {
    expect(search(index, '')).toEqual([]);
    expect(search(index, '   ')).toEqual([]);
  });

  it('limit 을 넘지 않는다', () => {
    expect(search(index, '', 1)).toHaveLength(0);
    expect(search(index, 'e', 1).length).toBeLessThanOrEqual(1);
  });
});

describe('kindLabel', () => {
  it('사람이 읽는 이름을 준다', () => {
    expect(kindLabel('paper')).toBe('Paper Review');
    expect(kindLabel('project')).toBe('Project');
    expect(kindLabel('post')).toBe('Blog');
  });
});
