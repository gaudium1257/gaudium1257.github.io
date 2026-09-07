import { describe, expect, it } from 'vitest';
import type { PortfolioContent } from '@portfolio/portfolio';
import { describeChange, describeChanges } from './describe-change';

/**
 * 게시 확인 화면이 파일 경로를 보여주면 사용자는 무엇이 공개되는지 알 수 없다.
 * 제목으로 바뀌는지 검증한다.
 */

const content = {
  profile: { name: '김태호', headline: '', intro: '', links: [] },
  specs: [{ id: 'edu-1', title: '고려대학교 컴퓨터학과' }],
  papers: [{ id: 'attention', title: 'Attention Is All You Need' }],
  projects: [{ id: 'site', title: '포트폴리오 사이트' }],
  posts: [{ id: 'first', title: '첫 글' }],
  searchIndex: [],
} as unknown as PortfolioContent;

describe('describeChange', () => {
  it('논문 경로를 제목으로 바꾼다', () => {
    const result = describeChange({ status: 'M', path: 'content/papers/attention.json' }, content);
    expect(result).toEqual({
      action: '수정',
      kindLabel: '논문 리뷰',
      title: 'Attention Is All You Need',
      id: 'attention',
    });
  });

  it('종류를 구분한다', () => {
    const kinds = [
      ['content/projects/site.json', '프로젝트', '포트폴리오 사이트'],
      ['content/posts/first.json', '글', '첫 글'],
      ['content/specs/edu-1.json', '스펙', '고려대학교 컴퓨터학과'],
    ] as const;
    for (const [path, kindLabel, title] of kinds) {
      const result = describeChange({ status: 'M', path }, content);
      expect(result.kindLabel).toBe(kindLabel);
      expect(result.title).toBe(title);
    }
  });

  it('프로필은 이름으로 보여준다', () => {
    const result = describeChange({ status: 'M', path: 'content/profile.json' }, content);
    expect(result.kindLabel).toBe('프로필');
    expect(result.title).toBe('김태호');
  });

  it('추가·수정·삭제를 구분한다', () => {
    const path = 'content/posts/first.json';
    expect(describeChange({ status: '??', path }, content).action).toBe('추가');
    expect(describeChange({ status: 'A', path }, content).action).toBe('추가');
    expect(describeChange({ status: 'M', path }, content).action).toBe('수정');
    expect(describeChange({ status: 'D', path }, content).action).toBe('삭제');
  });

  it('삭제된 항목은 서버가 git 에서 꺼낸 제목을 쓴다', () => {
    const result = describeChange(
      { status: 'D', path: 'content/posts/gone.json', deletedTitle: '지운 글' },
      content,
    );
    expect(result.action).toBe('삭제');
    expect(result.title).toBe('지운 글');
  });

  it('제목을 못 꺼냈으면 id 로 대체하고 죽지 않는다', () => {
    const result = describeChange({ status: 'D', path: 'content/posts/gone.json' }, content);
    expect(result.action).toBe('삭제');
    expect(result.title).toBe('gone');
  });

  it('알 수 없는 경로도 죽지 않는다', () => {
    const result = describeChange({ status: 'M', path: 'content/weird/x.json' }, content);
    expect(result.kindLabel).toBe('콘텐츠');
    expect(result.title).toBe('x');
  });
});

describe('describeChanges', () => {
  it('목록 전체를 변환한다', () => {
    const result = describeChanges(
      [
        { status: 'M', path: 'content/papers/attention.json' },
        { status: '??', path: 'content/posts/first.json' },
      ],
      content,
    );
    expect(result.map((r) => `${r.action} ${r.kindLabel} ${r.title}`)).toEqual([
      '수정 논문 리뷰 Attention Is All You Need',
      '추가 글 첫 글',
    ]);
  });
});
