import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createContentHandler, resolveTarget, titleOf } from './content-handler';

/**
 * admin 쓰기 경로는 이 시스템에서 파일을 바꾸는 유일한 곳이다 (QUALITY_SCORE).
 *
 * 실제 임시 디렉터리에 대고 검증한다 — 경로 조작은 진짜 경로 해석으로 확인해야
 * 의미가 있고, fs 를 목하면 정작 위험한 부분을 검사하지 못한다.
 */

let repoRoot: string;
let handle: ReturnType<typeof createContentHandler>;

const validPost = {
  id: 'hello-world',
  title: '안녕 세계',
  publishedOn: '2026-09-06',
  summary: '한글이 온전한지 본다',
};

const put = (body: unknown) => handle({ method: 'PUT', url: '/api/content', body });

beforeEach(() => {
  repoRoot = mkdtempSync(join(tmpdir(), 'portfolio-test-'));
  mkdirSync(join(repoRoot, 'content', 'posts'), { recursive: true });
  handle = createContentHandler(repoRoot);
});

afterEach(() => {
  rmSync(repoRoot, { recursive: true, force: true });
});

describe('쓰기 — 검증을 통과한 값만 디스크에 닿는다 (INV-3)', () => {
  it('유효한 값을 파일로 쓰고 기본값을 채운다', () => {
    const res = put({ kind: 'post', id: 'hello-world', json: JSON.stringify(validPost) });
    expect(res.status).toBe(200);

    const file = join(repoRoot, 'content', 'posts', 'hello-world.json');
    expect(existsSync(file)).toBe(true);
    const written: unknown = JSON.parse(readFileSync(file, 'utf8'));
    expect(written).toMatchObject({ id: 'hello-world', visibility: 'public', tags: [] });
  });

  it('한글이 깨지지 않는다', () => {
    put({ kind: 'post', id: 'hello-world', json: JSON.stringify(validPost) });
    const written = JSON.parse(
      readFileSync(join(repoRoot, 'content', 'posts', 'hello-world.json'), 'utf8'),
    ) as { title: string };
    expect(written.title).toBe('안녕 세계');
  });

  it('스키마 검증 실패는 422 이고 파일을 만들지 않는다', () => {
    const res = put({
      kind: 'post',
      id: 'bad',
      json: JSON.stringify({ id: 'bad', title: '', publishedOn: '2026/09/06' }),
    });
    expect(res.status).toBe(422);
    expect(existsSync(join(repoRoot, 'content', 'posts', 'bad.json'))).toBe(false);
  });

  it('깨진 JSON 은 400 이고 파일을 만들지 않는다', () => {
    const res = put({ kind: 'post', id: 'broken', json: '{ not json' });
    expect(res.status).toBe(400);
    expect(existsSync(join(repoRoot, 'content', 'posts', 'broken.json'))).toBe(false);
  });

  it('알 수 없는 종류는 거부한다', () => {
    expect(put({ kind: 'evil', id: 'x', json: '{}' }).status).toBe(400);
  });

  it('id 나 json 이 문자열이 아니면 거부한다', () => {
    expect(put({ kind: 'post', id: 123, json: '{}' }).status).toBe(400);
    expect(put({ kind: 'post', id: 'x', json: { a: 1 } }).status).toBe(400);
    expect(put({}).status).toBe(400);
  });
});

