#!/usr/bin/env node
// PostToolUse(Write|Edit) — 편집 직후 불변식 위반을 즉시 되돌려준다.
// 권위 있는 검사는 'npm run lint:arch'. 이 훅은 빠른 피드백용이다.
import { readFileSync } from 'node:fs';
import { readInput, relPath, posixJoin, block, ok, setState } from './_lib.mjs';

const input = await readInput();
const file = relPath((input.tool_input || {}).file_path, input.cwd);
if (!file) ok();

if (/\.(ts|tsx|js|jsx|mjs|css)$/.test(file)) setState('last-source-edit', Date.now());
if (!/\.(ts|tsx)$/.test(file)) ok();
if (/(^|\/)components\/ui\//.test(file)) ok(); // 생성물은 검사 대상 아님

let src = '';
try {
  src = readFileSync(file, 'utf8');
} catch {
  ok();
}

const lines = src.split('\n');
const problems = [];

// --- INV-5: 파일 예산 ---
if (lines.length > 400 && !file.endsWith('.d.ts')) {
  problems.push(
    `[INV-5] ${file} 이 ${lines.length}줄이다 (상한 400).\n` +
      `  고치는 법: 책임 단위로 쪼개라. 레이어가 섞여 있다면 그게 원인이다 (GR-6).`,
  );
}

// --- INV-4: 타입 탈출구 ---
const escapes = [];
lines.forEach((l, i) => {
  if (/@ts-ignore/.test(l)) escapes.push(`${i + 1}: @ts-ignore`);
  if (/eslint-disable/.test(l)) escapes.push(`${i + 1}: eslint-disable`);
  if (/(:|<|\bas\s+)\s*any\b/.test(l) && !/^\s*(\/\/|\*)/.test(l)) escapes.push(`${i + 1}: any`);
});
if (escapes.length) {
  problems.push(
    `[INV-4] ${file} 에 타입 탈출구가 있다:\n    ${escapes.join('\n    ')}\n` +
      `  고치는 법: 실제 타입을 맞춰라. 불가피하면 @ts-expect-error + 한 줄 사유 +\n` +
      `  docs/exec-plans/tech-debt-tracker.md 등록.`,
  );
}

// --- INV-1 / INV-2: 레이어와 도메인 경계 ---
const LAYERS = ['types', 'config', 'data', 'service', 'state', 'ui'];
const m = file.match(/(?:^|\/)domains\/([^/]+)\/([^/]+)\//);
if (m && LAYERS.includes(m[2])) {
  const [, domain, layer] = m;
  const li = LAYERS.indexOf(layer);
  const dir = file.split('/').slice(0, -1).join('/');
  const imports = [...src.matchAll(/from\s+["']([^"']+)["']/g)].map((x) => x[1]);

  for (const spec of imports) {
    // 상대 경로는 실제 위치로 해석해야 도메인/레이어를 정확히 판정할 수 있다
    const abs = spec.startsWith('.') ? posixJoin(dir, spec) : spec;
    const other = abs.match(/(?:^|\/)domains\/([^/]+)/);

    if (other && other[1] !== domain) {
      problems.push(
        `[INV-2] ${file} 이 다른 도메인 '${other[1]}' 을 직접 import 한다: ${spec}\n` +
          `  고치는 법: 공유가 필요하면 shared/ 로 승격하라. 도메인 간 직접 참조는 금지다.`,
      );
      continue;
    }
    const up = abs.match(/(?:^|\/)domains\/[^/]+\/(types|config|data|service|state|ui)(?:\/|$)/);
    if (up && LAYERS.indexOf(up[1]) > li) {
      problems.push(
        `[INV-1] ${file} (레이어 '${layer}') 이 상위 레이어 '${up[1]}' 를 import 한다: ${spec}\n` +
          `  의존 방향은 ${LAYERS.join(' → ')} 한 방향뿐이다.\n` +
          `  고치는 법: 로직을 아래 레이어로 내리거나 의존을 인자로 주입하라. 근거: ARCHITECTURE.md §3`,
      );
    }
    if (/(^|\/)shared\/ui(\/|$)/.test(spec) && layer !== 'ui') {
      problems.push(
        `[INV-1] ${file} (레이어 '${layer}') 이 shared/ui 를 import 한다.\n` +
          `  고치는 법: UI 프리미티브는 ui 레이어에서만 쓴다.`,
      );
    }
  }
}

// --- INV-3 힌트 (신호) ---
if (
  /(^|\/)data\//.test(file) &&
  /\bawait\s+fetch\(|\.json\(\)|import\.meta\.glob/.test(src) &&
  !/\.(parse|safeParse)\(/.test(src)
) {
  problems.push(
    `[INV-3] ${file} 이 외부 데이터를 읽지만 스키마 파싱(.parse/.safeParse)이 보이지 않는다.\n` +
      `  고치는 법: 경계에서 파싱한 뒤 도메인 타입만 반환하라. 'as' 로 형태를 주장하지 마라 (GR-2).`,
  );
}

// --- DESIGN: 하드코딩된 색 (다크 모드를 깨뜨린다) ---
const hardColor = src.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)/);
if (hardColor && !/\.css$/.test(file)) {
  problems.push(
    `[DESIGN] ${file} 에 하드코딩된 색이 있다: ${hardColor[0]}\n` +
      `  테마 토글은 토큰만 바꾼다. 하드코딩된 색은 다크 모드에서 그대로 남아 깨진다.\n` +
      `  고치는 법: 테마 토큰으로 표현하라. 근거: docs/DESIGN.md`,
  );
}

if (problems.length) {
  block(
    `편집한 파일이 불변식을 어겼다. 다음 작업으로 넘어가기 전에 고쳐라:\n\n` +
      problems.join('\n\n') +
      `\n\n전체 검사: npm run verify`,
  );
}
ok();
