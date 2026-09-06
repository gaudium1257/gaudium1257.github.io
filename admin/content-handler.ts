import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { CONTENT_DIRS, contentSchemas, type ContentKind } from '@portfolio/content';

/**
 * 콘텐츠 API 핸들러 (ADR-0003).
 *
 * Vite 와 HTTP 에서 분리해 둔다 — 그래야 테스트할 수 있다.
 * 어댑터(content-api-plugin.ts)는 요청/응답 변환만 하고 판단은 전부 여기서 한다.
 *
 * **이 모듈이 파일시스템을 만지는 유일한 곳이다.** 앱 소스는 HTTP 로만 말한다.
 *
 * 보안: admin 이 로컬 전용이라 인증이 없다 (docs/SECURITY.md). 대신 아래를 지킨다.
 *  - 경로 조작 방지: kind 는 화이트리스트, id 는 스키마와 같은 패턴만 허용,
 *    해석된 경로가 의도한 디렉터리 안인지 재확인
 *  - 쓰기 전 스키마 검증 — 통과하지 못한 값은 디스크에 닿지 않는다 (INV-3)
 */

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export interface ApiRequest {
  method: string;
  /** 쿼리 문자열 포함 경로. 예: '/api/content?kind=paper&id=x' */
  url: string;
  /** PUT 의 파싱된 본문 */
  body?: unknown;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

function isContentKind(value: string): value is ContentKind {
  return Object.prototype.hasOwnProperty.call(contentSchemas, value);
}

/** kind 와 id 를 검증한 뒤에만 경로를 만든다. 밖으로 새는 경로는 null 을 돌려준다. */
export function resolveTarget(repoRoot: string, kind: ContentKind, id: string): string | null {
  if (!ID_PATTERN.test(id)) return null;
  const dir = resolve(repoRoot, CONTENT_DIRS[kind]);
  const name = kind === 'profile' ? 'profile' : id;
  const file = resolve(dir, `${name}.json`);
  // 패턴만 믿지 않는다 — 해석 결과가 정말 그 디렉터리 안인지 다시 본다
  return file.startsWith(dir + sep) ? file : null;
}

/** 목록에 보여줄 제목을 뽑는다. 없으면 id 로 대체한다. */
export function titleOf(value: unknown, fallback: string): string {
  if (value && typeof value === 'object') {
    for (const key of ['title', 'name'] as const) {
      const found = (value as Record<string, unknown>)[key];
      if (typeof found === 'string' && found) return found;
    }
  }
  return fallback;
}

const badKind = (): ApiResponse => ({
  status: 400,
  body: { error: '알 수 없는 콘텐츠 종류입니다.' },
});
const badId = (): ApiResponse => ({
  status: 400,
  body: { error: 'id 형식이 올바르지 않습니다.' },
});

function handleGet(repoRoot: string, kind: ContentKind, id: string | null): ApiResponse {
  // 단건 조회: id 가 주어졌거나 profile 처럼 항목이 하나인 종류
  if (id !== null || kind === 'profile') {
    const target = resolveTarget(repoRoot, kind, id ?? 'profile');
    if (!target) return badId();
    // 없는 것과 실패한 것을 구분한다
    return {
      status: 200,
      body: { json: existsSync(target) ? readFileSync(target, 'utf8') : null },
    };
  }

  const dir = resolve(repoRoot, CONTENT_DIRS[kind]);
  if (!existsSync(dir)) return { status: 200, body: { items: [] } };

  const items = readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const entryId = f.replace(/\.json$/, '');
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      } catch {
        // 깨진 파일도 목록에는 보여준다 — 고치려면 열 수 있어야 한다
      }
      return { id: entryId, title: titleOf(parsed, entryId) };
    });
  return { status: 200, body: { items } };
}

function handlePut(repoRoot: string, body: unknown): ApiResponse {
  const { kind, id, json } = (body ?? {}) as Record<string, unknown>;
  if (typeof kind !== 'string' || !isContentKind(kind)) return badKind();
  if (typeof id !== 'string' || typeof json !== 'string') {
    return { status: 400, body: { error: 'id 와 json 이 필요합니다.' } };
  }

  // 디스크에 닿기 전에 반드시 스키마를 통과해야 한다 (INV-3)
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { status: 400, body: { error: 'JSON 형식이 올바르지 않습니다.' } };
  }

  const result = contentSchemas[kind].safeParse(parsed);
  if (!result.success) {
    return {
      status: 422,
      body: {
        error: '스키마 검증에 실패했습니다.',
        issues: result.error.issues.map((i) => `${i.path.join('.') || '(전체)'}: ${i.message}`),
      },
    };
  }

  const target = resolveTarget(repoRoot, kind, id);
  if (!target) return badId();

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(result.data, null, 2)}\n`, 'utf8');
  return { status: 200, body: { ok: true, path: target.slice(repoRoot.length + 1) } };
}

function handleDelete(repoRoot: string, kind: ContentKind, id: string): ApiResponse {
  const target = resolveTarget(repoRoot, kind, id);
  if (!target) return badId();
  if (!existsSync(target)) return { status: 404, body: { error: '없는 항목입니다.' } };
  unlinkSync(target);
  return { status: 200, body: { ok: true, path: target.slice(repoRoot.length + 1) } };
}

export function createContentHandler(repoRoot: string) {
  return function handle(req: ApiRequest): ApiResponse {
    const url = new URL(req.url, 'http://localhost');
    const kindParam = url.searchParams.get('kind') ?? '';

    if (req.method === 'GET') {
      if (!isContentKind(kindParam)) return badKind();
      return handleGet(repoRoot, kindParam, url.searchParams.get('id'));
    }
    if (req.method === 'PUT') {
      return handlePut(repoRoot, req.body);
    }
    if (req.method === 'DELETE') {
      if (!isContentKind(kindParam)) return badKind();
      return handleDelete(repoRoot, kindParam, url.searchParams.get('id') ?? '');
    }
    return { status: 405, body: { error: '지원하지 않는 메서드입니다.' } };
  };
}
