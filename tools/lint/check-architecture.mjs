#!/usr/bin/env node
/**
 * 아키텍처 린터 — INV-1, INV-2, INV-4, INV-5, INV-8, INV-9 를 강제한다.
 * 이것이 권위 있는 검사다. .claude/hooks/post-edit-check.mjs 는 같은 규칙의 빠른 미리보기다.
 * 규칙 원문: ARCHITECTURE.md · 근거: docs/design-docs/adr/0002-layered-architecture.md
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';

const LAYERS = ['types', 'config', 'data', 'service', 'state', 'ui'];
const MAX_FILE_LINES = 400;
const MAX_FN_LINES = 60;
const ROOTS = ['viewer/src', 'admin/src', 'shared'];

/** 콘텐츠 스키마가 존재해도 되는 유일한 위치 (INV-9) */
const SCHEMA_HOME = 'shared/content/';

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
  const isTest = /\.test\.tsx?$/.test(posix);

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
            `  고치는 법: 타입을 맞춰라. 불가피하면 @ts-expect-error + 사유 + tech-debt-tracker 등록.`,
        );
      }
      if (/eslint-disable/.test(l)) {
        errors.push(
          `[INV-4] ${posix}:${i + 1} eslint-disable 금지.\n` +
            `  고치는 법: 규칙을 만족시키거나, 규칙이 틀렸다면 ADR 로 제안하라.`,
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

  // ---- INV-9: 콘텐츠 스키마는 shared/content 에만
  //
  // data/ 레이어는 예외다. 거기서의 스키마는 콘텐츠 모델이 아니라 HTTP 응답 같은
  // '전송 형태'를 경계에서 파싱하는 것이고, 그건 INV-3 이 요구하는 일이다.
  // 이걸 막으면 오히려 `as` 캐스팅을 유도해 더 나빠진다.
  const isBoundary = /(?:^|\/)data\//.test(posix);
  if (!posix.startsWith(SCHEMA_HOME) && !isGenerated && !isTest && !isBoundary) {
    const schema = src.match(/\bz\.object\s*\(|\bz\.enum\s*\(|\bz\.discriminatedUnion\s*\(/);
    if (schema) {
      errors.push(
        `[INV-9] ${posix}: 스키마를 정의한다 ("${schema[0]}").\n` +
          `  콘텐츠 타입과 Zod 스키마는 ${SCHEMA_HOME} 에만 존재한다.\n` +
          `  두 앱 구조에서 가장 큰 위험은 스키마가 갈라지는 것이다 — 에이전트는 한쪽만 보고 고친다.\n` +
          `  고치는 법: ${SCHEMA_HOME} 에 정의하고 여기서는 import 만 하라. 근거: ARCHITECTURE.md §2`,
      );
    }
  }

  // ---- INV-1 / INV-2: 레이어와 도메인 경계
  //
  // 공유 패키지(shared/<pkg>/<layer>/)에도 같은 레이어 규칙을 적용한다 (ADR-0005).
  // 공유로 옮겼다고 레이어 규율이 느슨해지면 안 된다.
  const m =
    posix.match(/(?:^|\/)domains\/([^/]+)\/([^/]+)\//) ??
    posix.match(/^shared\/([^/]+)\/([^/]+)\//);
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
      const up = abs.match(
        /(?:^|\/)(?:domains|shared)\/[^/]+\/(types|config|data|service|state|ui)(?:\/|$)/,
      );
      if (up && LAYERS.indexOf(up[1]) > li) {
        errors.push(
          `[INV-1] ${posix} (레이어 '${layer}') → 상위 레이어 '${up[1]}' import: ${spec}\n` +
            `  의존 방향은 ${LAYERS.join(' → ')} 한 방향뿐이다.\n` +
            `  고치는 법: 로직을 아래로 내리거나 의존을 인자로 주입하라. 근거: ARCHITECTURE.md §3`,
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
    if (layer === 'ui' && /\bawait\s+fetch\(|\.safeParse\(|import\.meta\.glob/.test(src)) {
      errors.push(
        `[INV-1] ${posix}: ui 레이어에서 데이터 로딩/파싱을 한다.\n` +
          `  고치는 법: 로딩은 data/, 파싱은 경계에서. ui 는 state 훅으로 값을 받는다.`,
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
          `  고치는 법: 타입만 남기고 나머지는 아래 레이어로 옮겨라 (스키마는 shared/content).`,
      );
    }
  }

  // ---- app/ 은 아무도 import 하지 않는다 (엔트리 포인트는 예외)
  const isEntry = /(?:^|\/)src\/main\.tsx$/.test(posix);
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

  // ---- INV-8: viewer 는 읽기 전용
  if (posix.startsWith('viewer/')) {
    const write = src.match(
      /method:\s*["'](POST|PUT|PATCH|DELETE)["']|\bapi\.github\.com\b|@octokit\//i,
    );
    if (write) {
      errors.push(
        `[INV-8] ${posix}: viewer 에 쓰기 경로가 있다 ("${write[0]}").\n` +
          `  viewer 는 빌드 타임에 content/ 를 읽을 뿐이다.\n` +
          `  고치는 법: admin/ 으로 옮겨라. 근거: CLAUDE.md INV-8, ARCHITECTURE.md §4`,
      );
    }
  }

  // ---- 파일시스템 접근은 개발 서버 미들웨어의 책임이다 (ADR-0003, docs/SECURITY.md)
  if (/from\s+["'](?:node:)?fs(?:\/promises)?["']/.test(src)) {
    errors.push(
      `[ADR-0003] ${posix}: 앱 소스가 파일시스템을 직접 만진다.\n` +
        `  파일 접근은 admin 개발 서버 미들웨어(vite.config)의 책임이다.\n` +
        `  앱 코드에 넣으면 브라우저에서 깨지고, 빌드 산출물에 새어 들어갈 수 있다.\n` +
        `  고치는 법: 미들웨어에 두고 앱은 HTTP 로 호출하라. 근거: docs/design-docs/adr/0003-content-store.md`,
    );
  }

  // ---- 공급망: shadcn CLI 가 잘못 생성하는 무관한 'cn' 패키지 (docs/SECURITY.md)
  if (/from\s+["']cn["']/.test(src)) {
    errors.push(
      `[공급망] ${posix}: 무관한 npm 패키지 'cn' 을 import 한다.\n` +
        `  shadcn CLI 가 utils 별칭을 잘못 해석해 생기는 문제다.\n` +
        `  고치는 법: npm run ui:fix  (컴포넌트 추가는 npm run ui:add 를 쓴다)`,
    );
  }

  // ---- DESIGN: 하드코딩된 색은 다크 모드를 깨뜨린다
  if (!isGenerated && !isTest) {
    const hardColor = src.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)/);
    if (hardColor) {
      errors.push(
        `[DESIGN] ${posix}: 하드코딩된 색 ${hardColor[0]}\n` +
          `  테마 토글은 토큰만 바꾼다. 하드코딩된 색은 다크 모드에서 그대로 남아 깨진다.\n` +
          `  고치는 법: 테마 토큰으로 표현하라. 근거: docs/DESIGN.md`,
      );
    }
  }

  // ---- INV-5: 함수 길이 (중괄호 깊이로 추정)
  if (!isGenerated) {
    let depth = 0;
    let start = -1;
    let name = '';
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
