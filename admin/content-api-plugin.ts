import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { CONTENT_DIRS, contentSchemas, type ContentKind } from '@portfolio/content';

/**
 * 콘텐츠 쓰기 미들웨어 (ADR-0003).
 *
 * **이 파일이 파일시스템을 만지는 유일한 곳이다.** 앱 소스는 HTTP 로만 말한다.
 * `apply: 'serve'` 이므로 **어떤 빌드 산출물에도 포함되지 않는다** — admin 은 애초에
 * 배포 대상이 아니고, 이 미들웨어는 로컬 개발 서버에만 존재한다.
 *
 * 보안: admin 이 로컬 전용이라 인증이 없다. 대신 아래를 지킨다.
 *  - 경로 조작 방지: kind 는 화이트리스트, id 는 스키마와 같은 패턴만 허용
 *  - 쓰기 전 스키마 검증 — 통과하지 못한 값은 디스크에 닿지 않는다 (INV-3)
 */

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

function isContentKind(value: string): value is ContentKind {
  return value in contentSchemas;
}

/** kind 와 id 를 검증한 뒤에만 경로를 만든다. 밖으로 새는 경로를 만들지 않는다. */
function resolveTarget(repoRoot: string, kind: ContentKind, id: string): string | null {
  if (!ID_PATTERN.test(id)) return null;
  const dir = resolve(repoRoot, CONTENT_DIRS[kind]);
  const file = resolve(dir, `${kind === 'profile' ? 'profile' : id}.json`);
  // resolve 결과가 의도한 디렉터리 안인지 반드시 확인한다
  return file.startsWith(dir) ? file : null;
}

function readJsonBody(req: Parameters<Parameters<ViteDevServer['middlewares']['use']>[1]>[0]) {
  return new Promise<unknown>((resolveBody, rejectBody) => {
    // 청크마다 따로 디코드하면 멀티바이트 문자(한글 등)가 경계에서 깨진다.
    // 바이트를 모두 모은 뒤 한 번에 디코드한다.
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > 1_000_000) {
        rejectBody(new Error('요청이 너무 큽니다'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown);
      } catch {
        rejectBody(new Error('JSON 파싱 실패'));
      }
    });
    req.on('error', rejectBody);
  });
}

/** 목록에 보여줄 제목을 뽑는다. 없으면 id 로 대체한다. */
function titleOf(value: unknown, fallback: string): string {
  if (value && typeof value === 'object' && 'title' in value) {
    const title = (value as { title?: unknown }).title;
    if (typeof title === 'string' && title) return title;
  }
  if (value && typeof value === 'object' && 'name' in value) {
    const name = (value as { name?: unknown }).name;
    if (typeof name === 'string' && name) return name;
  }
  return fallback;
}

export function contentApiPlugin(repoRoot: string): Plugin {
  return {
    name: 'portfolio-content-api',
    // 개발 서버에만 존재한다 — 빌드에는 절대 들어가지 않는다
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/content', (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };

        const url = new URL(req.url ?? '/', 'http://localhost');
        const kindParam = url.searchParams.get('kind') ?? '';

        if (req.method === 'GET') {
          if (!isContentKind(kindParam))
            return send(400, { error: '알 수 없는 콘텐츠 종류입니다.' });
          const id = url.searchParams.get('id');

          if (id !== null || kindParam === 'profile') {
            const target = resolveTarget(repoRoot, kindParam, id ?? 'profile');
            if (!target) return send(400, { error: 'id 형식이 올바르지 않습니다.' });
            if (!existsSync(target)) return send(200, { json: null });
            return send(200, { json: readFileSync(target, 'utf8') });
          }

          const dir = resolve(repoRoot, CONTENT_DIRS[kindParam]);
          if (!existsSync(dir)) return send(200, { items: [] });
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
          return send(200, { items });
        }

        if (req.method === 'PUT') {
          void (async () => {
            let body: unknown;
            try {
              body = await readJsonBody(req);
            } catch (error) {
              return send(400, { error: error instanceof Error ? error.message : '요청 오류' });
            }

            const { kind, id, json } = (body ?? {}) as Record<string, unknown>;
            if (typeof kind !== 'string' || !isContentKind(kind)) {
              return send(400, { error: '알 수 없는 콘텐츠 종류입니다.' });
            }
            if (typeof id !== 'string' || typeof json !== 'string') {
              return send(400, { error: 'id 와 json 이 필요합니다.' });
            }

            // 디스크에 닿기 전에 반드시 스키마를 통과해야 한다 (INV-3)
            let parsed: unknown;
            try {
              parsed = JSON.parse(json);
            } catch {
              return send(400, { error: 'JSON 형식이 올바르지 않습니다.' });
            }
            const result = contentSchemas[kind].safeParse(parsed);
            if (!result.success) {
              return send(422, {
                error: '스키마 검증에 실패했습니다.',
                issues: result.error.issues.map(
                  (i) => `${i.path.join('.') || '(전체)'}: ${i.message}`,
                ),
              });
            }

            const target = resolveTarget(repoRoot, kind, id);
            if (!target) return send(400, { error: 'id 형식이 올바르지 않습니다.' });

            mkdirSync(dirname(target), { recursive: true });
            writeFileSync(target, `${JSON.stringify(result.data, null, 2)}\n`, 'utf8');
            return send(200, { ok: true, path: target.slice(repoRoot.length + 1) });
          })();
          return;
        }

        if (req.method === 'DELETE') {
          const id = url.searchParams.get('id') ?? '';
          if (!isContentKind(kindParam))
            return send(400, { error: '알 수 없는 콘텐츠 종류입니다.' });
          const target = resolveTarget(repoRoot, kindParam, id);
          if (!target) return send(400, { error: 'id 형식이 올바르지 않습니다.' });
          if (!existsSync(target)) return send(404, { error: '없는 항목입니다.' });
          unlinkSync(target);
          return send(200, { ok: true, path: target.slice(repoRoot.length + 1) });
        }

        return send(405, { error: '지원하지 않는 메서드입니다.' });
      });
    },
  };
}
