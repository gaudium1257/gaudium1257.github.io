import { spawnSync } from 'node:child_process';

/**
 * 게시 — content/ 를 커밋하고 푸시한다 (ADR-0003 개정).
 *
 * 보안: **셸을 쓰지 않는다.** 모든 인자를 배열로 넘겨 문자열 삽입 경로를 없앤다.
 * 커밋 메시지도 사용자 입력이 아니라 변경 목록에서 만든다.
 *
 * 범위: `content/` 만 스테이징한다. 소스 코드는 절대 건드리지 않는다 —
 * 편집 도구가 코드를 커밋하면 안 된다.
 */

const CONTENT_PATH = 'content';

export interface PendingChange {
  /** 'A' 추가 · 'M' 수정 · 'D' 삭제 */
  status: string;
  path: string;
}

export interface PublishResult {
  ok: boolean;
  /** 사람이 읽는 결과 설명 */
  message: string;
  /** 실패 원인 구분 — 화면이 다르게 안내할 수 있게 */
  reason?: 'nothing' | 'conflict' | 'auth' | 'no-remote' | 'failed';
  commit?: string;
}

function git(repoRoot: string, args: string[]) {
  return spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8', shell: false });
}

/** 아직 게시되지 않은 content/ 변경 목록 */
export function pendingChanges(repoRoot: string): PendingChange[] {
  const res = git(repoRoot, ['status', '--porcelain', '--', CONTENT_PATH]);
  if (res.status !== 0) return [];
  return res.stdout
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => ({
      status: line.slice(0, 2).trim() || 'M',
      path: line.slice(3).replace(/^"|"$/g, ''),
    }));
}

/** 변경 목록에서 커밋 메시지를 만든다 — 사용자가 메시지를 쓰지 않아도 이력이 읽힌다 */
export function commitMessageFor(changes: PendingChange[]): string {
  const kinds: Record<string, string> = {
    papers: '논문 리뷰',
    projects: '프로젝트',
    posts: '글',
    specs: '스펙',
  };
  const counts = new Map<string, number>();
  for (const change of changes) {
    const segment = change.path.split('/')[1] ?? '';
    const label = change.path.endsWith('profile.json') ? '프로필' : (kinds[segment] ?? '콘텐츠');
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const summary = [...counts.entries()].map(([label, n]) => `${label} ${n}건`).join(', ');
  return `content: ${summary}`;
}

export function publish(repoRoot: string): PublishResult {
  const changes = pendingChanges(repoRoot);
  if (changes.length === 0) {
    return { ok: false, reason: 'nothing', message: '게시할 변경이 없습니다.' };
  }

  const remote = git(repoRoot, ['remote']);
  if (remote.status !== 0 || !remote.stdout.trim()) {
    return { ok: false, reason: 'no-remote', message: '원격 저장소가 설정되어 있지 않습니다.' };
  }

  const added = git(repoRoot, ['add', '--', CONTENT_PATH]);
  if (added.status !== 0) {
    return { ok: false, reason: 'failed', message: '변경을 스테이징하지 못했습니다.' };
  }

  const message = commitMessageFor(changes);
  const committed = git(repoRoot, ['commit', '-m', message, '--', CONTENT_PATH]);
  if (committed.status !== 0) {
    return {
      ok: false,
      reason: 'failed',
      message: `커밋에 실패했습니다. ${committed.stderr.trim().split('\n')[0] ?? ''}`,
    };
  }

  const pushed = git(repoRoot, ['push']);
  if (pushed.status !== 0) {
    const err = `${pushed.stderr}`.toLowerCase();
    // 커밋은 남아 있으므로 원인을 해결한 뒤 다시 누르면 된다
    if (
      err.includes('rejected') ||
      err.includes('non-fast-forward') ||
      err.includes('fetch first')
    ) {
      return {
        ok: false,
        reason: 'conflict',
        message: '원격이 앞서 있습니다. git pull 후 다시 게시하세요. (커밋은 남아 있습니다)',
      };
    }
    if (
      err.includes('authentication') ||
      err.includes('could not read') ||
      err.includes('denied')
    ) {
      return {
        ok: false,
        reason: 'auth',
        message: 'git 인증에 실패했습니다. 터미널에서 한 번 push 해 자격 증명을 등록하세요.',
      };
    }
    return {
      ok: false,
      reason: 'failed',
      message: `푸시에 실패했습니다. ${pushed.stderr.trim().split('\n')[0] ?? ''}`,
    };
  }

  const sha = git(repoRoot, ['rev-parse', '--short', 'HEAD']).stdout.trim();
  return { ok: true, message, commit: sha };
}
