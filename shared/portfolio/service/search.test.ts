import { describe, expect, it } from 'vitest';
import type { BlogPost, PaperReview, Project, SpecItem } from '@portfolio/content';
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
  // 배너가 한국어가 된 뒤로 결과 라벨만 영어면 다른 사이트처럼 읽힌다 (EP-0010)
  it('화면에 보이는 이름과 같은 한국어를 준다', () => {
    expect(kindLabel('paper')).toBe('논문 리뷰');
    expect(kindLabel('project')).toBe('프로젝트');
    expect(kindLabel('post')).toBe('블로그');
    expect(kindLabel('spec')).toBe('소개');
  });
});

/**
 * 스펙 검색 (EP-0010).
 *
 * 검색이 학력·경력을 못 찾으면 심사자가 "이 사람 학력이 뭐였지" 하고
 * 검색했을 때 빈 결과를 본다. About 에 버젓이 있는데도.
 */
const specs: SpecItem[] = [
  {
    id: 'edu-korea',
    category: 'education',
    title: '고려대학교 컴퓨터학과',
    organization: '학사 과정',
    description: '자료구조·알고리즘 중심',
    startedOn: '2026-03-01',
    endedOn: null,
    order: 0,
    visibility: 'public',
  },
  {
    id: 'skill-react',
    category: 'skill',
    title: 'React · TypeScript',
    organization: '',
    description: '프로덕션 수준의 프론트엔드 개발',
    startedOn: null,
    endedOn: null,
    order: 1,
    visibility: 'public',
  },
];

describe('스펙 검색', () => {
  const index = buildIndex({ papers, projects, posts, specs });

  it('학력을 찾는다 — 이전에는 빈 결과였다', () => {
    const hits = search(index, '고려대');
    expect(hits).toHaveLength(1);
    expect(hits[0]?.kind).toBe('spec');
    expect(hits[0]?.title).toBe('고려대학교 컴퓨터학과');
  });

  it('설명으로도 찾는다', () => {
    expect(search(index, '알고리즘').map((h) => h.id)).toEqual(['edu-korea']);
  });

  it('기술 스펙을 찾는다', () => {
    const hits = search(index, '프론트엔드');
    expect(hits.map((h) => h.id)).toContain('skill-react');
  });

  it('About 의 그 항목으로 보낸다 — 섹션 맨 위가 아니라', () => {
    expect(search(index, '고려대')[0]?.path).toBe('/about#spec-edu-korea');
  });

  it('specs 를 넘기지 않아도 동작한다 — 기존 호출부가 깨지지 않는다', () => {
    expect(() => buildIndex({ papers, projects, posts })).not.toThrow();
  });
});
