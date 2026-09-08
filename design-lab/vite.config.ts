import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const repoRoot = resolve(import.meta.dirname, '..');
const contentDir = resolve(repoRoot, 'content');

/**
 * 디자인 시안 비교소 (EP-0005). **로컬 전용이다.**
 *
 * build 스크립트가 없다 — 만들 수 없으면 배포될 수도 없다 (admin 과 같은 방식, ADR-0003).
 * 배포 워크플로는 viewer 만 빌드한다.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@lab': resolve(import.meta.dirname, 'src'),
      '@ui': resolve(repoRoot, 'shared/ui'),
      '@portfolio/content': resolve(repoRoot, 'shared/content/index.ts'),
      '@portfolio/ui': resolve(repoRoot, 'shared/ui/index.ts'),
      '@portfolio/portfolio': resolve(repoRoot, 'shared/portfolio/index.ts'),
      '@content': contentDir,
    },
  },
  server: {
    port: 5175,
    fs: { allow: [repoRoot] },
  },
});