describe('경로 조작 차단 — 이것이 이 파일의 존재 이유다', () => {
  const escapes = [
    '../../evil',
    '..',
    'a/../../b',
    'sub/dir',
    'C:evil',
    '.hidden',
    'UPPER',
    'has space',
    '',
  ];

  for (const id of escapes) {
    it(`id "${id}" 를 거부한다`, () => {
      const res = put({ kind: 'post', id, json: JSON.stringify({ ...validPost, id: 'ok-id' }) });
      expect(res.status).toBe(400);
    });
  }

  it('거부된 id 로는 저장소 밖에 아무것도 쓰이지 않는다', () => {
    const outside = resolve(repoRoot, '..', 'evil.json');
    put({ kind: 'post', id: '../../evil', json: JSON.stringify({ ...validPost, id: 'ok-id' }) });
    expect(existsSync(outside)).toBe(false);
  });

  it('resolveTarget 은 의도한 디렉터리 안만 돌려준다', () => {
    const good = resolveTarget(repoRoot, 'post', 'fine-id');
    expect(good).not.toBeNull();
    expect(good?.startsWith(resolve(repoRoot, 'content', 'posts'))).toBe(true);

    for (const id of escapes) {
      expect(resolveTarget(repoRoot, 'post', id)).toBeNull();
    }
  });
});

describe('읽기', () => {
  it('없는 파일은 실패가 아니라 null 이다 (새 항목과 오류를 구분한다)', () => {
    const res = handle({ method: 'GET', url: '/api/content?kind=post&id=nothing' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ json: null });
  });

  it('쓴 내용을 그대로 돌려준다', () => {
    put({ kind: 'post', id: 'hello-world', json: JSON.stringify(validPost) });
    const res = handle({ method: 'GET', url: '/api/content?kind=post&id=hello-world' });
    const body = res.body as { json: string };
    expect(JSON.parse(body.json)).toMatchObject({ title: '안녕 세계' });
  });

  it('목록은 제목을 뽑아 준다', () => {
    put({ kind: 'post', id: 'hello-world', json: JSON.stringify(validPost) });
    const res = handle({ method: 'GET', url: '/api/content?kind=post' });
    expect(res.body).toEqual({ items: [{ id: 'hello-world', title: '안녕 세계' }] });
  });

  it('디렉터리가 없어도 빈 목록을 준다', () => {
    const res = handle({ method: 'GET', url: '/api/content?kind=paper' });
    expect(res.body).toEqual({ items: [] });
  });

  it('깨진 파일도 목록에는 보인다 — 고치려면 열 수 있어야 한다', () => {
    writeFileSync(join(repoRoot, 'content', 'posts', 'corrupt.json'), '{ broken', 'utf8');
    const res = handle({ method: 'GET', url: '/api/content?kind=post' });
    expect(res.body).toEqual({ items: [{ id: 'corrupt', title: 'corrupt' }] });
  });

  it('알 수 없는 종류는 거부한다', () => {
    expect(handle({ method: 'GET', url: '/api/content?kind=evil' }).status).toBe(400);
  });
});

describe('삭제', () => {
  it('있는 항목을 지운다', () => {
    put({ kind: 'post', id: 'hello-world', json: JSON.stringify(validPost) });
    const res = handle({ method: 'DELETE', url: '/api/content?kind=post&id=hello-world' });
    expect(res.status).toBe(200);
    expect(existsSync(join(repoRoot, 'content', 'posts', 'hello-world.json'))).toBe(false);
  });

  it('없는 항목은 404 다', () => {
    expect(handle({ method: 'DELETE', url: '/api/content?kind=post&id=nothing' }).status).toBe(404);
  });

  it('경로 조작 id 는 거부한다', () => {
    expect(handle({ method: 'DELETE', url: '/api/content?kind=post&id=..' }).status).toBe(400);
  });
});

describe('메서드', () => {
  it('지원하지 않는 메서드는 405 다', () => {
    expect(handle({ method: 'POST', url: '/api/content?kind=post' }).status).toBe(405);
  });
});

describe('titleOf', () => {
  it('title 을 우선 쓰고, 없으면 name, 그것도 없으면 id 로 대체한다', () => {
    expect(titleOf({ title: '제목' }, 'fb')).toBe('제목');
    expect(titleOf({ name: '이름' }, 'fb')).toBe('이름');
    expect(titleOf({ title: '', name: '이름' }, 'fb')).toBe('이름');
    expect(titleOf(null, 'fb')).toBe('fb');
    expect(titleOf({ title: 42 }, 'fb')).toBe('fb');
  });
});
