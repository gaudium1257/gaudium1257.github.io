import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { createContentHandler } from './content-handler';
import { pendingChanges, publish, revert } from './publish-handler';
import { handleUpload } from './upload-handler';

/**
 * 콘텐츠 쓰기 미들웨어의 HTTP 어댑터 (ADR-0003).
 *
 * 판단은 전부 content-handler.ts 가 한다. 여기는 요청/응답 변환만 한다 —
 * 그래야 로직을 테스트할 수 있다 (content-handler.test.ts).
 *
 * `apply: 'serve'` 이므로 **어떤 빌드 산출물에도 포함되지 않는다.**
 * admin 은 애초에 배포 대상이 아니고, 이 미들웨어는 로컬 개발 서버에만 존재한다.
 */

/**
 * base64 는 원본보다 약 33% 크다. 이미지 상한(5MB)을 담으려면 본문 상한이 그보다 커야 한다
 * — 안 그러면 상한 안내가 아니라 '요청이 너무 큽니다' 가 뜬다 (EP-0007).
 */
const MAX_BODY_BYTES = 8_000_000;

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolveBody, rejectBody) => {
    // 청크마다 따로 디코드하면 멀티바이트 문자(한글 등)가 경계에서 깨진다.
    // 바이트를 모두 모은 뒤 한 번에 디코드한다.
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        rejectBody(new Error('요청이 너무 큽니다'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown);
      } catch {
        rejectBody(new Error('JSON 형식이 올바르지 않습니다.'));
      }
    });
    req.on('error', rejectBody);
  });
}

/**
 * 본문에서 paths 를 꺼낸다. 형태가 아니면 undefined = '전체' 로 본다 (INV-3).
 * **경로가 안전한지는 여기서 판단하지 않는다** — publish/revert 가 git 의 변경 목록과 대조한다.
 */
function pathsFrom(body: unknown): string[] | undefined {
  if (typeof body !== 'object' || body === null) return undefined;
  const paths = (body as { paths?: unknown }).paths;
  if (!Array.isArray(paths)) return undefined;
  if (!paths.every((p): p is string => typeof p === 'string')) return undefined;
  return paths;
}

export function contentApiPlugin(repoRoot: string): Plugin {
  const handle = createContentHandler(repoRoot);

  return {
    name: 'portfolio-content-api',
    // 개발 서버에만 존재한다 — 빌드에는 절대 들어가지 않는다
    apply: 'serve',
    configureServer(server) {
      // 게시: 미게시 변경 조회(GET) 와 커밋+푸시(POST) — ADR-0003 개정
      server.middlewares.use('/api/publish', (req: IncomingMessage, res: ServerResponse) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(body));
        };
        if (req.method === 'GET') {
          send(200, { changes: pendingChanges(repoRoot) });
          return;
        }
        if (req.method === 'POST') {
          // 본문의 paths 는 '이것만' 을 뜻한다. 없으면 전체 (EP-0004).
          // 경로 검증은 publish/revert 안에서 pendingChanges 와 대조해 한다.
          void readJsonBody(req)
            .then((body) => pathsFrom(body))
            .catch(() => undefined)
            .then((paths) => {
              const revertOnly = (req.url ?? '').startsWith('/revert');
              if (revertOnly) {
                if (!paths) return send(400, { error: '복구할 항목이 없습니다.' });
                const result = revert(repoRoot, paths);
                return send(result.ok ? 200 : 409, result);
              }
              const result = publish(repoRoot, paths);
              return send(result.ok ? 200 : 409, result);
            });
          return;
        }
        send(405, { error: '지원하지 않는 메서드입니다.' });
      });

      // 이미지 업로드 — 개발 서버에만 존재한다 (EP-0007)
      server.middlewares.use('/api/upload', (req: IncomingMessage, res: ServerResponse) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(body));
        };
        if (req.method !== 'POST') {
          send(405, { error: '지원하지 않는 메서드입니다.' });
          return;
        }
        void readJsonBody(req)
          .then((body) => {
            const result = handleUpload(repoRoot, body);
            send(result.ok ? 200 : result.status, result);
          })
          .catch((error: unknown) => {
            send(400, { error: error instanceof Error ? error.message : '업로드 오류' });
          });
      });

      server.middlewares.use('/api/content', (req: IncomingMessage, res: ServerResponse) => {
        const send = ({ status, body }: { status: number; body: unknown }) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(body));
        };

        const url = req.url ?? '/';
        const method = req.method ?? 'GET';

        if (method !== 'PUT') {
          send(handle({ method, url }));
          return;
        }

        void readJsonBody(req)
          .then((body) => send(handle({ method, url, body })))
          .catch((error: unknown) => {
            send({
              status: 400,
              body: { error: error instanceof Error ? error.message : '요청 오류' },
            });
          });
      });
    },
  };
}
