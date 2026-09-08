import { spawnSync } from 'node:child_process';
import { unlinkSync } from 'node:fs';
import { join } from 'node:path';

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
  /**
   * 삭제된 항목의 제목. 삭제하면 작업트리에 파일이 없어 화면이 제목을 알 수 없다 —
   * git 이 유일하게 아는 곳이므로 여기서 꺼내 실어 보낸다 (EP-0003).
   */
  deletedTitle?: string;
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

/**
 * 삭제된 파일의 제목을 마지막 커밋에서 꺼낸다.
 * 못 꺼내도 게시를 막지 않는다 — 화면이 id 로 대신 보여준다 (GR-4).
 */
function titleAtHead(repoRoot: string, path: string): string | undefined {
  const res = git(repoRoot, ['show', `HEAD:${path}`]);
  if (res.status !== 0) return undefined;
  try {
    const parsed: unknown = JSON.parse(res.stdout);
    if (typeof parsed !== 'object' || parsed === null) return undefined;
    const record = parsed as Record<string, unknown>;
    const label = record.title ?? record.name;
    return typeof label === 'string' && label ? label : undefined;
  } catch {
    return undefined;
  }
}

/** 아직 게시되지 않은 content/ 변경 목록 */
export function pendingChanges(repoRoot: string): PendingChange[] {
  const res = git(repoRoot, ['status', '--porcelain', '--', CONTENT_PATH]);
  if (res.status !== 0) return [];
  return res.stdout
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const status = line.slice(0, 2).trim() || 'M';
      const path = line.slice(3).replace(/^"|"$/g, '');
      const deletedTitle = status.includes('D') ? titleAtHead(repoRoot, path) : undefined;
      return deletedTitle ? { status, path, deletedTitle } : { status, path };
    });
}

/**
 * 요청된 경로를 **git 이 실제로 보고한 변경 목록과 대조**한다 (EP-0004).
 *
 * 경로는 클라이언트에서 온다. 그대로 git 에 넘기면 `content/` 밖을 건드릴 수 있다.
 * `startsWith('content/')` 같은 문자열 검사는 `content/../..` 를 놓치므로,
 * 허용 목록을 git 자신에게서 얻는다. 목록에 없는 경로가 하나라도 있으면 전부 거부한다.
 *
 * `paths` 가 없으면 전체(= 미게시 변경 전부)를 뜻한다.
 */
export function resolveTargets(changes: PendingChange[], paths?: string[]): PendingChange[] | null {
  if (!paths) return changes;
  if (paths.length === 0) return null;

  const byPath = new Map(changes.map((change) => [change.path, change]));
  const targets: PendingChange[] = [];
  for (const path of paths) {
    const found = byPath.get(path);
    if (!found) return null;
    targets.push(found);
  }
  return targets;
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

/**
 * 게시한다. `paths` 를 주면 **그 항목만** 커밋한다 — 나머지는 미게시로 남는다 (EP-0004).
 * 커밋도 푸시도 pathspec 으로 범위를 좁히므로 소스 코드는 여전히 들어가지 않는다.
 */
export function publish(repoRoot: string, paths?: string[]): PublishResult {
  const all = pendingChanges(repoRoot);
  if (all.length === 0) {
    return { ok: false, reason: 'nothing', message: '게시할 변경이 없습니다.' };
  }

  const changes = resolveTargets(all, paths);
  if (!changes || changes.length === 0) {
    return { ok: false, reason: 'nothing', message: '게시할 항목을 찾지 못했습니다.' };
  }
  const pathspec = paths ? changes.map((change) => change.path) : [CONTENT_PATH];

  const remote = git(repoRoot, ['remote']);
  if (remote.status !== 0 || !remote.stdout.trim()) {
    return { ok: false, reason: 'no-remote', message: '원격 저장소가 설정되어 있지 않습니다.' };
  }

  const added = git(repoRoot, ['add', '--', ...pathspec]);
  if (added.status !== 0) {
    return { ok: false, reason: 'failed', message: '변경을 스테이징하지 못했습니다.' };
  }

  const message = commitMessageFor(changes);
  const committed = git(repoRoot, ['commit', '-m', message, '--', ...pathspec]);
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

export interface RevertResult {
  ok: boolean;
  message: string;
  reason?: 'nothing' | 'unknown-path' | 'failed';
  /** 실제로 되돌린 경로 */
  reverted?: string[];
}

/**
 * 한 경로를 되돌린다. 실패하면 사유 문자열을, 성공하면 null 을 준다.
 *
 * 세 경우가 다르다:
 *  - HEAD 에 있음 (게시된 적 있음) → `checkout` 으로 내용 복원
 *  - 인덱스에만 있음 (스테이징된 새 파일) → `git rm` 으로 인덱스와 디스크에서 제거
 *  - 어디에도 없음 (추적 안 되는 새 파일) → **git 이 모르는 파일이므로 직접 지운다.**
 *    `git rm --ignore-unmatch` 는 이 경우 조용히 아무 일도 하지 않는다 (실제로 걸렸다)
 */
function revertOne(repoRoot: string, path: string): string | null {
  const fail = (res: { status: number | null; stderr: string }) =>
    res.status === 0 ? null : (res.stderr.trim().split('\n')[0] ?? '알 수 없는 오류');

  if (git(repoRoot, ['cat-file', '-e', `HEAD:${path}`]).status === 0) {
    return fail(git(repoRoot, ['checkout', 'HEAD', '--', path]));
  }
  if (git(repoRoot, ['ls-files', '--error-unmatch', '--', path]).status === 0) {
    return fail(git(repoRoot, ['rm', '--force', '--quiet', '--', path]));
  }
  try {
    unlinkSync(join(repoRoot, path));
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : '파일을 지우지 못했습니다.';
  }
}

/**
 * 미게시 변경을 마지막 게시 상태로 되돌린다 (EP-0004).
 *
 * ⚠️ **되살릴 수 없다.** 게시 전 편집은 git 에 없으므로 여기서 사라지면 끝이다.
 * 확인을 받는 책임은 화면에 있다 (PublishDialog).
 */
export function revert(repoRoot: string, paths: string[]): RevertResult {
  const all = pendingChanges(repoRoot);
  const targets = resolveTargets(all, paths);
  if (!targets) {
    return { ok: false, reason: 'unknown-path', message: '복구할 항목을 찾지 못했습니다.' };
  }

  const reverted: string[] = [];
  for (const target of targets) {
    const error = revertOne(repoRoot, target.path);
    if (error) {
      return { ok: false, reason: 'failed', message: `복구에 실패했습니다. ${error}`, reverted };
    }
    reverted.push(target.path);
  }

  return { ok: true, message: `${reverted.length}건을 되돌렸습니다.`, reverted };
}
