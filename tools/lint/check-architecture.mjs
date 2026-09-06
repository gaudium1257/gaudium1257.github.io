#!/usr/bin/env node
/**
 * 아키텍처 린터 — INV-1, INV-2, INV-4, INV-5, INV-8, INV-11 을 강제한다.
 * 이것이 권위 있는 검사다. .claude/hooks/post-edit-check.mjs 는 같은 규칙의 빠른 미리보기다.
 * 규칙 원문: ARCHITECTURE.md
 * 근거: docs/design-docs/adr/0002-layered-architecture.md, .../0004-single-app-admin-mode.md
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';

const LAYERS = ['types', 'config', 'data', 'service', 'state', 'ui'];
const MAX_FILE_LINES = 400;
const MAX_FN_LINES = 60;
const ROOTS = ['src'];

/** 쓰기 경로가 존재해도 되는 유일한 도메인 (INV-11) */
const ADMIN_DOMAIN = 'src/domains/admin/';

const toPosix = (p) => p.split(sep).join('/');
const errors = [];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e === '.vite') continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(e)) out.push(full);
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r));

if (files.length === 0) {
  console.log(
    'lint:arch 건너뜀 — 검사할 소스가 없다.\n' +
      '  이것은 통과가 아니다. 애플리케이션 스캐폴드가 아직 없다는 뜻이다.\n' +
      '  → docs/exec-plans/active/0001-bootstrap-scaffold.md',
  );
  process.exit(0);
}

