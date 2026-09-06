// 훅 공용 유틸. 훅은 조용하고 빨라야 한다 — 실패해도 작업을 막지 않는다.
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export async function readInput() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    return {};
  }
}

/** 프로젝트 루트 기준 POSIX 상대 경로로 정규화 (win32 의 역슬래시를 없앤다) */
export function relPath(filePath, cwd) {
  if (!filePath) return '';
  const p = String(filePath).split('\\').join('/');
  const root = String(cwd || process.cwd())
    .split('\\')
    .join('/');
  return p.toLowerCase().startsWith(root.toLowerCase())
    ? p.slice(root.length).replace(/^\/+/, '')
    : p;
}

/** POSIX 경로 결합 + '..' 정규화 (node:path 는 win32 에서 역슬래시를 낸다) */
export function posixJoin(base, rel) {
  const out = base ? base.split('/') : [];
  for (const seg of rel.split('/')) {
    if (seg === '.' || seg === '') continue;
    if (seg === '..') out.pop();
    else out.push(seg);
  }
  return out.join('/');
}

/** Claude 에게 피드백을 주고 종료 (PreToolUse=차단, PostToolUse=수정 요청) */
export function block(message) {
  process.stderr.write(message + '\n');
  process.exit(2);
}

export function ok() {
  process.exit(0);
}

const STATE_DIR = '.claude/.state';

export function setState(key, value) {
  try {
    mkdirSync(STATE_DIR, { recursive: true });
    writeFileSync(join(STATE_DIR, key), String(value), 'utf8');
  } catch {
    /* 상태 저장 실패는 작업을 막지 않는다 */
  }
}

export function getState(key) {
  try {
    const f = join(STATE_DIR, key);
    return existsSync(f) ? readFileSync(f, 'utf8') : null;
  } catch {
    return null;
  }
}
