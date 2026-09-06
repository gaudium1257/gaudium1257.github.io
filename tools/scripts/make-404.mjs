#!/usr/bin/env node
/**
 * GitHub Pages 딥링크 폴백.
 *
 * Pages 는 정적 파일만 서빙하므로 /projects/foo 같은 클라이언트 라우트를 새로고침하면
 * 파일이 없어 404 가 난다. Pages 는 그때 404.html 을 돌려주는데, 그것이 앱 셸과 같으면
 * 브라우저가 앱을 띄우고 location.pathname 이 보존되어 라우터가 올바른 화면을 그린다.
 *
 * 해시 라우팅 대신 이 방식을 택한 이유: URL 이 깔끔하게 유지된다 (스펙 P-8).
 */
import { copyFileSync, existsSync } from 'node:fs';

const source = 'dist/index.html';
const target = 'dist/404.html';

if (!existsSync(source)) {
  console.error(`make-404: ${source} 가 없다. 먼저 vite build 를 실행하라.`);
  process.exit(1);
}

copyFileSync(source, target);
console.log('make-404: dist/404.html 생성 (딥링크 폴백)');
