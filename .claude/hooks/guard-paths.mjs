#!/usr/bin/env node
// PreToolUse(Write/Edit) — 불가침 경로·비밀·쓰기경계를 차단한다. INV-6, INV-7, INV-8, INV-9, INV-11.
import { readInput, relPath, block, ok } from './_lib.mjs';

const input = await readInput();
const ti = input.tool_input || {};
const file = relPath(ti.file_path, input.cwd);
if (!file) ok();

const content = [ti.content, ti.new_string].filter(Boolean).join('\n');

// --- INV-9: 자동 생성 문서 ---
if (/^docs\/generated\//.test(file) && !/^docs\/generated\/README\.md$/.test(file)) {
  block(
    `[INV-9 차단] ${file} 은 자동 생성 문서다. 손으로 고치지 마라.\n` +
      `고치는 법: 생성 스크립트(tools/scripts/)나 소스 코드를 고치고 'npm run docs:generate' 를 돌려라.\n` +
      `근거: docs/generated/README.md`,
  );
}

// --- INV-6: shadcn 생성물 ---
if (/(^|\/)components\/ui\//.test(file)) {
  block(
    `[INV-6 차단] ${file} 은 shadcn CLI 생성물이다. 직접 편집 금지.\n` +
      `고치는 법:\n` +
      `  - 색/간격/라운드 → Tailwind 테마 토큰을 고쳐라\n` +
      `  - variant/동작 변경 → shared/ui/ 에 래퍼 컴포넌트를 만들어라\n` +
      `  - 새 컴포넌트 → npx shadcn@latest add <name>\n` +
      `근거: docs/DESIGN.md · 스킬: /add-ui-component`,
  );
}

// --- INV-7: .env ---
if (/(^|\/)\.env(\.|$)/.test(file) && !/\.env\.example$/.test(file)) {
  block(
    `[INV-7 차단] ${file} 은 저장소에 들어가면 안 된다.\n` +
      `고치는 법: 키 '이름'만 .env.example 에 두고, 값은 사용자가 로컬에서 직접 넣게 하라.\n` +
      `근거: docs/SECURITY.md`,
  );
}

// --- INV-7: 비밀정보 리터럴 ---
const secretPatterns = [
  [/\bgh[pousr]_[A-Za-z0-9]{16,}/, 'GitHub 토큰'],
  [/\bsk-[A-Za-z0-9_-]{20,}/, 'API 시크릿 키'],
  [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, '개인 키'],
  [
    /\b(api[_-]?key|secret|password|passwd|token)\s*[:=]\s*["'][^"'\s]{12,}["']/i,
    '하드코딩된 자격 증명',
  ],
];
for (const [re, label] of secretPatterns) {
  if (re.test(content)) {
    block(
      `[INV-7 차단] ${file} 에 ${label} 로 보이는 값이 있다.\n` +
        `고치는 법: 환경변수로 옮기고 .env.example 에 이름만 남겨라.\n` +
        `주의: VITE_ 접두사 변수는 번들에 그대로 박힌다 — 비밀을 넣지 마라.\n` +
        `근거: docs/SECURITY.md`,
    );
  }
}

// --- INV-8: 공개 번들에 비밀은 없다 ---
const viteSecret = content.match(/VITE_\w*(?:TOKEN|SECRET|PASSWORD|APIKEY|API_KEY)\w*/i);
if (viteSecret) {
  block(
    `[INV-8 차단] ${file} 에 ${viteSecret[0]} 이 있다.\n` +
      `VITE_ 환경변수는 번들에 그대로 박히고, 이 사이트는 전부 공개된다.\n` +
      `고치는 법: 자격 증명을 빌드에 넣지 마라. 사용자가 런타임에 입력하고 sessionStorage 에 두는 방식이다.\n` +
      `근거: docs/SECURITY.md §3, ADR-0004`,
  );
}

// --- INV-11: 쓰기 경로는 admin 도메인 안에만 ---
if (/\.(ts|tsx)$/.test(file) && !file.startsWith('src/domains/admin/')) {
  const write = content.match(
    /\bapi\.github\.com\b|@octokit\/|method:\s*["'](?:POST|PUT|PATCH|DELETE)["']/i,
  );
  if (write) {
    block(
      `[INV-11 차단] ${file} 은 admin 도메인 밖인데 쓰기 경로("${write[0]}")를 담고 있다.\n` +
        `공개 화면은 GitHub API 가 필요 없다 — 콘텐츠는 빌드 타임에 content/ 에서 읽는다.\n` +
        `고치는 법: 이 코드를 src/domains/admin/ 안으로 옮겨라.\n` +
        `근거: CLAUDE.md INV-11, ADR-0004`,
    );
  }
}

ok();
