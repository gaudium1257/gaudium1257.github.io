#!/usr/bin/env node
/**
 * 라우트별 정적 파일 생성 — GitHub Pages 딥링크가 200 을 돌려주게 만든다.
 *
 * 왜 필요한가: Pages 는 정적 파일만 서빙한다. /projects/foo 에 파일이 없으면 404.html 을
 * 돌려주는데, 앱 셸이라 화면은 뜨지만 **HTTP 상태가 404** 다. 크롤러·링크 미리보기는
 * 그것을 깨진 링크로 취급한다. 포트폴리오 링크를 심사자에게 보내는 사이트에서는 문제다.
 *
 * 콘텐츠 id 는 빌드 타임에 전부 알 수 있으므로, 라우트마다 앱 셸을 실제 파일로 복사해
 * 200 을 돌려주게 한다. 404.html 은 진짜 없는 경로를 위해 그대로 남긴다 (스펙 P-8).
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SHELL = 'dist/index.html';

if (!existsSync(SHELL)) {
  console.error(`prerender: ${SHELL} 가 없다. 먼저 vite build 를 실행하라.`);
  process.exit(1);
}

/** content/<dir> 의 JSON 파일 이름에서 라우트 id 를 얻는다. */
function idsIn(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

const routes = [
  'admin',
  ...idsIn('content/projects').map((id) => `projects/${id}`),
  ...idsIn('content/posts').map((id) => `posts/${id}`),
];

for (const route of routes) {
  const dir = join('dist', route);
  mkdirSync(dir, { recursive: true });
  copyFileSync(SHELL, join(dir, 'index.html'));
}

// 진짜 없는 경로를 위한 폴백은 유지한다
copyFileSync(SHELL, 'dist/404.html');

console.log(`prerender: 라우트 ${routes.length}개 + 404 폴백 생성`);
for (const route of routes) console.log(`  /${route}`);
