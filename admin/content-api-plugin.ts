import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { createContentHandler } from './content-handler';

/**
 * 콘텐츠 쓰기 미들웨어의 HTTP 어댑터 (ADR-0003).
 *
 * 판단은 전부 content-handler.ts 가 한다. 여기는 요청/응답 변환만 한다 —
 * 그래야 로직을 테스트할 수 있다 (content-handler.test.ts).
 *
 * `apply: 'serve'` 이므로 **어떤 빌드 산출물에도 포함되지 않는다.**
 * admin 은 애초에 배포 대상이 아니고, 이 미들웨어는 로컬 개발 서버에만 존재한다.
 */

const MAX_BODY_BYTES = 1_000_000;

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

export function contentApiPlugin(repoRoot: string): Plugin {
  const handle = createContentHandler(repoRoot);

  return {
    name: 'portfolio-content-api',
    // 개발 서버에만 존재한다 — 빌드에는 절대 들어가지 않는다
    apply: 'serve',
    configureServer(server) {
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
