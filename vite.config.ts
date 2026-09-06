import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// 사용자 페이지(gaudium1257.github.io)는 사이트 루트에서 서빙된다 → base '/'
// 테스트 설정은 vitest.config.ts 에 분리되어 있다 (vitest 가 자체 vite 사본을 번들해 타입이 충돌한다)
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    // 관리자 화면은 별도 청크로 분리한다. 성능 목적이지 보안이 아니다 (INV-11)
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('/src/domains/admin/')) return 'admin';
          return undefined;
        },
      },
    },
  },
});
