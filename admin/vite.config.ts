import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { createReadStream, existsSync } from 'node:fs';
import { contentApiPlugin } from './content-api-plugin';

const repoRoot = resolve(import.meta.dirname, '..');
const assetDir = resolve(repoRoot, 'content', 'assets');

/**
 * admin 은 로컬 전용이다 (ADR-0003). 배포 대상이 아니므로 build 설정이 없다.
 * 콘텐츠 쓰기는 contentApiPlugin 이 담당하며 개발 서버에만 존재한다.
 */

/**
 * 본문에 넣은 이미지는 `content/assets/` 에 저장되고 `/uploads/…` 로 참조된다 (EP-0007).
 * content/ 는 vite root 밖이라 그냥 두면 404 다 — 개발 중엔 미들웨어로 서빙하고,
 * admin 은 빌드 대상이 아니므로(ADR-0003) 개발 서버 서빙만 한다.
 */
function serveUploads(): Plugin {
  return {
    name: 'portfolio-serve-uploads',
    configureServer(server) {
      server.middlewares.use('/uploads', (req, res, next) => {
        const name = (req.url ?? '/').split('?')[0]?.replace(/^\//, '') ?? '';
        // 이름만 쓴다 — 경로 구분자가 섞이면 assets 밖을 읽을 수 있다
        if (!name || name.includes('/') || name.includes('..')) return next();
        const file = resolve(assetDir, name);
        if (!existsSync(file)) return next();
        res.setHeader('Cache-Control', 'no-cache');
        createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contentApiPlugin(repoRoot), serveUploads()],
  resolve: {
    alias: {
      '@admin': resolve(import.meta.dirname, 'src'),
      '@ui': resolve(repoRoot, 'shared/ui'),
      '@portfolio/content': resolve(repoRoot, 'shared/content/index.ts'),
      '@portfolio/ui': resolve(repoRoot, 'shared/ui/index.ts'),
      '@portfolio/portfolio': resolve(repoRoot, 'shared/portfolio/index.ts'),
    },
  },
  server: {
    port: 5174,
    fs: { allow: [repoRoot] },
  },
});
