import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { createReadStream, cpSync, existsSync } from 'node:fs';

const repoRoot = resolve(import.meta.dirname, '..');
const contentDir = resolve(repoRoot, 'content');
const assetDir = resolve(contentDir, 'assets');

/**
 * content/ 는 vite root(viewer/) 밖에 있어 기본 감시 대상이 아니다.
 * 그대로 두면 admin 에서 저장해도 미리보기가 갱신되지 않는다 —
 * "로컬 viewer 가 곧 정확한 미리보기"라는 전제가 깨진다 (스펙 E-7).
 */
function watchContent(): Plugin {
  return {
    name: 'portfolio-watch-content',
    apply: 'serve',
    configureServer(server) {
      server.watcher.add(contentDir);
      const reload = (path: string) => {
        if (!path.startsWith(contentDir)) return;
        // 파일이 늘고 주는 것은 glob 결과 자체를 바꾸므로 전체 새로고침이 필요하다
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reload);
      server.watcher.on('unlink', reload);
      server.watcher.on('change', reload);
    },
  };
}

/**
 * 본문에 넣은 이미지는 `content/assets/` 에 저장되고 `/uploads/…` 로 참조된다 (EP-0007).
 * content/ 는 vite root 밖이라 그냥 두면 404 다 — 개발 중엔 미들웨어로 서빙하고,
 * 빌드에는 통째로 복사해 넣는다. 한쪽만 하면 로컬에선 보이고 배포에서 깨진다.
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
    closeBundle() {
      if (!existsSync(assetDir)) return;
      cpSync(assetDir, resolve(import.meta.dirname, 'dist', 'uploads'), { recursive: true });
    },
  };
}

// 사용자 페이지(gaudium1257.github.io)는 사이트 루트에서 서빙된다 → base '/'
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), watchContent(), serveUploads()],
  resolve: {
    alias: {
      '@viewer': resolve(import.meta.dirname, 'src'),
      '@ui': resolve(repoRoot, 'shared/ui'),
      '@portfolio/content': resolve(repoRoot, 'shared/content/index.ts'),
      '@portfolio/ui': resolve(repoRoot, 'shared/ui/index.ts'),
      '@portfolio/portfolio': resolve(repoRoot, 'shared/portfolio/index.ts'),
      '@content': contentDir,
    },
  },
  server: {
    // content/ 와 shared/ 가 앱 폴더 밖에 있으므로 리포 루트까지 허용한다
    fs: { allow: [repoRoot] },
  },
  build: { outDir: 'dist' },
});
