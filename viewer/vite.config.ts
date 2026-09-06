import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

const repoRoot = resolve(import.meta.dirname, '..');
const contentDir = resolve(repoRoot, 'content');

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

// 사용자 페이지(gaudium1257.github.io)는 사이트 루트에서 서빙된다 → base '/'
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), watchContent()],
  resolve: {
    alias: {
      '@viewer': resolve(import.meta.dirname, 'src'),
      '@ui': resolve(repoRoot, 'shared/ui'),
      '@portfolio/content': resolve(repoRoot, 'shared/content/index.ts'),
      '@portfolio/ui': resolve(repoRoot, 'shared/ui/index.ts'),
      '@content': contentDir,
    },
  },
  server: {
    // content/ 와 shared/ 가 앱 폴더 밖에 있으므로 리포 루트까지 허용한다
    fs: { allow: [repoRoot] },
  },
  build: { outDir: 'dist' },
});
