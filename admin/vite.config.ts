import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { contentApiPlugin } from './content-api-plugin';

const repoRoot = resolve(import.meta.dirname, '..');

/**
 * admin 은 로컬 전용이다 (ADR-0003). 배포 대상이 아니므로 build 설정이 없다.
 * 콘텐츠 쓰기는 contentApiPlugin 이 담당하며 개발 서버에만 존재한다.
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), contentApiPlugin(repoRoot)],
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
