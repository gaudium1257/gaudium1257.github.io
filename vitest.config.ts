import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

// vitest 가 자체 vite 사본을 번들해 타입이 충돌하므로 vite.config 과 분리한다
export default defineConfig({
  resolve: {
    alias: {
      '@portfolio/content': resolve(import.meta.dirname, 'shared/content/index.ts'),
      '@portfolio/ui': resolve(import.meta.dirname, 'shared/ui/index.ts'),
      '@viewer': resolve(import.meta.dirname, 'viewer/src'),
      '@admin': resolve(import.meta.dirname, 'admin/src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tools/test-setup.ts'],
    include: ['{viewer,admin,shared}/**/*.test.{ts,tsx}'],
  },
});
