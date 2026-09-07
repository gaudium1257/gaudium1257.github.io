import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { commitMessageFor, pendingChanges, publish } from './publish-handler';

/**
 * 게시는 되돌리기 어려운 동작이다 — 잘못 커밋하면 공개 사이트에 나간다.
 * 진짜 git 저장소를 임시로 만들어 검증한다. git 을 목하면 정작 위험한 부분을 못 본다.
 */

let repo: string;
const git = (args: string[]) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' });

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'publish-test-'));
  git(['init', '-b', 'main']);
  git(['config', 'user.email', 'test@example.com']);
  git(['config', 'user.name', 'Test']);
  mkdirSync(join(repo, 'content', 'posts'), { recursive: true });
  writeFileSync(join(repo, 'content', 'posts', 'a.json'), '{}', 'utf8');
  writeFileSync(join(repo, 'src.ts'), 'export const x = 1;\n', 'utf8');
  git(['add', '-A']);
  git(['commit', '-m', 'init']);
});

afterEach(() => {
  rmSync(repo, { recursive: true, force: true });
});

describe('pendingChanges', () => {
  it('변경이 없으면 빈 목록이다', () => {
    expect(pendingChanges(repo)).toEqual([]);
  });

  it('content/ 변경만 센다 — 소스 코드 변경은 세지 않는다', () => {
    writeFileSync(join(repo, 'content', 'posts', 'a.json'), '{"a":1}', 'utf8');
    writeFileSync(join(repo, 'src.ts'), 'export const x = 2;\n', 'utf8');
    const changes = pendingChanges(repo);
    expect(changes).toHaveLength(1);
    expect(changes[0]?.path).toContain('content/posts/a.json');
  });

  it('새 파일도 잡는다', () => {
    writeFileSync(join(repo, 'content', 'posts', 'b.json'), '{}', 'utf8');
    expect(pendingChanges(repo).map((c) => c.path)).toContain('content/posts/b.json');
  });

  /**
   * 삭제하면 작업트리에 파일이 없다. 화면이 제목을 알 방법은 git 뿐이다 (EP-0003).
   * 이게 없으면 게시 모달이 파일명을 보여주게 되고, 그건 이미 한 번 고친 문제다.
   */
  it('삭제된 항목의 제목을 마지막 커밋에서 꺼낸다', () => {
    writeFileSync(
      join(repo, 'content', 'posts', 'c.json'),
      JSON.stringify({ id: 'c', title: '지울 글' }),
      'utf8',
    );
    git(['add', '-A']);
    git(['commit', '-m', 'add c']);
    rmSync(join(repo, 'content', 'posts', 'c.json'));

    const change = pendingChanges(repo).find((c) => c.path.endsWith('c.json'));
    expect(change?.status).toContain('D');
    expect(change?.deletedTitle).toBe('지울 글');
  });

  it('프로필은 title 이 없으므로 name 을 쓴다', () => {
    writeFileSync(
      join(repo, 'content', 'profile.json'),
      JSON.stringify({ name: '김태호' }),
      'utf8',
    );
    git(['add', '-A']);
    git(['commit', '-m', 'add profile']);
    rmSync(join(repo, 'content', 'profile.json'));

    const change = pendingChanges(repo).find((c) => c.path.endsWith('profile.json'));
    expect(change?.deletedTitle).toBe('김태호');
  });

  it('제목을 못 꺼내도 게시를 막지 않는다', () => {
    // a.json 은 '{}' 라 title 도 name 도 없다
    rmSync(join(repo, 'content', 'posts', 'a.json'));
    const change = pendingChanges(repo).find((c) => c.path.endsWith('a.json'));
    expect(change?.status).toContain('D');
    expect(change?.deletedTitle).toBeUndefined();
  });

  it('수정된 항목에는 삭제 제목을 붙이지 않는다', () => {
    writeFileSync(join(repo, 'content', 'posts', 'a.json'), '{"a":1}', 'utf8');
    expect(pendingChanges(repo)[0]?.deletedTitle).toBeUndefined();
  });
});

describe('publish', () => {
  it('변경이 없으면 커밋하지 않고 이유를 알린다', () => {
    const result = publish(repo);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('nothing');
  });

  it('원격이 없으면 커밋하지 않는다', () => {
    writeFileSync(join(repo, 'content', 'posts', 'a.json'), '{"a":1}', 'utf8');
    const result = publish(repo);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('no-remote');
    // 원격이 없다고 로컬 커밋만 남기지 않는다 — 상태가 어중간해진다
    expect(git(['log', '--oneline']).trim().split('\n')).toHaveLength(1);
  });

  it('소스 코드 변경은 함께 커밋되지 않는다', () => {
    // 원격을 붙여 커밋까지 가게 한다 (푸시는 실패해도 커밋 범위는 확인 가능)
    const remote = mkdtempSync(join(tmpdir(), 'publish-remote-'));
    execFileSync('git', ['init', '--bare', '-b', 'main'], { cwd: remote });
    git(['remote', 'add', 'origin', remote]);

    writeFileSync(join(repo, 'content', 'posts', 'a.json'), '{"a":1}', 'utf8');
    writeFileSync(join(repo, 'src.ts'), 'export const x = 999;\n', 'utf8');

    publish(repo);

    const changed = git(['show', '--name-only', '--format=', 'HEAD']).trim().split('\n');
    expect(changed).toEqual(['content/posts/a.json']);
    // 소스 변경은 그대로 작업 트리에 남아 있어야 한다
    expect(git(['status', '--porcelain', '--', 'src.ts']).trim()).not.toBe('');

    rmSync(remote, { recursive: true, force: true });
  });
});

describe('commitMessageFor', () => {
  it('종류별 건수를 요약한다', () => {
    const message = commitMessageFor([
      { status: 'M', path: 'content/papers/a.json' },
      { status: 'A', path: 'content/papers/b.json' },
      { status: 'M', path: 'content/projects/c.json' },
    ]);
    expect(message).toBe('content: 논문 리뷰 2건, 프로젝트 1건');
  });

  it('프로필을 따로 표시한다', () => {
    expect(commitMessageFor([{ status: 'M', path: 'content/profile.json' }])).toBe(
      'content: 프로필 1건',
    );
  });
});
