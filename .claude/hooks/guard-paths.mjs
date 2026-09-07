#!/usr/bin/env node
// PreToolUse(Write/Edit) — 불가침 경로·비밀·쓰기경계를 차단한다.
// INV-6, INV-7, INV-8, INV-9, INV-10.
import { readInput, relPath, block, ok } from './_lib.mjs';

const input = await readInput();
const ti = input.tool_input || {};
const file = relPath(ti.file_path, input.cwd);
if (!file) ok();

const content = [ti.content, ti.new_string].filter(Boolean).join('\n');

// --- INV-10: 자동 생성 문서 ---
if (/^docs\/generated\//.test(file) && !/^docs\/generated\/README\.md$/.test(file)) {
  block(
    `[INV-10 차단] ${file} 은 자동 생성 문서다. 손으로 고치지 마라.\n` +
      `고치는 법: 생성 스크립트(tools/scripts/)나 소스 코드를 고치고 'npm run docs:generate' 를 돌려라.\n` +
      `근거: docs/generated/README.md`,
  );
}

// --- INV-6: shadcn 생성물 ---
if (/(^|\/)components\/ui\//.test(file)) {
  block(
    `[INV-6 차단] ${file} 은 shadcn CLI 생성물이다. 직접 편집 금지.\n` +
      `고치는 법:\n` +
      `  - 색/간격/라운드 → 테마 토큰을 고쳐라 (다크 모드가 여기 달려 있다)\n` +
      `  - variant/동작 변경 → shared/ui/ 에 래퍼 컴포넌트를 만들어라\n` +
      `  - 새 컴포넌트 → npm run ui:add <name>\n` +
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
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/, 'GitHub 파인그레인드 토큰'],
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
        `주의: VITE_ 접두사 변수는 번들에 그대로 박힌다 — 비밀을 넣을 수 없다.\n` +
        `근거: docs/SECURITY.md`,
    );
  }
}
const viteSecret = content.match(/VITE_\w*(?:TOKEN|SECRET|PASSWORD|APIKEY|API_KEY)\w*/i);
if (viteSecret) {
  block(
    `[INV-7 차단] ${file} 에 ${viteSecret[0]} 이 있다.\n` +
      `VITE_ 환경변수는 번들에 그대로 박히고, viewer 는 공개 사이트다.\n` +
      `고치는 법: 자격 증명을 빌드에 넣지 마라.\n` +
      `근거: docs/SECURITY.md`,
  );
}

// --- INV-8: viewer 는 읽기 전용 ---
if (/^viewer\//.test(file) && /\.(ts|tsx)$/.test(file)) {
  const write = content.match(
    /method:\s*["'](?:POST|PUT|PATCH|DELETE)["']|\bapi\.github\.com\b|@octokit\//i,
  );
  if (write) {
    block(
      `[INV-8 차단] ${file} — viewer 는 콘텐츠를 쓰지 않는다 ("${write[0]}" 발견).\n` +
        `쓰기 경로는 admin/ 에만 존재한다. viewer 는 빌드 타임에 content/ 를 읽을 뿐이다.\n` +
        `고치는 법: 이 로직을 admin/ 으로 옮겨라. 정말 viewer 에 필요하다면 ADR 을 먼저 써라.\n` +
        `근거: CLAUDE.md INV-8, ARCHITECTURE.md §4`,
    );
  }
}

// --- INV-9: 콘텐츠 스키마는 shared/content 에만 ---
//
// data/ 레이어는 예외다 (CLAUDE.md INV-9 괄호, check-architecture.mjs 와 같은 규칙).
// 거기서의 스키마는 콘텐츠 모델이 아니라 HTTP 응답 같은 '전송 형태'를 경계에서
// 파싱하는 것이고, 그건 INV-3 이 요구하는 일이다. 막으면 `as` 캐스팅을 유도해 더 나빠진다.
const isBoundaryLayer = /(?:^|\/)data\//.test(file);
if (!isBoundaryLayer && /^(viewer|admin)\/.*\.(ts|tsx)$/.test(file)) {
  const schema = content.match(/\bz\.object\s*\(|\bz\.enum\s*\(|from\s+["']zod["']/);
  if (schema) {
    block(
      `[INV-9 차단] ${file} 에서 스키마를 정의하려 한다 ("${schema[0]}").\n` +
        `콘텐츠 타입과 Zod 스키마는 shared/content/ 에만 존재한다.\n` +
        `두 앱 구조에서 가장 큰 위험은 스키마가 갈라지는 것이다 — 에이전트는 한쪽만 보고 고친다.\n` +
        `고치는 법: shared/content 에 정의하고 여기서는 import 만 하라.\n` +
        `근거: CLAUDE.md INV-9, ARCHITECTURE.md §2 (CB-10)`,
    );
  }
}

ok();