for (const file of files) {
  const posix = toPosix(file);
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const isGenerated = /\/components\/ui\//.test(posix);

  // ---- INV-5: 파일 예산
  if (!isGenerated && !posix.endsWith('.d.ts') && lines.length > MAX_FILE_LINES) {
    errors.push(
      `[INV-5] ${posix}: ${lines.length}줄 (상한 ${MAX_FILE_LINES})\n` +
        `  고치는 법: 책임 단위로 쪼개라. 한 파일에 레이어가 섞여 있다면 그게 원인이다 (GR-6).`,
    );
  }

  // ---- INV-4: 타입 탈출구
  if (!isGenerated) {
    lines.forEach((l, i) => {
      if (/@ts-ignore/.test(l)) {
        errors.push(
          `[INV-4] ${posix}:${i + 1} @ts-ignore 금지.\n` +
            `  고치는 법: 타입을 실제로 맞춰라. 불가피하면 @ts-expect-error + 사유 + tech-debt-tracker 등록.`,
        );
      }
      if (/eslint-disable/.test(l)) {
        errors.push(
          `[INV-4] ${posix}:${i + 1} eslint-disable 금지.\n` +
            `  고치는 법: 규칙을 만족시키거나, 규칙 자체가 틀렸다면 ADR 로 제안하라.`,
        );
      }
      if (/(:|<|\bas\s+)\s*any\b/.test(l) && !/^\s*(\/\/|\*)/.test(l)) {
        errors.push(
          `[INV-4] ${posix}:${i + 1} any 금지.\n` +
            `  고치는 법: 외부 입력이라면 unknown 으로 받아 스키마로 파싱하라 (INV-3).`,
        );
      }
    });
  }

  // ---- INV-1 / INV-2: 레이어와 도메인 경계
  const m = posix.match(/(?:^|\/)domains\/([^/]+)\/([^/]+)\//);
  const imports = [...src.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)].map((x) => x[1]);

  if (m && LAYERS.includes(m[2])) {
    const [, domain, layer] = m;
    const li = LAYERS.indexOf(layer);

    for (const spec of imports) {
      // 상대 경로를 실제 위치로 해석해야 도메인/레이어를 정확히 판정할 수 있다
      const abs = spec.startsWith('.') ? toPosix(join(dirname(file), spec)) : spec;

      const other = abs.match(/(?:^|\/)domains\/([^/]+)/);
      if (other && other[1] !== domain) {
        errors.push(
          `[INV-2] ${posix} → 다른 도메인 '${other[1]}' 직접 import: ${spec}\n` +
            `  고치는 법: 공유가 필요하면 shared/ 로 승격하라. 도메인 간 직접 참조는 금지다.`,
        );
        continue;
      }
      const up = abs.match(/(?:^|\/)domains\/[^/]+\/(types|config|data|service|state|ui)(?:\/|$)/);
      if (up && LAYERS.indexOf(up[1]) > li) {
        errors.push(
          `[INV-1] ${posix} (레이어 '${layer}') → 상위 레이어 '${up[1]}' import: ${spec}\n` +
            `  의존 방향은 ${LAYERS.join(' → ')} 한 방향뿐이다.\n` +
            `  고치는 법: 로직을 아래 레이어로 내리거나 의존을 인자로 주입하라. 근거: ARCHITECTURE.md §2`,
        );
      }
      if (/(^|\/)shared\/ui(\/|$)/.test(spec) && layer !== 'ui') {
        errors.push(
          `[INV-1] ${posix} (레이어 '${layer}') → shared/ui import.\n` +
            `  고치는 법: UI 프리미티브는 ui 레이어에서만 쓴다.`,
        );
      }
    }

    // 레이어별 금지 사항
    if (layer === 'ui' && /\bawait\s+fetch\(|\.safeParse\(|\bz\.object\(/.test(src)) {
      errors.push(
        `[INV-1] ${posix}: ui 레이어에서 페칭/스키마 파싱을 한다.\n` +
          `  고치는 법: 데이터 접근은 data/, 파싱은 경계에서. ui 는 state 훅으로 값을 받는다.`,
      );
    }
    if ((layer === 'service' || layer === 'data') && /from\s+["']react["']/.test(src)) {
      errors.push(
        `[INV-1] ${posix}: ${layer} 레이어가 react 를 import 한다.\n` +
          `  고치는 법: React 의존은 state/ui 레이어에만 둔다.`,
      );
    }
    if (layer === 'types' && imports.some((s) => s.startsWith('.'))) {
      errors.push(
        `[INV-1] ${posix}: types 레이어는 내부 모듈을 import 하지 않는다.\n` +
          `  고치는 법: 타입 정의만 남기고 나머지는 아래 레이어로 옮겨라.`,
      );
    }
  }

  // ---- app/ 은 아무도 import 하지 않는다 (엔트리 포인트는 예외 — 앱을 부트스트랩해야 한다)
  const isEntry = posix === 'src/main.tsx';
  if (!isEntry && !/(?:^|\/)app\//.test(posix)) {
    for (const spec of imports) {
      if (/(?:^|\/)app\//.test(spec)) {
        errors.push(
          `[INV-1] ${posix} → app/ import: ${spec}\n` +
            `  고치는 법: app/ 은 조립 전용이다. 필요한 것을 아래로 내려라.`,
        );
      }
    }
  }

  // ---- INV-11: 쓰기 경로는 admin 도메인 안에만 존재한다
  if (!posix.startsWith(ADMIN_DOMAIN)) {
    if (/\bapi\.github\.com\b|@octokit\//.test(src)) {
      errors.push(
        `[INV-11] ${posix}: admin 도메인 밖에서 GitHub API 를 사용한다.\n` +
          `  콘텐츠는 빌드 타임에 content/ 에서 읽는다 — 공개 화면은 GitHub API 가 필요 없다.\n` +
          `  고치는 법: 이 코드를 ${ADMIN_DOMAIN} 로 옮겨라. 근거: ADR-0004, CLAUDE.md INV-11`,
      );
    }
    if (/method:\s*["'](POST|PUT|PATCH|DELETE)["']/i.test(src)) {
      errors.push(
        `[INV-11] ${posix}: admin 도메인 밖에 쓰기 요청이 있다.\n` +
          `  고치는 법: 모든 쓰기는 ${ADMIN_DOMAIN} 안에서만. 근거: CLAUDE.md INV-11`,
      );
    }
  }

  // ---- 공급망: shadcn CLI 가 잘못 생성하는 무관한 'cn' 패키지 (docs/SECURITY.md §7)
  if (/from\s+["']cn["']/.test(src)) {
    errors.push(
      `[공급망] ${posix}: 무관한 npm 패키지 'cn' 을 import 한다.\n` +
        `  shadcn CLI 가 utils 별칭을 잘못 해석해 생기는 문제다.\n` +
        `  고치는 법: npm run ui:fix  (컴포넌트 추가는 npm run ui:add 를 쓴다)`,
    );
  }

  // ---- INV-8: 공개 번들에 비밀은 없다
  const secretLiterals = [
    [/\bgh[pousr]_[A-Za-z0-9]{16,}/, 'GitHub 토큰'],
    [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, '개인 키'],
    [
      /\b(api[_-]?key|secret|password|passwd|token)\s*[:=]\s*["'][^"'\s]{12,}["']/i,
      '하드코딩된 자격 증명',
    ],
  ];
  for (const [re, label] of secretLiterals) {
    if (re.test(src)) {
      errors.push(
        `[INV-8] ${posix}: ${label} 로 보이는 값이 소스에 있다.\n` +
          `  이 사이트는 전부 공개된다. 번들에 넣은 비밀은 비밀이 아니다.\n` +
          `  고치는 법: 자격 증명은 사용자가 런타임에 입력하게 하라. 근거: docs/SECURITY.md §3`,
      );
    }
  }
  const viteSecret = src.match(/import\.meta\.env\.(VITE_\w*(?:TOKEN|SECRET|KEY|PASSWORD)\w*)/i);
  if (viteSecret) {
    errors.push(
      `[INV-8] ${posix}: ${viteSecret[1]} — VITE_ 환경변수는 번들에 그대로 박힌다.\n` +
        `  고치는 법: 비밀을 환경변수로 옮겨도 공개된다. 런타임 입력으로 바꿔라. 근거: docs/SECURITY.md §3`,
    );
  }

  // ---- INV-5: 함수 길이 (러프 추정 — 중괄호 깊이)
  if (!isGenerated) {
    let depth = 0,
      start = -1,
      name = '';
    lines.forEach((l, i) => {
      const fn = l.match(/(?:function\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\()/);
      if (fn && depth === 0) {
        start = i;
        name = fn[1] || fn[2];
      }
      depth += (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
      if (depth <= 0 && start !== -1) {
        if (i - start > MAX_FN_LINES) {
          errors.push(
            `[INV-5] ${posix}:${start + 1} 함수 '${name}' 이 ${i - start}줄 (상한 ${MAX_FN_LINES}).\n` +
              `  고치는 법: 의미 단위로 추출하라.`,
          );
        }
        start = -1;
        depth = 0;
      }
    });
  }
}

if (errors.length) {
  console.error(`\nlint:arch 실패 — ${errors.length}건 (파일 ${files.length}개 검사)\n`);
  for (const e of errors) console.error(e + '\n');
  console.error('규칙 원문: ARCHITECTURE.md · 규칙을 바꿔야 한다면 ADR 을 먼저 써라.');
  process.exit(1);
}
console.log(`lint:arch 통과 (파일 ${files.length}개)`);
