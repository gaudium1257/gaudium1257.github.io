import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // .vite 는 개발 서버가 만드는 의존성 캐시다. 소스가 아니므로 검사하지 않는다
  { ignores: ['**/dist', 'node_modules', 'coverage', '**/.vite', '**/components/ui/**'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // INV-4 — 타입 탈출구 금지. lint:arch 와 이중으로 막는다
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',

      // GR-4 — 에러를 삼키지 않는다
      'no-empty': ['error', { allowEmptyCatch: false }],
    },
  },
  // 빌드 설정과 하네스 도구는 Node 환경이다
  {
    files: ['**/vite.config.ts', 'vitest.config.ts', 'tools/**/*.mjs', '.claude/hooks/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
);
